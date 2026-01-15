import styles from './Toolbar.module.css';

export default function Toolbar({ onClearAll, hasPlacedFurniture }) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarContent}>
        <h1 className={styles.title}>Doorway</h1>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={onClearAll}
            disabled={!hasPlacedFurniture}
            title="Effacer tous les meubles"
          >
            Tout Effacer
          </button>
        </div>
      </div>
    </div>
  );
}
