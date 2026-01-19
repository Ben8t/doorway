import styles from './PlanToolbar.module.css';

export default function PlanToolbar({
  activeTool,
  onToolChange,
  gridEnabled,
  onGridToggle,
  onSave,
  onExit,
  selectedElement,
  onDeleteSelected,
  zoom,
  onZoomIn,
  onZoomOut,
  onExport
}) {
  const tools = [
    { id: 'select', label: 'Sélection', icon: '↖️' },
    { id: 'wall', label: 'Mur', icon: '▬' },
    { id: 'door', label: 'Porte', icon: '🚪' },
    { id: 'doubleDoor', label: 'Porte Double', icon: '🚪🚪' },
    { id: 'window', label: 'Fenêtre', icon: '🪟' },
    { id: 'radiator', label: 'Radiateur', icon: '🔥' },
    { id: 'room', label: 'Pièce', icon: '⬜' }
  ];

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolsSection}>
        <h3 className={styles.sectionTitle}>Outils</h3>
        <div className={styles.toolButtons}>
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`${styles.toolButton} ${activeTool === tool.id ? styles.active : ''}`}
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
            >
              <span className={styles.toolIcon}>{tool.icon}</span>
              <span className={styles.toolLabel}>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.optionsSection}>
        <h3 className={styles.sectionTitle}>Options</h3>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={gridEnabled}
            onChange={(e) => onGridToggle(e.target.checked)}
          />
          <span>Afficher la grille</span>
        </label>

        <div className={styles.zoomControls}>
          <span className={styles.zoomLabel}>Zoom: {Math.round(zoom * 100)}%</span>
          <div className={styles.zoomButtons}>
            <button
              className={styles.zoomButton}
              onClick={onZoomOut}
              disabled={zoom <= 0.25}
              title="Zoom arrière"
            >
              −
            </button>
            <button
              className={styles.zoomButton}
              onClick={onZoomIn}
              disabled={zoom >= 2}
              title="Zoom avant"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {selectedElement && (
        <div className={styles.selectedSection}>
          <h3 className={styles.sectionTitle}>Élément sélectionné</h3>
          <button
            className={styles.deleteButton}
            onClick={onDeleteSelected}
          >
            Supprimer
          </button>
        </div>
      )}

      <div className={styles.actionsSection}>
        <button className={styles.saveButton} onClick={onSave}>
          Sauvegarder Plan
        </button>
        <button className={styles.exportButton} onClick={onExport}>
          Exporter Plan
        </button>
        <button className={styles.exitButton} onClick={onExit}>
          Retour aux Meubles
        </button>
      </div>
    </div>
  );
}
