import React, { useMemo } from 'react';

const RainbowText = ({ text, speed = 1, vertical = false }) => {
  const generateRainbowColors = (textLength, speed, vertical) => {
    const colors = [];
    for (let i = 0; i < textLength; i++) {
      if (text[i] === '\n' || text[i] === ' ') {
        colors.push('inherit');
        continue;
      }
      
      let hue;
      if (vertical) {
        const lineIndex = text.substring(0, i).split('\n').length - 1;
        hue = (lineIndex * 15 * speed) % 360;
      } else {
        hue = (i * 5 * speed) % 360;
      }
      
      colors.push(`hsl(${hue}, 100%, 60%)`);
    }
    return colors;
  };
  
  const rainbowColors = useMemo(() => 
    generateRainbowColors(text.length, speed, vertical), 
    [text, speed, vertical]
  );
  
  return (
    <pre className="rainbow-text">
      {text.split('').map((char, index) => (
        <span key={index} style={{ color: rainbowColors[index] }}>
          {char}
        </span>
      ))}
    </pre>
  );
};

export default RainbowText;