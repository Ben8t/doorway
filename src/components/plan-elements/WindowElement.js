import React from 'react';
import styles from './PlanElements.module.css';

const WindowElement = React.memo(function WindowElement({
  id,
  position,
  width = 120,
  rotation = 0,
  interactive = false,
  isSelected = false,
  onClick,
  onMouseDown
}) {
  const handleClick = (e) => {
    if (interactive && onClick) {
      e.stopPropagation();
      onClick(id);
    }
  };

  const handleMouseDown = (e) => {
    if (interactive && onMouseDown) {
      e.stopPropagation();
      onMouseDown(e);
    }
  };

  const height = 6;

  return (
    <g
      transform={`translate(${position.x}, ${position.y}) rotate(${rotation})`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className={interactive ? styles.interactive : ''}
      style={{ cursor: interactive ? (isSelected ? 'move' : 'pointer') : 'default' }}
    >
      {/* Window frame */}
      <rect
        x={0}
        y={-height / 2}
        width={width}
        height={height}
        fill={isSelected ? '#4A90E2' : '#87CEEB'}
        stroke={isSelected ? '#4A90E2' : '#4682B4'}
        strokeWidth={isSelected ? 2 : 1}
      />
      {/* Window center divider */}
      <line
        x1={width / 2}
        y1={-height / 2}
        x2={width / 2}
        y2={height / 2}
        stroke={isSelected ? '#4A90E2' : '#4682B4'}
        strokeWidth={isSelected ? 2 : 1}
      />
      {/* Window panes (multiple vertical lines) */}
      {[0.25, 0.75].map((factor, idx) => (
        <line
          key={idx}
          x1={width * factor}
          y1={-height / 2}
          x2={width * factor}
          y2={height / 2}
          stroke={isSelected ? '#4A90E2' : '#4682B4'}
          strokeWidth={1}
          opacity={0.5}
        />
      ))}
    </g>
  );
});

export default WindowElement;
