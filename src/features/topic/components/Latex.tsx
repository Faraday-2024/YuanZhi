import React from 'react';

interface LatexProps {
  children: string;
}

const Latex: React.FC<LatexProps> = ({ children }) => {
  // Simple LaTeX rendering - just display the text
  // In production, you would use a library like KaTeX or MathJax
  return <span className="font-serif">{children}</span>;
};

export default Latex;
