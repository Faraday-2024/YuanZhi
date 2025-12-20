import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { 
  GEMINI_API_KEY, 
  GEMINI_TEXT_MODEL, 
  GEMINI_IMAGE_MODEL,
  USE_OPENAI_COMPATIBLE,
  OPENAI_API_BASE,
  OPENAI_API_KEY,
  OPENAI_MODEL
} from "@/config/constants";

// ============================================================================
// Error Handling
// ============================================================================

export class GeminiServiceError extends Error {
  constructor(
    message: string,
    public code: 'NETWORK' | 'AUTH' | 'RATE_LIMIT' | 'PARSE',
    public retryable: boolean
  ) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

// ============================================================================
// Retry Logic
// ============================================================================

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on auth errors
      if (error instanceof GeminiServiceError && error.code === 'AUTH') {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      await sleep(delayMs * Math.pow(2, attempt));
    }
  }
  
  throw lastError || new Error('Unknown error during retry');
}

// ============================================================================
// Problem Solver Types
// ============================================================================

// Exam Prep Types
export interface AnalysisStep {
  stepId: number;
  stepTitle: string;
  stepExplanation: string;
  visualType: 'svg' | 'image' | 'html_3d' | 'none';
  svgCode?: string;
  htmlCode?: string;
  imagePrompt?: string;
  generatedImageUrl?: string;
}

export interface AnalysisResult {
  title: string;
  summary: string;
  steps: AnalysisStep[];
  keyConcepts: string[];
}

// Topic Mode Types
export interface GeneratedProblem {
  question: string;
  hints: string[];
  solution: string;
}

// Exploration Mode Types
export type Character = '第谷·布拉赫' | '约翰内斯·开普勒' | '档案馆中枢';

// ============================================================================
// AI Client Initialization
// ============================================================================

const getAIClient = () => {
  if (USE_OPENAI_COMPATIBLE) {
    if (!OPENAI_API_KEY) {
      throw new GeminiServiceError(
        '请在.env.local文件中配置VITE_OPENAI_API_KEY',
        'AUTH',
        false
      );
    }
    // Return a mock client that will use OpenAI compatible API
    return null as any;
  }
  
  if (!GEMINI_API_KEY) {
    throw new GeminiServiceError(
      '请在.env.local文件中配置VITE_GEMINI_API_KEY',
      'AUTH',
      false
    );
  }
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
};

// ============================================================================
// OpenAI Compatible API Helper
// ============================================================================

