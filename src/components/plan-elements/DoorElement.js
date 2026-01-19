import React from 'react';
import styles from './PlanElements.module.css';

const DoorElement = React.memo(function DoorElement({
  id,
  position,
  width = 80,
  openingSide = 'left',
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

  // Calculate arc path for door swing
  const radius = width;
  const sweep = openingSide === 'left' ? 0 : 1;
  const arcPath = `M 0 0 A ${radius} ${radius} 0 0 ${sweep} ${width} 0`;

  return (
    <g
      transform={`translate(${position.x}, ${position.y}) rotate(${rotation})`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className={interactive ? styles.interactive : ''}
      style={{ cursor: interactive ? (isSelected ? 'move' : 'pointer') : 'default' }}
    >
      {/* Door frame line */}
      <line
        x1={0}
        y1={0}
        x2={width}
        y2={0}
        stroke={isSelected ? '#4A90E2' : '#654321'}
        strokeWidth={isSelected ? 4 : 3}
      />
      {/* Door swing arc */}
      <path
        d={arcPath}
        stroke={isSelected ? '#4A90E2' : '#654321'}
        strokeWidth={isSelected ? 2 : 1}
        fill="none"
        opacity={0.5}
      />
      {/* Door panel */}
      <line
        x1={0}
        y1={0}
        x2={openingSide === 'left' ? width * 0.7 : -width * 0.7}
        y2={openingSide === 'left' ? -width * 0.7 : -width * 0.7}
        stroke={isSelected ? '#4A90E2' : '#654321'}
        strokeWidth={isSelected ? 3 : 2}
      />
    </g>
  );
});

export default DoorElement;
