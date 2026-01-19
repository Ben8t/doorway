import { useState } from 'react';
import PlanRenderer from './PlanRenderer';
import styles from './PlanSelector.module.css';

export default function PlanSelector({
  plans,
  onUsePlan,
  onEditPlan,
  onDeletePlan,
  onClose,
  onImport,
  onExportPlan
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2>Plans Sauvegardés</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.search}>
          <input
            type="text"
            placeholder="Rechercher un plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <label className={styles.importButton}>
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              style={{ display: 'none' }}
            />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
              <path d="M8 12V4M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Importer
          </label>
        </div>

        <div className={styles.plansList}>
          {filteredPlans.length === 0 ? (
            <div className={styles.empty}>
              {searchTerm ? 'Aucun plan trouvé' : 'Aucun plan sauvegardé'}
            </div>
          ) : (
            filteredPlans.map((plan) => (
              <div key={plan.id} className={styles.planItem}>
                <div className={styles.planPreview}>
                  <PlanRenderer
                    elements={plan.elements}
                    canvasSize={plan.canvasSize}
                    interactive={false}
                  />
                </div>
                <div className={styles.planInfo}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <p className={styles.planMeta}>
                    {plan.elements?.length || 0} élément(s)
                  </p>
                  <p className={styles.planDate}>
                    Modifié le {formatDate(plan.updatedAt)}
                  </p>
                </div>
                <div className={styles.planActions}>
                  <button
                    className={styles.useButton}
                    onClick={() => onUsePlan(plan.id)}
                    title="Utiliser comme fond"
                  >
                    Utiliser
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => onEditPlan(plan.id)}
                    title="Éditer ce plan"
                  >
                    Éditer
                  </button>
                  <button
                    className={styles.exportPlanButton}
                    onClick={() => onExportPlan(plan.id)}
                    title="Exporter ce plan"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 4V12M8 12L5 9M8 12L11 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 2H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      if (window.confirm(`Supprimer le plan "${plan.name}" ?`)) {
                        onDeletePlan(plan.id);
                      }
                    }}
                    title="Supprimer ce plan"
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
