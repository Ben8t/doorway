import { forwardRef } from 'react';
import ImageUploader from './ImageUploader';
import PlacedFurniture from './PlacedFurniture';
import styles from './FloorPlanCanvas.module.css';

const FloorPlanCanvas = forwardRef(function FloorPlanCanvas(
  {
    floorPlanImage,
    onImageUpload,
    placedFurniture,
    onDrop,
    onDragOver,
    onMoveFurniture,
    onRotateFurniture,
    onDeleteFurniture,
    onResizeFurniture,
    selectedFurniture,
    onSelectFurniture
  },
  ref
) {
  const handleCanvasClick = (e) => {
    // Deselect furniture if clicking on empty canvas
    if (e.target === e.currentTarget || e.target.tagName === 'IMG') {
      onSelectFurniture(null);
    }
  };

  return (
    <div className={styles.container}>
      {!floorPlanImage ? (
        <ImageUploader onImageUpload={onImageUpload} />
      ) : (
        <div
          ref={ref}
          className={styles.canvas}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={handleCanvasClick}
        >
          <img
            src={floorPlanImage}
            alt="Plan d'appartement"
            className={styles.floorPlan}
            draggable="false"
          />
          {placedFurniture.map((item) => (
            <PlacedFurniture
              key={item.instanceId}
              item={item}
              onMove={onMoveFurniture}
              onRotate={onRotateFurniture}
              onDelete={onDeleteFurniture}
              onResize={onResizeFurniture}
              isSelected={selectedFurniture === item.instanceId}
              onSelect={onSelectFurniture}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default FloorPlanCanvas;
