// Generate a random terminal ID
export const generateTerminalId = () => {
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TERM-${randomChars}`;
  };
  
  // Create typewriter effect for text
  export const typeText = (text, element, speed = 50) => {
    return new Promise((resolve) => {
      let i = 0;
      element.textContent = '';
      
      const timer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  };
  
  // Create a matrix-like effect
  export const createMatrixEffect = (container, duration = 10000) => {
    // Set up the canvas
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '1000';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Matrix characters
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
    // Create drops
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
    
    // Timer to stop the animation
    const stopTimeout = setTimeout(() => {
      clearInterval(drawInterval);
      container.removeChild(canvas);
    }, duration);
    
    // Draw the characters
    const drawInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    }, 33);
    
    return stopTimeout;
  };
  
  // Generate rainbow colors for lolcat effect
  export const rainbowColor = (i, frequency = 0.3) => {
    const r = Math.sin(frequency * i + 0) * 127 + 128;
    const g = Math.sin(frequency * i + 2) * 127 + 128;
    const b = Math.sin(frequency * i + 4) * 127 + 128;
    
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  };
  
  // Apply lolcat effect to string
  export const lolcatify = (text) => {
    return text.split('').map((char, i) => {
      if (char === '\n' || char === ' ') {
        return char;
      }
      return `<span style="color: ${rainbowColor(i)}">${char}</span>`;
    }).join('');
  };