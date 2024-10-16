// components/CustomCursor.tsx

import { useEffect } from 'react';

const CustomCursor: React.FC = () => {
  useEffect(() => {
    const element = document.querySelector('body');
    if (element) { 
      const svgPath = '/images/home/logo_icon_28x28.svg'; // Adjust path if needed
      const cursorUrl = `url(${svgPath}), auto`;
      element.style.cursor = cursorUrl;
    }

    return () => {
      // Reset cursor on component unmount (optional)
      if (element) {
        element.style.cursor = 'auto';
      }
    };
  }, []);

  return null;
};

export default CustomCursor;