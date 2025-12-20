/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 备考模式主题色
        'exam-primary': '#4F46E5', // indigo-600
        'exam-secondary': '#818CF8', // indigo-400
        
        // 专题模式主题色
        'topic-primary': '#0F172A', // slate-900
        'topic-secondary': '#64748B', // slate-500
        
        // 探索模式主题色
        'exploration-primary': '#DC2626', // red-600
        'exploration-secondary': '#F59E0B', // amber-500
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif-header': ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
