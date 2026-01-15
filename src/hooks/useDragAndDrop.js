import { useState } from 'react';

export function useDragAndDrop() {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (furnitureData) => {
    setDraggedItem(furnitureData);
  };

  const handleDrop = (e, canvasRef) => {
    e.preventDefault();
    if (!draggedItem || !canvasRef.current) return null;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Center the furniture on the drop position
    const newItem = {
      instanceId: crypto.randomUUID(),
      furnitureId: draggedItem.id,
      name: draggedItem.name,
      imagePath: draggedItem.imagePath,
      x: x - (draggedItem.defaultWidth / 2),
      y: y - (draggedItem.defaultHeight / 2),
      width: draggedItem.defaultWidth,
      height: draggedItem.defaultHeight,
      rotation: 0,
      zIndex: Date.now(),
      // Keep dynamic component info and custom dimensions
      component: draggedItem.component,
      dynamic: draggedItem.dynamic,
      customDimensions: draggedItem.customDimensions
    };

    setDraggedItem(null);
    return newItem;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return {
    draggedItem,
    handleDragStart,
    handleDrop,
    handleDragOver
  };
}
