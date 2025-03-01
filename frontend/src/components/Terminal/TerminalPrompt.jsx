import React from 'react';

const TerminalPrompt = ({ username = 'user' }) => {
  return <span className="terminal-prompt">{username}@termchat:~$ </span>;
};

export default TerminalPrompt;  