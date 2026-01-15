import { useRef, useState } from 'react';
import styles from './PlacedFurniture.module.css';

export default function PlacedFurniture({
  item,
  onMove,
  onRotate,
  onDelete,
  onResize,
  isSelected,
  onSelect
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest(`.${styles.deleteButton}`) ||
        e.target.closest(`.${styles.rotateButton}`) ||
        e.target.closest(`.${styles.resizeHandle}`)) {
      return;
    }

    e.stopPropagation();
    setIsDragging(true);
    onSelect(item.instanceId);

    dragStartPos.current = {
      x: e.clientX - item.x,
      y: e.clientY - item.y
    };

    const handleMouseMove = (moveEvent) => {
      const newX = moveEvent.clientX - dragStartPos.current.x;
      const newY = moveEvent.clientY - dragStartPos.current.y;
      onMove(item.instanceId, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (e, corner) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = item.width;
    const startHeight = item.height;
    const startPosX = item.x;
    const startPosY = item.y;

    const handleResizeMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPosX;
      let newY = startPosY;

      switch (corner) {
        case 'se': // Southeast (bottom-right)
          newWidth = Math.max(30, startWidth + deltaX);
          newHeight = Math.max(30, startHeight + deltaY);
          break;
        case 'sw': // Southwest (bottom-left)
          newWidth = Math.max(30, startWidth - deltaX);
          newHeight = Math.max(30, startHeight + deltaY);
          newX = startPosX + (startWidth - newWidth);
          break;
        case 'ne': // Northeast (top-right)
          newWidth = Math.max(30, startWidth + deltaX);
          newHeight = Math.max(30, startHeight - deltaY);
          newY = startPosY + (startHeight - newHeight);
          break;
        case 'nw': // Northwest (top-left)
          newWidth = Math.max(30, startWidth - deltaX);
          newHeight = Math.max(30, startHeight - deltaY);
          newX = startPosX + (startWidth - newWidth);
          newY = startPosY + (startHeight - newHeight);
          break;
      }

      onResize(item.instanceId, newWidth, newHeight, newX, newY);
    };

    const handleResizeEnd = () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const furnitureStyle = {
    left: `${item.x}px`,
    top: `${item.y}px`,
    width: `${item.width}px`,
    height: `${item.height}px`,
    transform: `rotate(${item.rotation}deg)`,
    zIndex: item.zIndex,
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div
      className={`${styles.furniture} ${isSelected ? styles.selected : ''}`}
      style={furnitureStyle}
      onMouseDown={handleMouseDown}
      title={item.name}
    >
      <img
        src={item.imagePath}
        alt={item.name}
        className={styles.image}
        draggable="false"
      />
      {isSelected && (
        <>
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.instanceId);
            }}
            title="Supprimer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            className={styles.rotateButton}
            onClick={(e) => {
              e.stopPropagation();
              onRotate(item.instanceId);
            }}
            title="Rotation 90°"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 8C13.5 10.76 11.26 13 8.5 13C5.74 13 3.5 10.76 3.5 8C3.5 5.24 5.74 3 8.5 3H12.5M12.5 3L10 0.5M12.5 3L10 5.5"
                    stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* Resize handles */}
          <div
            className={`${styles.resizeHandle} ${styles.nw}`}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            title="Redimensionner"
          />
          <div
            className={`${styles.resizeHandle} ${styles.ne}`}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            title="Redimensionner"
          />
          <div
            className={`${styles.resizeHandle} ${styles.sw}`}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            title="Redimensionner"
          />
          <div
            className={`${styles.resizeHandle} ${styles.se}`}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            title="Redimensionner"
          />
        </>
      )}
    </div>
  );
}
