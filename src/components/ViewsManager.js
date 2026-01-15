import { useState } from 'react';
import styles from './ViewsManager.module.css';

export default function ViewsManager({
  views,
  currentViewId,
  onLoadView,
  onDeleteView,
  onClose
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredViews = views.filter(view =>
    view.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Mes Vues Sauvegardées</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.search}>
          <input
            type="text"
            placeholder="Rechercher une vue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.viewsList}>
          {filteredViews.length === 0 ? (
            <div className={styles.empty}>
              {searchTerm ? 'Aucune vue trouvée' : 'Aucune vue sauvegardée'}
            </div>
          ) : (
            filteredViews.map((view) => (
              <div
                key={view.id}
                className={`${styles.viewItem} ${currentViewId === view.id ? styles.current : ''}`}
              >
                <div className={styles.viewPreview}>
                  {view.floorPlanImage ? (
                    <img src={view.floorPlanImage} alt={view.name} />
                  ) : (
                    <div className={styles.noPreview}>Aucun plan</div>
                  )}
                </div>
                <div className={styles.viewInfo}>
                  <h3 className={styles.viewName}>{view.name}</h3>
                  <p className={styles.viewMeta}>
                    {view.placedFurniture?.length || 0} meuble(s)
                  </p>
                  <p className={styles.viewDate}>
                    Modifié le {formatDate(view.updatedAt)}
                  </p>
                </div>
                <div className={styles.viewActions}>
                  <button
                    className={styles.loadButton}
                    onClick={() => {
                      onLoadView(view.id);
                      onClose();
                    }}
                    title="Charger cette vue"
                  >
                    Charger
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      if (window.confirm(`Supprimer la vue "${view.name}" ?`)) {
                        onDeleteView(view.id);
                      }
                    }}
                    title="Supprimer cette vue"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
