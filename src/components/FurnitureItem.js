import styles from './FurnitureItem.module.css';

export default function FurnitureItem({ furniture, onDragStart }) {
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(furniture);
  };

  return (
    <div
      className={styles.item}
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
    </div>
  );
}