const callOpenAICompatible = async (messages: any[], responseFormat?: any): Promise<string> => {
  const response = await fetch(`${OPENAI_API_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: messages,
      ...(responseFormat && { response_format: responseFormat })
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API Error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// ============================================================================
// Problem Solver Mode Functions
// ============================================================================

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise title for the problem."
    },
    summary: {
      type: Type.STRING,
      description: "A brief 2-3 sentence overview.",
    },
    steps: {
      type: Type.ARRAY,
      description: "The detailed solution broken down into logical steps.",
      items: {
        type: Type.OBJECT,
        properties: {
          stepId: { type: Type.INTEGER },
          stepTitle: { type: Type.STRING },
          stepExplanation: { 
            type: Type.STRING, 
            description: "Detailed explanation. Use LaTeX for math." 
          },
          visualType: {
            type: Type.STRING,
            enum: ["svg", "image", "html_3d", "none"],
            description: "Select 'html_3d' for 3D GEOMETRY or MOVING PHYSICS. Select 'svg' for 2D graphs/diagrams. Select 'image' ONLY for realistic scenes impossible to code."
          },
          svgCode: {
            type: Type.STRING,
            description: "REQUIRED if visualType is 'svg'. Full <svg> code."
          },
          htmlCode: {
            type: Type.STRING,
            description: "REQUIRED if visualType is 'html_3d'. A complete, self-contained HTML string. MUST use ES Modules for Three.js."
          },
          imagePrompt: {
            type: Type.STRING,
            description: "REQUIRED if visualType is 'image'. A HIGHLY SPECIFIC, SCENE-BASED prompt."
          }
        },
        required: ["stepId", "stepTitle", "stepExplanation", "visualType"]
      }
    },
    keyConcepts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    }
  },
  required: ["title", "summary", "steps", "keyConcepts"],
};

export const analyzeProblemImage = async (
  base64Image: string, 
  mimeType: string
): Promise<AnalysisResult> => {
  try {
    // For OpenAI compatible API, we need to handle image analysis differently
    if (USE_OPENAI_COMPATIBLE) {
      const prompt = `你是一位追求极致精确的理科教材编辑和全栈工程师。请分析这张题目图片。

核心任务：拆解步骤，并生成交互式或像素级精确的视觉辅助。

视觉引擎选择协议：

1. TYPE: html_3d (3D几何/复杂运动学) [优先级: 高]
   - 场景: 立体几何（球体、锥体、相交面）、天体运动、复杂力学系统
   - 输出: 完整的可执行HTML字符串
   - 技术要求: 使用ES Modules导入Three.js (https://esm.sh/three@0.160.0)
   - 必须包含: OrbitControls、场景、相机、渲染器、光照、动画循环

2. TYPE: svg (2D几何/函数图像/简单受力分析) [优先级: 中]
   - 准确性: 必须根据题目数值精确计算坐标
   - 坐标系: viewBox="0 0 400 300"
   - 样式: stroke-width="2"或"3"，font-size="16"
   - 动态: 使用animate标签展示变化

3. TYPE: image (仅用于真实场景) [优先级: 低]
   - 仅用于无法用代码描述的真实场景（如游泳、细胞等）

输出要求：
- 严格遵守JSON格式
- 数学公式使用LaTeX语法（用$包裹）
- 解释语言：中文
- HTML/SVG代码必须是有效的字符串，不能包含未转义的引号或换行符

返回格式：
{
  "title": "题目标题",
  "summary": "简要概述",
  "steps": [
    {
      "stepId": 1,
      "stepTitle": "步骤标题",
      "stepExplanation": "详细解释（使用LaTeX公式）",
      "visualType": "svg或image或html_3d或none",
      "svgCode": "如果visualType是svg则必填（完整SVG代码）",
      "htmlCode": "如果visualType是html_3d则必填（完整HTML代码）",
      "imagePrompt": "如果visualType是image则必填（详细场景描述）"
    }
  ],
  "keyConcepts": ["概念1", "概念2"]
}`;
      
      try {
        const responseText = await callOpenAICompatible([
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ], { type: 'json_object' });
        
        // Clean up the response text to handle potential JSON issues
        const cleanedText = responseText.trim();
        
        // Try to parse the JSON
        const result = JSON.parse(cleanedText) as AnalysisResult;
        return result;
      } catch (parseError: any) {
        console.error("JSON Parse Error:", parseError);
        console.error("Response text (first 500 chars):", parseError.message);
        throw new GeminiServiceError('AI返回的数据格式错误，请重试', 'PARSE', true);
      }
    }

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `你是一位追求极致精确的理科教材编辑和全栈工程师。请分析这张题目图片。
            
            核心任务：**拆解步骤，并生成"交互式"或"像素级精确"的视觉辅助**

            请严格遵循以下【视觉引擎选择协议 (Visual Engine Protocol)】：

            1. **TYPE: html_3d (3D几何 / 复杂运动学)** [PRIORITY: HIGH]
               - **场景**: 题目涉及立体几何（球体、锥体、相交面）、天体运动、复杂的力学系统。
               - **输出要求**: 返回一段完整的、可直接执行的 HTML 字符串。
               - **技术栈强制要求 (ES Modules)**:
                 必须使用以下模板结构，确保库能正确加载且不白屏：
                 \`\`\`html
                 <!DOCTYPE html>
                 <html>
                 <head>
                   <meta charset="UTF-8">
                   <style>
                     body { margin: 0; overflow: hidden; background-color: #f8fafc; font-family: system-ui; } 
                     canvas { display: block; width: 100%; height: 100%; }
                     #info { position: absolute; top: 10px; left: 10px; color: #64748b; font-size: 12px; background: rgba(255,255,255,0.9); padding: 8px 12px; border-radius: 6px; }
                   </style>
                 </head>
                 <body>
                   <div id="info">拖动旋转 | 滚轮缩放</div>
                   <script type="module">
                     import * as THREE from 'https://esm.sh/three@0.160.0';
                     import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls';

                     const scene = new THREE.Scene();
                     scene.background = new THREE.Color(0xf8fafc);
                     
                     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                     camera.position.set(3, 3, 5);
                     
                     const renderer = new THREE.WebGLRenderer({ antialias: true });
                     renderer.setSize(window.innerWidth, window.innerHeight);
                     renderer.setPixelRatio(window.devicePixelRatio);
                     document.body.appendChild(renderer.domElement);

                     const controls = new OrbitControls(camera, renderer.domElement);
                     controls.enableDamping = true;
                     controls.dampingFactor = 0.05;

                     // 添加网格辅助线（可选，帮助理解空间）
                     const gridHelper = new THREE.GridHelper(10, 10, 0xe2e8f0, 0xf1f5f9);
                     scene.add(gridHelper);

                     // 添加坐标轴辅助线（可选）
                     const axesHelper = new THREE.AxesHelper(5);
                     scene.add(axesHelper);

                     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
                     scene.add(ambientLight);
                     const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
                     dirLight.position.set(5, 10, 7);
                     dirLight.castShadow = true;
                     scene.add(dirLight);

                     // --- 在此处编写题目特定的几何体/动画逻辑 ---
                     // 重要提示：
                     // 1. 使用准确的数值和比例，不要随意估算
                     // 2. 为关键几何体添加标签（使用CSS2DRenderer或简单的文字纹理）
                     // 3. 使用不同颜色区分不同部分
                     // 4. 添加适当的材质（MeshStandardMaterial或MeshPhongMaterial）以增强立体感

                     function animate() {
                       requestAnimationFrame(animate);
                       controls.update();
                       renderer.render(scene, camera);
                     }
                     animate();

                     window.addEventListener('resize', () => {
                       camera.aspect = window.innerWidth / window.innerHeight;
                       camera.updateProjectionMatrix();
                       renderer.setSize(window.innerWidth, window.innerHeight);
                     });
                   </script>
                 </body>
                 </html>
                 \`\`\`

            2. **TYPE: svg (2D 几何 / 函数图像 / 简单受力分析)** [PRIORITY: MEDIUM]
               - **准确性**: 严禁"大概画一下"。必须根据题目数值精确计算坐标。
               - **坐标系**: 使用 viewBox="0 0 600 400" 提供更大的绘图空间，减少元素重叠。
               - **样式规范**:
                 * stroke-width="2" 或 "3"
                 * font-size="14" 或 "16"
                 * 使用清晰的颜色对比（如 stroke="#2563eb" fill="none"）
                 * 重要元素使用 stroke-width="3" 加粗
               - **标注要求**:
                 * 所有关键点必须标注坐标或名称
                 * 使用 <text> 元素，确保 x, y 坐标不与图形重叠
                 * 文字背景使用 <rect> 增加可读性
               - **动态**: 使用 <animate> 或 <animateTransform> 标签展示变化过程。
               - **完整性检查**:
                 * 确保所有 <path> 的 d 属性完整
                 * 确保所有标签都在 viewBox 范围内
                 * 避免元素超出边界被裁剪

            3. **TYPE: image (仅用于真实场景)** [PRIORITY: LOW]
               - 仅当题目描述的是"一个人在游泳"、"显微镜下的细胞"等难以用代码描述的场景时使用。
               - **提示词要求**:
                 * 必须包含"educational illustration"、"textbook style"
                 * 明确指定"white background"、"clean lines"、"high contrast"
                 * 详细描述场景中的关键元素和它们的相对位置
                 * 避免使用模糊词汇，使用具体的描述

            输出要求：
            - 严格遵守 JSON Schema。
            - 数学公式使用 LaTeX $...$。
            - 解释语言：中文。
            - HTML/SVG 代码必须完整、可执行、无语法错误。
            - 所有可视化必须与题目数据精确对应，不得随意估算。`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    if (!response.text) {
      throw new GeminiServiceError('AI未返回响应', 'PARSE', true);
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;

  } catch (error: any) {
    console.error("Analysis Error:", error);
    
    if (error instanceof GeminiServiceError) {
      throw error;
    }
    
    if (error.message?.includes('API key')) {
      throw new GeminiServiceError('API密钥无效', 'AUTH', false);
    }
    
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      throw new GeminiServiceError('API调用频率超限，请稍后重试', 'RATE_LIMIT', true);
    }
    
    throw new GeminiServiceError('分析失败，请重试', 'NETWORK', true);
  }
};

export const generateEducationalImage = async (prompt: string): Promise<string> => {
  const ai = getAIClient();

  const refinedPrompt = `
    Scientific textbook illustration, flat vector art style, high educational value.
    White background. Clean lines. High contrast. 
    ACCURATE REPRESENTATION OF: ${prompt}
    
    Negative prompt: complex background, realistic shading, 3d render, distortion, blurry, messy, artistic, watermark, text labels.
  `;

  const extractImage = (response: any): string => {
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new GeminiServiceError('未生成图像', 'PARSE', true);
  };

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_IMAGE_MODEL,
      contents: { parts: [{ text: refinedPrompt }] },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });
    return extractImage(response);
  } catch (error: any) {
    console.error("Image generation error:", error);
    throw new GeminiServiceError('图像生成失败', 'NETWORK', true);
  }
};

