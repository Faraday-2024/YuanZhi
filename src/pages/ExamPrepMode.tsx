import React, { useState } from 'react';
import { AppState, AnalysisResult, AnalysisStep } from '@features/exam-prep/types';
import UploadZone from '@features/exam-prep/components/UploadZone';
import ResultView from '@features/exam-prep/components/ResultView';
import { analyzeProblemImage, generateEducationalImage } from '@shared/services/geminiService';
import { readFileAsBase64, extractBase64Data } from '@shared/utils/fileHelpers';
import ErrorMessage from '@shared/components/ErrorMessage';

/**
 * Exam Prep Mode Page
 * Image upload and AI-powered problem analysis
 */
const ExamPrepMode: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setAppState(AppState.ANALYZING);
      setErrorMsg(null);
      setAnalysisResult(null);
      
      const base64 = await readFileAsBase64(file);
      setSelectedImage(base64);

      const base64Data = extractBase64Data(base64);
      const mimeType = file.type;

      // 1. Analyze with Gemini
      const analysis = await analyzeProblemImage(base64Data, mimeType);
      
      // Debug: Log the analysis result
      console.log('=== AI Analysis Result ===');
      console.log('Title:', analysis.title);
      console.log('Summary:', analysis.summary);
      console.log('Steps count:', analysis.steps?.length);
      console.log('Full analysis:', JSON.stringify(analysis, null, 2));
      
      // 2. Generate images for steps that need them
      setAppState(AppState.GENERATING_VISUAL);
      
      const updatedSteps = await Promise.all(analysis.steps.map(async (step: AnalysisStep) => {
        if (step.visualType === 'image' && step.imagePrompt) {
          try {
             const url = await generateEducationalImage(step.imagePrompt);
             return { ...step, generatedImageUrl: url };
          } catch (e) {
             console.error(`Failed to generate image for step ${step.stepId}`, e);
             return step;
          }
        }
        return step;
      }));

      setAnalysisResult({ ...analysis, steps: updatedSteps });
      setAppState(AppState.COMPLETE);

    } catch (error: any) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMsg(error.message || "分析失败，请重试");
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setSelectedImage(null);
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="relative">
      {appState === AppState.IDLE && (
        <UploadZone onFileSelect={handleFileSelect} />
      )}

      {(appState === AppState.ANALYZING || 
        appState === AppState.GENERATING_VISUAL || 
        appState === AppState.COMPLETE) && selectedImage && (
        <ResultView 
          originalImage={selectedImage}
          analysis={analysisResult}
          state={appState}
          onReset={handleReset}
        />
      )}

      {appState === AppState.ERROR && (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <ErrorMessage 
              message={errorMsg || "分析失败，请检查网络设置"}
              type="error"
              onRetry={handleReset}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPrepMode;
