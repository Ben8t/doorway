import styles from './Toolbar.module.css';

export default function Toolbar({
  appMode = 'furniture',
  onClearAll,
  hasPlacedFurniture,
  onSaveView,
  onOpenViews,
  onNewView,
  onCreatePlan,
  currentViewName,
  currentPlanName,
  viewsCount,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset
}) {
  const getModeLabel = () => {
    if (appMode === 'plan-create') return 'Création de Plan';
    if (appMode === 'plan-edit') return `Édition: ${currentPlanName || 'Plan'}`;
    return currentViewName ? `Vue: ${currentViewName}` : 'Mode Meubles';
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarContent}>
        <h1 className={styles.title}>
          Doorway
          <span className={styles.mode}>- {getModeLabel()}</span>
        </h1>
        <div className={styles.actions}>
          {appMode === 'furniture' && (
            <>
              <div className={styles.zoomControls}>
                <button
                  className={styles.zoomButton}
                  onClick={onZoomOut}
                  disabled={zoom <= 0.25}
                  title="Zoom arrière"
                >
                  −
                </button>
                <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
                <button
                  className={styles.zoomButton}
                  onClick={onZoomIn}
                  disabled={zoom >= 3}
                  title="Zoom avant"
                >
                  +
                </button>
                <button
                  className={styles.zoomResetButton}
                  onClick={onZoomReset}
                  disabled={zoom === 1}
                  title="Réinitialiser le zoom"
                >
                  ⟲
                </button>
              </div>
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
                className={styles.button}
                onClick={onCreatePlan}
                title="Créer un nouveau plan"
              >
                ✏️ Créer un Plan
              </button>
              <button
                className={styles.buttonPrimary}
                onClick={onSaveView}
                disabled={!hasPlacedFurniture}
                title="Sauvegarder la vue courante"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
                  <path d="M12 14H4C2.89543 14 2 13.1046 2 4C2 2.89543 2.89543 2 4 2H10L14 6V12C14 13.1046 13.1046 14 12 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
