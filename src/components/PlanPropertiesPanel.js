import { useState, useEffect } from 'react';
import styles from './PlanPropertiesPanel.module.css';

export default function PlanPropertiesPanel({
  selectedElement,
  elements,
  onUpdateElement,
  onDeleteElement
}) {
  const element = elements.find(el => el.id === selectedElement);
  const [localProps, setLocalProps] = useState({});

  useEffect(() => {
    if (element) {
      setLocalProps(element);
    }
  }, [element]);

  if (!element) {
    return (
      <div className={styles.panel}>
        <div className={styles.emptyState}>
          Sélectionnez un élément pour voir ses propriétés
        </div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setLocalProps(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onUpdateElement(selectedElement, localProps);
  };

  const handleDelete = () => {
    if (window.confirm('Supprimer cet élément ?')) {
      onDeleteElement(selectedElement);
    }
  };

  const renderWallProperties = () => (
    <>
      <h3 className={styles.sectionTitle}>Mur</h3>
      <div className={styles.field}>
        <label>Point de départ X (px)</label>
        <input
          type="number"
          value={localProps.points?.[0]?.x || 0}
          onChange={(e) => {
            const newPoints = [...(localProps.points || [])];
            newPoints[0] = { ...newPoints[0], x: parseFloat(e.target.value) };
            handleChange('points', newPoints);
          }}
        />
      </div>
      <div className={styles.field}>
        <label>Point de départ Y (px)</label>
        <input
          type="number"
          value={localProps.points?.[0]?.y || 0}
          onChange={(e) => {
            const newPoints = [...(localProps.points || [])];
            newPoints[0] = { ...newPoints[0], y: parseFloat(e.target.value) };
            handleChange('points', newPoints);
          }}
        />
      </div>
      <div className={styles.field}>
        <label>Point de fin X (px)</label>
        <input
          type="number"
          value={localProps.points?.[1]?.x || 0}
          onChange={(e) => {
            const newPoints = [...(localProps.points || [])];
            newPoints[1] = { ...newPoints[1], x: parseFloat(e.target.value) };
            handleChange('points', newPoints);
          }}
        />
      </div>
      <div className={styles.field}>
        <label>Point de fin Y (px)</label>
        <input
          type="number"
          value={localProps.points?.[1]?.y || 0}
          onChange={(e) => {
            const newPoints = [...(localProps.points || [])];
            newPoints[1] = { ...newPoints[1], y: parseFloat(e.target.value) };
            handleChange('points', newPoints);
          }}
        />
      </div>
      <div className={styles.field}>
        <label>Épaisseur (px)</label>
        <input
          type="number"
          value={localProps.thickness || 10}
          onChange={(e) => handleChange('thickness', parseFloat(e.target.value))}
        />
      </div>
      <div className={styles.field}>
        <label>Couleur</label>
        <input
          type="color"
          value={localProps.color || '#000000'}
          onChange={(e) => handleChange('color', e.target.value)}
        />
      </div>
    </>
  );

  const renderDoorProperties = () => (
    <>
      <h3 className={styles.sectionTitle}>Porte</h3>
      <div className={styles.field}>
        <label>Position X (px)</label>
        <input
          type="number"
          value={localProps.position?.x || 0}
          onChange={(e) => handleChange('position', { ...localProps.position, x: parseFloat(e.target.value) })}
        />
      </div>
      <div className={styles.field}>
        <label>Position Y (px)</label>
        <input
          type="number"
          value={localProps.position?.y || 0}
          onChange={(e) => handleChange('position', { ...localProps.position, y: parseFloat(e.target.value) })}
        />
      </div>
      <div className={styles.field}>
        <label>Largeur (px)</label>
        <input
          type="number"
          value={localProps.width || 80}
          onChange={(e) => handleChange('width', parseFloat(e.target.value))}
        />
      </div>
      <div className={styles.field}>
        <label>Sens d&apos;ouverture</label>
        <select
          value={localProps.openingSide || 'left'}
          onChange={(e) => handleChange('openingSide', e.target.value)}
        >
          <option value="left">Gauche</option>
          <option value="right">Droite</option>
        </select>
      </div>
      <div className={styles.field}>
        <label>Rotation (degrés)</label>
        <input
          type="number"
          value={localProps.rotation || 0}
          onChange={(e) => handleChange('rotation', parseFloat(e.target.value))}
        />
      </div>
    </>
  );

  const renderDoubleDoorProperties = () => (
    <>
      <h3 className={styles.sectionTitle}>Porte Double</h3>
      <div className={styles.field}>
        <label>Position X (px)</label>
        <input
          type="number"
          value={localProps.position?.x || 0}
          onChange={(e) => handleChange('position', { ...localProps.position, x: parseFloat(e.target.value) })}
        />
      </div>
      <div className={styles.field}>
        <label>Position Y (px)</label>
        <input
          type="number"
          value={localProps.position?.y || 0}
          onChange={(e) => handleChange('position', { ...localProps.position, y: parseFloat(e.target.value) })}
        />
      </div>
      <div className={styles.field}>
        <label>Largeur (px)</label>
        <input
          type="number"
          value={localProps.width || 120}
          onChange={(e) => handleChange('width', parseFloat(e.target.value))}
        />
      </div>
      <div className={styles.field}>
        <label>Direction d&apos;ouverture</label>
        <select
          value={localProps.openingDirection || 'outward'}
          onChange={(e) => handleChange('openingDirection', e.target.value)}
        >
          <option value="outward">Vers l&apos;extérieur</option>
          <option value="inward">Vers l&apos;intérieur</option>
        </select>
      </div>
      <div className={styles.field}>
        <label>Rotation (degrés)</label>
        <input
          type="number"
          value={localProps.rotation || 0}
          onChange={(e) => handleChange('rotation', parseFloat(e.target.value))}
        />
      </div>
    </>
  );

  const renderWindowProperties = () => (
    <>
      <h3 className={styles.sectionTitle}>Fenêtre</h3>
      <div className={styles.field}>
        <label>Position X (px)</label>
        <input
          type="number"
          value={localProps.position?.x || 0}
          onChange={(e) => handleChange('position', { ...localProps.position, x: parseFloat(e.target.value) })}
        />
      </div>
      <div className={styles.field}>
        <label>Position Y (px)</label>
        <input
          type="number"
          value={localProps.position?.y || 0}
          onChange={(e) => handleChange('position', { ...localProps.position, y: parseFloat(e.target.value) })}
        />
      </div>
      <div className={styles.field}>
        <label>Largeur (px)</label>
        <input
          type="number"
          value={localProps.width || 120}
          onChange={(e) => handleChange('width', parseFloat(e.target.value))}
        />
      </div>
      <div className={styles.field}>
        <label>Rotation (degrés)</label>
        <input
          type="number"
          value={localProps.rotation || 0}
          onChange={(e) => handleChange('rotation', parseFloat(e.target.value))}
        />
      </div>
    </>
  );

  const renderRadiatorProperties = () => (
    <>
      <h3 className={styles.sectionTitle}>Radiateur</h3>
      <div className={styles.field}>
        <label>Position X (px)</label>
        <input
          type="number"
          value={localProps.position?.x || 0}
          onChange={(e) => handleChange('position', { ...localProps.position, x: parseFloat(e.target.value) })}
        />
      </div>
      <div className={styles.field}>
        <label>Position Y (px)</label>
        <input
          type="number"
          value={localProps.position?.y || 0}
          onChange={(e) => handleChange('position', { ...localProps.position, y: parseFloat(e.target.value) })}
        />
      </div>
      <div className={styles.field}>
        <label>Largeur (px)</label>
        <input
          type="number"
          value={localProps.width || 80}
          onChange={(e) => handleChange('width', parseFloat(e.target.value))}
        />
      </div>
      <div className={styles.field}>
        <label>Hauteur (px)</label>
        <input
          type="number"
          value={localProps.height || 15}
          onChange={(e) => handleChange('height', parseFloat(e.target.value))}
        />
      </div>
      <div className={styles.field}>
        <label>Rotation (degrés)</label>
        <input
          type="number"
          value={localProps.rotation || 0}
          onChange={(e) => handleChange('rotation', parseFloat(e.target.value))}
        />
      </div>
    </>
  );

  const renderRoomProperties = () => {
    const width = localProps.dimensions?.width || 0;
    const height = localProps.dimensions?.height || 0;

    return (
      <>
        <h3 className={styles.sectionTitle}>Pièce</h3>
        <div className={styles.field}>
          <label>Nom</label>
          <input
            type="text"
            value={localProps.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label>Largeur (px)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => {
              const newWidth = parseFloat(e.target.value);
              const x1 = localProps.points?.[0]?.x || 0;
              const y1 = localProps.points?.[0]?.y || 0;

              handleChange('points', [
                { x: x1, y: y1 },
                { x: x1 + newWidth, y: y1 },
                { x: x1 + newWidth, y: y1 + height },
                { x: x1, y: y1 + height }
              ]);
              handleChange('dimensions', { width: newWidth, height });
            }}
          />
        </div>
        <div className={styles.field}>
          <label>Hauteur (px)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => {
              const newHeight = parseFloat(e.target.value);
              const x1 = localProps.points?.[0]?.x || 0;
              const y1 = localProps.points?.[0]?.y || 0;

              handleChange('points', [
                { x: x1, y: y1 },
                { x: x1 + width, y: y1 },
                { x: x1 + width, y: y1 + newHeight },
                { x: x1, y: y1 + newHeight }
              ]);
              handleChange('dimensions', { width, height: newHeight });
            }}
          />
        </div>
        <div className={styles.field}>
          <label>Position X (px)</label>
          <input
            type="number"
            value={localProps.points?.[0]?.x || 0}
            onChange={(e) => {
              const newX = parseFloat(e.target.value);
              const oldX = localProps.points?.[0]?.x || 0;
              const deltaX = newX - oldX;

              const newPoints = localProps.points.map(p => ({
                x: p.x + deltaX,
                y: p.y
              }));
              handleChange('points', newPoints);
            }}
          />
        </div>
        <div className={styles.field}>
          <label>Position Y (px)</label>
          <input
            type="number"
            value={localProps.points?.[0]?.y || 0}
            onChange={(e) => {
              const newY = parseFloat(e.target.value);
              const oldY = localProps.points?.[0]?.y || 0;
              const deltaY = newY - oldY;

              const newPoints = localProps.points.map(p => ({
                x: p.x,
                y: p.y + deltaY
              }));
              handleChange('points', newPoints);
            }}
          />
        </div>
        <div className={styles.field}>
          <label>Couleur de fond</label>
          <input
            type="color"
            value={localProps.fill || '#f5f5f5'}
            onChange={(e) => handleChange('fill', e.target.value)}
          />
        </div>
      </>
    );
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>Propriétés</h2>
      </div>

      <div className={styles.content}>
        {element.type === 'wall' && renderWallProperties()}
        {element.type === 'door' && renderDoorProperties()}
        {element.type === 'doubleDoor' && renderDoubleDoorProperties()}
        {element.type === 'window' && renderWindowProperties()}
        {element.type === 'radiator' && renderRadiatorProperties()}
        {element.type === 'room' && renderRoomProperties()}
      </div>

      <div className={styles.actions}>
        <button className={styles.applyButton} onClick={handleApply}>
          Appliquer
        </button>
        <button className={styles.deleteButton} onClick={handleDelete}>
          Supprimer
        </button>
      </div>
    </div>
  );
}
