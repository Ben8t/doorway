import { furnitureLibrary } from '@/config/furniture';
import FurnitureItem from './FurnitureItem';
import styles from './FurniturePanel.module.css';

export default function FurniturePanel({ onDragStart }) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Bibliothèque de Meubles</h2>
      </div>
      <div className={styles.content}>
        {furnitureLibrary.categories.map((category) => (
          <div key={category.id} className={styles.category}>
            <h3 className={styles.categoryName}>{category.name}</h3>
            <div className={styles.grid}>
              {category.items.map((item) => (
                <FurnitureItem
                  key={item.id}
                  furniture={item}
                  onDragStart={onDragStart}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
