import React from 'react';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="loader">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="loader-dot"></div>
        ))}
      </div>
      <div className="loader-text">{text}</div>
    </div>
  );
};

export default Loader;