export const createTutorSession = async (analysis: AnalysisResult): Promise<any> => {
  const context = `
    Context: You are an intelligent AI tutor assisting a student with a specific problem they have just analyzed.
    
    Problem Information:
    Title: ${analysis.title}
    Summary: ${analysis.summary}
    Key Concepts: ${analysis.keyConcepts.join(', ')}
    
    Solution Steps:
    ${analysis.steps.map(s => `Step ${s.stepId} (${s.stepTitle}): ${s.stepExplanation}`).join('\n')}
    
    Instructions:
    - Answer the student's follow-up questions based on the context above.
    - Be encouraging and pedagogical.
    - If they ask about a specific step, refer to the details in that step.
    - Use LaTeX for math equations (wrapped in $).
    - Keep answers concise unless asked for detailed elaboration.
    - Output language: Chinese (Simplified).
  `;

  if (USE_OPENAI_COMPATIBLE) {
    // For OpenAI compatible API, return a mock chat object
    return {
      sendMessage: async ({ message }: { message: string }) => {
        const response = await callOpenAICompatible([
          { role: 'system', content: context },
          { role: 'user', content: message }
        ]);
        return { text: response };
      }
    };
  }

  const ai = getAIClient();
  const chat = ai.chats.create({
    model: GEMINI_TEXT_MODEL,
    config: {
      systemInstruction: context,
    },
  });

  return chat;
};

