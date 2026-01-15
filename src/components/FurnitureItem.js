import styles from './FurnitureItem.module.css';

export default function FurnitureItem({ furniture, onDragStart }) {
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'copy';

    // All furniture uses real dimensions and dynamic components if available
    const furnitureData = {
      ...furniture,
      defaultWidth: furniture.realWidth || furniture.defaultWidth,
      defaultHeight: furniture.realHeight || furniture.defaultHeight,
      customDimensions: true // Always enable custom dimensions
    };

    onDragStart(furnitureData);
  };

  return (
    <div className={styles.item}>
      <div
        className={styles.dragArea}
        draggable="true"
        onDragStart={handleDragStart}
        title={furniture.name}
      >
        <div className={styles.imageContainer}>
          <img
            src={furniture.imagePath}
            alt={furniture.name}
            className={styles.image}
            draggable="false"
          />
        </div>
        <div className={styles.name}>{furniture.name}</div>
        {furniture.realWidth && (
          <div className={styles.dimensions}>
            {furniture.realWidth}×{furniture.realHeight} cm
          </div>
        )}
      </div>
    </div>
  );
}
