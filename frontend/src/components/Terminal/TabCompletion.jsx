import React from 'react';

const TabCompletion = ({ options, selectedIndex, onSelect }) => {
  return (
    <div className="tab-completion">
      {options.map((option, index) => (
        <div 
          key={index} 
          className={`tab-option ${index === selectedIndex ? 'selected' : ''}`}
          onClick={() => onSelect(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default TabCompletion;