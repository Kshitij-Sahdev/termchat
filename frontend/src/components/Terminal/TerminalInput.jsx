import React, { forwardRef } from 'react';

const TerminalInput = forwardRef(({ value, onChange, onKeyDown }, ref) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className="terminal-input"
      autoComplete="off"
      spellCheck="false"
      ref={ref}
    />
  );
});

export default TerminalInput;