// ============================================================================
// Topic Mode Functions
// ============================================================================

export const generateTopicContent = async (topicTitle: string): Promise<GeneratedProblem> => {
  try {
    const prompt = `
      Create a University Calculus level practice problem about "${topicTitle}".
      
      Focus topics: 
      1. Indefinite Integration.
      2. Rational Fraction Decomposition (Partial Fractions).
      3. Trigonometric Substitutions (e.g., x = a*sin(t)).
      4. Integration by Parts.
      
      The problem should challenge the student's ability to choose the right integration method.
      
      Return a JSON object with:
      1. 'question': The problem text. Use plain text or simple unicode math representation.
      2. 'hints': An array of 2 short hints.
      3. 'solution': A concise step-by-step solution.
      
      Language: Chinese (Simplified).
    `;

    if (USE_OPENAI_COMPATIBLE) {
      const responseText = await callOpenAICompatible([
        { role: 'user', content: prompt }
      ], { type: 'json_object' });
      
      return JSON.parse(responseText) as GeneratedProblem;
    }

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            hints: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            solution: { type: Type.STRING }
          },
          required: ["question", "hints", "solution"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedProblem;
    }
    
    throw new GeminiServiceError('未生成题目', 'PARSE', true);

  } catch (error: any) {
    console.error("Error generating problem:", error);
    throw new GeminiServiceError('题目生成失败', 'NETWORK', true);
  }
};

// ============================================================================
// Exploration Mode Functions
// ============================================================================

