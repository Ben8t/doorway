import React from 'react';
import styles from './PlanElements.module.css';

const DoubleDoorElement = React.memo(function DoubleDoorElement({
  id,
  position,
  width = 120,
  rotation = 0,
  openingDirection = 'outward', // 'outward' | 'inward'
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

  const halfWidth = width / 2;
  const radius = halfWidth;

  // Arc paths depend on opening direction
  let leftArcPath, rightArcPath, leftPanelX, leftPanelY, rightPanelX, rightPanelY;

  if (openingDirection === 'outward') {
    // Left door opens left (outward), right door opens right (outward)
    leftArcPath = `M 0 0 A ${radius} ${radius} 0 0 0 ${halfWidth} 0`;
    rightArcPath = `M ${width} 0 A ${radius} ${radius} 0 0 1 ${halfWidth} 0`;
    leftPanelX = halfWidth * 0.7;
    leftPanelY = -halfWidth * 0.7;
    rightPanelX = width - halfWidth * 0.7;
    rightPanelY = -halfWidth * 0.7;
  } else {
    // Both doors open inward (toward each other)
    leftArcPath = `M 0 0 A ${radius} ${radius} 0 0 1 ${halfWidth} 0`;
    rightArcPath = `M ${width} 0 A ${radius} ${radius} 0 0 0 ${halfWidth} 0`;
    leftPanelX = halfWidth * 0.7;
    leftPanelY = halfWidth * 0.7;
    rightPanelX = width - halfWidth * 0.7;
    rightPanelY = halfWidth * 0.7;
  }

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

      {/* Left door swing arc */}
      <path
        d={leftArcPath}
        stroke={isSelected ? '#4A90E2' : '#654321'}
        strokeWidth={isSelected ? 2 : 1}
        fill="none"
        opacity={0.5}
      />

      {/* Right door swing arc */}
      <path
        d={rightArcPath}
        stroke={isSelected ? '#4A90E2' : '#654321'}
        strokeWidth={isSelected ? 2 : 1}
        fill="none"
        opacity={0.5}
      />

      {/* Left door panel */}
      <line
        x1={0}
        y1={0}
        x2={leftPanelX}
        y2={leftPanelY}
        stroke={isSelected ? '#4A90E2' : '#654321'}
        strokeWidth={isSelected ? 3 : 2}
      />

      {/* Right door panel */}
      <line
        x1={width}
        y1={0}
        x2={rightPanelX}
        y2={rightPanelY}
        stroke={isSelected ? '#4A90E2' : '#654321'}
        strokeWidth={isSelected ? 3 : 2}
      />
    </g>
  );
});

export default DoubleDoorElement;
