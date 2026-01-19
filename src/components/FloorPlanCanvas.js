import { forwardRef } from 'react';
import ImageUploader from './ImageUploader';
import PlacedFurniture from './PlacedFurniture';
import PlanRenderer from './PlanRenderer';
import styles from './FloorPlanCanvas.module.css';

const FloorPlanCanvas = forwardRef(function FloorPlanCanvas(
  {
    floorPlanImage,
    onImageUpload,
    onCreatePlan,
    onSelectPlan,
    placedFurniture,
    onDrop,
    onDragOver,
    onMoveFurniture,
    onRotateFurniture,
    onDeleteFurniture,
    onResizeFurniture,
    selectedFurniture,
    onSelectFurniture,
    plans,
    zoom = 1
  },
  ref
) {
  const handleCanvasClick = (e) => {
    // Deselect furniture if clicking on empty canvas
    if (e.target === e.currentTarget || e.target.tagName === 'IMG' || e.target.tagName === 'svg') {
      onSelectFurniture(null);
    }
  };

  // Determine how to render the background
  const renderBackground = () => {
    // If floorPlanImage is an object with type 'plan', render the plan
    if (floorPlanImage?.type === 'plan') {
      const plan = plans?.find(p => p.id === floorPlanImage.planId);
      if (plan) {
        return (
          <div className={styles.planBackground}>
            <PlanRenderer
              elements={plan.elements}
              canvasSize={plan.canvasSize}
              interactive={false}
            />
          </div>
        );
      }
    }

    // If floorPlanImage is a string, render as uploaded image
    if (typeof floorPlanImage === 'string') {
      return (
        <img
          src={floorPlanImage}
          alt="Plan d'appartement"
          className={styles.floorPlan}
          draggable="false"
        />
      );
    }

    return null;
  };

  return (
    <div className={styles.container}>
      {!floorPlanImage ? (
        <ImageUploader
          onImageUpload={onImageUpload}
          onCreatePlan={onCreatePlan}
          onSelectPlan={onSelectPlan}
        />
      ) : (
        <div className={styles.canvasContainer}>
          <div
            ref={ref}
            className={styles.canvas}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={handleCanvasClick}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
              transition: 'transform 0.2s ease-out'
            }}
          >
            {renderBackground()}
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
        </div>
      )}
    </div>
  );
});

export default FloorPlanCanvas;
