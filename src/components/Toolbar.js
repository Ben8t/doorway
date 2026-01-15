import styles from './Toolbar.module.css';

export default function Toolbar({
  onClearAll,
  hasPlacedFurniture,
  onSaveView,
  onOpenViews,
  onNewView,
  currentViewName,
  viewsCount
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarContent}>
        <h1 className={styles.title}>
          Doorway
          {currentViewName && (
            <span className={styles.viewName}>- {currentViewName}</span>
          )}
        </h1>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={onNewView}
            title="Nouvelle vue"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
              <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Nouveau
          </button>
          <button
            className={styles.buttonPrimary}
            onClick={onSaveView}
            disabled={!hasPlacedFurniture}
            title="Sauvegarder la vue courante"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
              <path d="M12 14H4C2.89543 14 2 13.1046 2 12V4C2 2.89543 2.89543 2 4 2H10L14 6V12C14 13.1046 13.1046 14 12 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M5 2V6H10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            Sauvegarder
          </button>
          <button
            className={styles.button}
            onClick={onOpenViews}
            title={`Voir les ${viewsCount} vue(s) sauvegardée(s)`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
              <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Mes Vues ({viewsCount})
          </button>
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
