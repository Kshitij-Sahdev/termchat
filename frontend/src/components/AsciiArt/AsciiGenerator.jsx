import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import RainbowText from '../UI/RainbowText';

const AsciiGenerator = ({ type, text, rainbow = false }) => {
  const { theme } = useTheme();
  const isRainbow = rainbow || theme === 'theme-lolcat';
  
  const getAsciiArt = () => {
    switch (type) {
      case 'cow':
        return generateCowsay(text);
      case 'cat':
        return generateCatsay(text);
      case 'computer':
        return generateComputersay(text);
      case 'ghost':
        return generateGhostsay(text);
      default:
        return generateBoxsay(text);
    }
  };
  
  const generateBoxsay = (text) => {
    const lines = text.split('\n');
    const maxLength = Math.max(...lines.map(line => line.length));
    const top = ` ${'_'.repeat(maxLength + 2)} `;
    const bottom = ` ${'‾'.repeat(maxLength + 2)} `;
    const content = lines.map(line => `| ${line.padEnd(maxLength, ' ')} |`).join('\n');
    
    return `${top}\n${content}\n${bottom}`;
  };
  
  const generateCowsay = (text) => {
    const lines = text.split('\n');
    const maxLength = Math.max(...lines.map(line => line.length));
    const top = ` ${'_'.repeat(maxLength + 2)} `;
    const bottom = ` ${'‾'.repeat(maxLength + 2)} `;
    const content = lines.map(line => `| ${line.padEnd(maxLength, ' ')} |`).join('\n');
    
    const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
    `;
    
    return `${top}\n${content}\n${bottom}\n${cow}`;
  };
  
  const generateCatsay = (text) => {
    const lines = text.split('\n');
    const maxLength = Math.max(...lines.map(line => line.length));
    const top = ` ${'_'.repeat(maxLength + 2)} `;
    const bottom = ` ${'‾'.repeat(maxLength + 2)} `;
    const content = lines.map(line => `| ${line.padEnd(maxLength, ' ')} |`).join('\n');
    
    const cat = `
      \\
       \\
        \\
        |\\___/|
        )     (
       =\\     /=
         )===(
        /     \\
        |     |
       /       \\
       \\       /
_/\\_/\\_/\\__  _/_/\\_/\\_/\\_/\\_/\\_/\\_
|  |  |  |( (  |  |  |  |  |  |  |
|  |  |  | ) ) |  |  |  |  |  |  |
|  |  |  |(_(  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |
    `;
    
    return `${top}\n${content}\n${bottom}\n${cat}`;
  };
  
  const generateComputersay = (text) => {
    const lines = text.split('\n');
    const maxLength = Math.max(...lines.map(line => line.length));
    const top = ` ${'_'.repeat(maxLength + 2)} `;
    const bottom = ` ${'‾'.repeat(maxLength + 2)} `;
    const content = lines.map(line => `| ${line.padEnd(maxLength, ' ')} |`).join('\n');
    
    const computer = `
       \\
        \\
         \\
          _____________________________
         |  _________________________  |
         | |                         | |
         | |                         | |
         | |                         | |
         | |_________________________| |
         |_____________________________|
         
    `;
    
    return `${top}\n${content}\n${bottom}\n${computer}`;
  };
  
  const generateGhostsay = (text) => {
    const lines = text.split('\n');
    const maxLength = Math.max(...lines.map(line => line.length));
    const top = ` ${'_'.repeat(maxLength + 2)} `;
    const bottom = ` ${'‾'.repeat(maxLength + 2)} `;
    const content = lines.map(line => `| ${line.padEnd(maxLength, ' ')} |`).join('\n');
    
    const ghost = `
        \\
         \\
          \\
           .-.
          (o o)
          | O |
          |   |
          '~~~'
    `;
    
    return `${top}\n${content}\n${bottom}\n${ghost}`;
  };
  
  const asciiArt = getAsciiArt();
  
  return (
    <div className="ascii-generator">
      {isRainbow ? (
        <RainbowText text={asciiArt} speed={0.2} />
      ) : (
        <pre className="ascii-art">{asciiArt}</pre>
      )}
    </div>
  );
};

export default AsciiGenerator;