import React from 'react';
import styles from './PlanElements.module.css';

const WallElement = React.memo(function WallElement({
  id,
  points,
  thickness = 10,
  color = '#000000',
  interactive = false,
  isSelected = false,
  onClick,
  onMouseDown
}) {
  const [start, end] = points;

  const handleClick = (e) => {
    if (interactive && onClick) {
      e.stopPropagation();
      onClick(id);
    }
  };

  const handleMouseDown = (e) => {
    if (interactive && onMouseDown) {
      onMouseDown(e);
    }
  };

  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke={isSelected ? '#4A90E2' : color}
      strokeWidth={isSelected ? thickness + 2 : thickness}
      strokeLinecap="square"
      className={interactive ? styles.interactiveWall : ''}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{ cursor: interactive ? (isSelected ? 'move' : 'pointer') : 'default' }}
    />
  );
});

export default WallElement;
