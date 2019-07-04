import React, { useState, useEffect } from 'react';
import handleViewport from 'react-in-viewport';

import './index.css';

const Terminal = (props) => {
  const { inViewport, innerRef } = props;

  const [i, setI] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      if (props.children.length === i) {
        return clearInterval(interval);
      }
      if (inViewport) {
        setI(i+1)
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    }
  })

  const lines = props.children.map((line, key) => {
    if(line.type === 'kbd') {
        return (
        <div key={key} className="terminal-line" style={{ visibility: key > i ? 'hidden': 'visible'}}>
              <span  className="prompt">&gt; </span>
          <kbd>{line.props.children}</kbd>
        </div>
      );
    }
    else if (line.type === 'pre') {
      return (
        <div key={key} className="terminal-line" style={{ visibility: key > i ? 'hidden': 'visible'}}>
          <pre>{line.props.children}</pre>
        </div>
      );
    }
  });

  return (
    <div className="terminal" ref={innerRef}>
          <header>
            <div className="terminal-button button-close"></div>
            <div className="terminal-button button-minimize"></div>
            <div className="terminal-button button-zoom"></div>
          </header>
  
          <div className="terminal-output">
            {lines}
          </div>
        </div>
      );
  };

export default handleViewport(Terminal);
