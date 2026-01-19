import React from 'react';
import styles from './PlanElements.module.css';

const RadiatorElement = React.memo(function RadiatorElement({
  id,
  position,
  width = 80,
  height = 15,
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

  const sections = 8; // Number of radiator sections
  const sectionWidth = width / sections;

  return (
    <g
      transform={`translate(${position.x}, ${position.y}) rotate(${rotation})`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className={interactive ? styles.interactive : ''}
      style={{ cursor: interactive ? (isSelected ? 'move' : 'pointer') : 'default' }}
    >
      {/* Radiator outline */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={isSelected ? '#4A90E2' : '#B0B0B0'}
        fillOpacity={0.3}
        stroke={isSelected ? '#4A90E2' : '#808080'}
        strokeWidth={isSelected ? 2 : 1.5}
      />

      {/* Radiator sections (vertical lines) */}
      {Array.from({ length: sections - 1 }).map((_, i) => (
        <line
          key={i}
          x1={(i + 1) * sectionWidth}
          y1={0}
          x2={(i + 1) * sectionWidth}
          y2={height}
          stroke={isSelected ? '#4A90E2' : '#808080'}
          strokeWidth={isSelected ? 1.5 : 1}
          opacity={0.6}
        />
      ))}

      {/* Top pipe */}
      <line
        x1={0}
        y1={height * 0.2}
        x2={width}
        y2={height * 0.2}
        stroke={isSelected ? '#4A90E2' : '#606060'}
        strokeWidth={isSelected ? 2 : 1.5}
      />

      {/* Bottom pipe */}
      <line
        x1={0}
        y1={height * 0.8}
        x2={width}
        y2={height * 0.8}
        stroke={isSelected ? '#4A90E2' : '#606060'}
        strokeWidth={isSelected ? 2 : 1.5}
      />
    </g>
  );
});

export default RadiatorElement;
