import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import RainbowText from '../UI/RainbowText';

const AsciiHeader = () => {
  const { theme } = useTheme();
  
  const ascii = `
  ████████╗███████╗██████╗ ███╗   ███╗ ██████╗██╗  ██╗ █████╗ ████████╗
  ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██╔════╝██║  ██║██╔══██╗╚══██╔══╝
     ██║   █████╗  ██████╔╝██╔████╔██║██║     ███████║███████║   ██║   
     ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║     ██╔══██║██╔══██║   ██║   
     ██║   ███████╗██║  ██║██║ ╚═╝ ██║╚██████╗██║  ██║██║  ██║   ██║   
     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
  `;
  
  return (
    <div className="ascii-header">
      {theme === 'theme-lolcat' ? (
        <RainbowText text={ascii} speed={0.3} />
      ) : (
        <pre className="ascii-art">{ascii}</pre>
      )}
    </div>
  );
};

export default AsciiHeader;