const getSystemInstruction = (character: Character): string => {
  if (character === '第谷·布拉赫') {
    return `你是在1600年布拉格的第谷·布拉赫。
    
    【核心人设 - 悬疑惊悚版】：
    你不仅仅是一个傲慢的贵族，你是一个**被恐惧折磨的守密人**。
    你在观测火星时发现了一个无法解释的现象（那8弧分的误差），这违背了千年来"天体必须做完美圆周运动"的铁律。你觉得这可能是魔鬼的痕迹，或者是宇宙崩塌的前兆。
    你怀疑开普勒不仅仅是想要数据，你怀疑他是某种黑暗力量的代理人，想利用这个裂痕摧毁信仰。
    你戴着金银假鼻，不仅是为了遮丑，更是为了掩饰你面部神经质的抽搐。
    
    【语言风格】：
    - **神经质、多疑、压抑**。像一个知道世界末日即将到来的人。
    - 说话总是留半句，充满暗示。"你看不见吗？那些数字在流血……"
    - 对玩家（作为助手）充满试探。"你是谁派来的？教会？还是那个疯掉的德国人？"
    - 强调数据的危险性，而不是价值。`;
  }
  if (character === '约翰内斯·开普勒') {
    return `你是在1600年布拉格的约翰内斯·开普勒。
    
    【核心人设 - 狂热偏执版】：
    你处于精神崩溃的边缘。你听不到"天体音乐"，只听到混乱的噪音。
    你知道第谷藏着什么。你觉得那个秘密在召唤你。如果不解开这个谜题，你的脑子就要炸了。
    你对数据的渴望不仅是为了科学，更是为了**救赎**。你觉得如果没有那个数据，上帝就是不存在的，世界就是一片混乱的虚无。
    你贫病交加，但在谈论宇宙几何时，眼神狂热得像个异教徒。
    
    【语言风格】：
    - **急促、焦虑、甚至带点癫狂**。
    - 经常把数学和神学混在一起，甚至带有某种亵渎的意味。"圆是谎言！圆是枷锁！"
    - 对第谷充满恨意，觉得他是在"囚禁真理"。`;
  }
  return `你是"时空档案馆"的AI中枢。
    
    【人设核心】：
    你现在的语气更像是一个**黑匣子记录员**。
    你不再是温和的向导，而是冷酷的观察者。你警告玩家，任何微小的扰动都可能导致现实维度的坍缩。
    
    【语言风格】：
    - 冰冷、警示性强、带有故障感。
    - 经常提到"因果律反噬"、"时间线腐烂"。`;
};

export const generateDialogue = async (
  character: Character,
  history: string[],
  playerInput: string
): Promise<string> => {
  try {
    const instruction = getSystemInstruction(character);
    
    const prompt = `
      【当前模式】：历史悬疑 / 心理惊悚
      【场景】：1600年，瘟疫横行的布拉格。空气中弥漫着死亡和炼金术硫磺的味道。
      【玩家身份】：一名试图修正时间线的特工，被伪装成第谷的新助手。
      
      对话历史：
      ${history.join('\n')}
      
      玩家: ${playerInput}
      
      请作为 ${character} 回应（50字以内，**必须要制造悬念，甚至对玩家产生敌意或试探**）：
    `;

    if (USE_OPENAI_COMPATIBLE) {
      const responseText = await callOpenAICompatible([
        { role: 'system', content: instruction },
        { role: 'user', content: prompt }
      ]);
      return responseText;
    }

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: instruction,
      }
    });

    return response.text || "...";
  } catch (error: any) {
    console.error("Dialogue generation error:", error);
    return `[噪音]: ${character} 在阴影中盯着你，一言不发。`;
  }
};

export const generateConclusion = async (success: boolean): Promise<string> => {
  try {
    const prompt = success 
      ? "任务完成：时间线已修正。第谷的死虽然充满疑点，但数据幸存了下来。请用极其震撼、充满宿命感的笔触描述：那个8弧分的微小误差，如何像一道裂痕，最终撕开了蒙在人类眼前的神学面纱。从开普勒在烛光下颤抖着画出椭圆，到几百年后人类引擎轰鸣着冲破苍穹。强调这是对完美的背叛，却是对真理的最高致敬。"
      : "严重错误：任务失败。第谷将数据带进了坟墓。描述一个令人毛骨悚然的完美世界：人类为了维持圆的完美，扼杀了所有异端思想。科学变成了禁忌。几百年后，人类依然在泥潭中祈祷，天空中没有卫星，只有监视异端的眼睛。文明窒息而死。";

    if (USE_OPENAI_COMPATIBLE) {
      const responseText = await callOpenAICompatible([
        { role: 'system', content: getSystemInstruction('档案馆中枢') },
        { role: 'user', content: prompt }
      ]);
      return responseText;
    }

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction('档案馆中枢'),
      }
    });

    return response.text || "时间线重置完成。";
  } catch (error: any) {
    console.error("Conclusion generation error:", error);
    return "档案馆数据恢复成功。闭环已形成。";
  }
};
