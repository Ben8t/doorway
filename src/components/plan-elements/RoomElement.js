import React from 'react';
import styles from './PlanElements.module.css';

const RoomElement = React.memo(function RoomElement({
  id,
  points,
  label = '',
  dimensions,
  fill = '#f5f5f5',
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

  // Create SVG path from points
  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;

  // Calculate center for label
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  return (
    <g
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className={interactive ? styles.interactive : ''}
      style={{ cursor: interactive ? (isSelected ? 'move' : 'pointer') : 'default' }}
    >
      {/* Room fill */}
      <path
        d={pathData}
        fill={fill}
        fillOpacity={0.1}
        stroke={isSelected ? '#4A90E2' : '#cccccc'}
        strokeWidth={isSelected ? 2 : 1}
        strokeDasharray="5,5"
      />
      {/* Label */}
      {label && (
        <text
          x={centerX}
          y={centerY - 10}
          fontSize="14"
          fill={isSelected ? '#4A90E2' : '#666666'}
          fontWeight={isSelected ? 'bold' : 'normal'}
          textAnchor="middle"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {label}
        </text>
      )}
      {/* Dimensions */}
      {dimensions && (
        <text
          x={centerX}
          y={centerY + 10}
          fontSize="12"
          fill={isSelected ? '#4A90E2' : '#999999'}
          textAnchor="middle"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {`${(dimensions.width / 10).toFixed(1)}m × ${(dimensions.height / 10).toFixed(1)}m`}
        </text>
      )}
    </g>
  );
});

export default RoomElement;
