import { useContext } from 'react';
import { TerminalContext } from '../context/TerminalContext';

export const useTerminal = () => {
  return useContext(TerminalContext);
};