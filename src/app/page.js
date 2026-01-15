'use client';

import { useState, useRef } from 'react';
import FurniturePanel from '@/components/FurniturePanel';
import FloorPlanCanvas from '@/components/FloorPlanCanvas';
import Toolbar from '@/components/Toolbar';
import ViewsManager from '@/components/ViewsManager';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useViews } from '@/hooks/useViews';

export default function Home() {
  const [floorPlanImage, setFloorPlanImage] = useState(null);
  const [placedFurniture, setPlacedFurniture] = useState([]);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [showViewsManager, setShowViewsManager] = useState(false);
  const canvasRef = useRef(null);

  const { handleDragStart, handleDrop, handleDragOver } = useDragAndDrop();
  const {
    views,
    currentViewId,
    saveView,
    loadView,
    deleteView,
    createNewView,
    getCurrentView
  } = useViews();

  const onDrop = (e) => {
    const newItem = handleDrop(e, canvasRef);
    if (newItem) {
      setPlacedFurniture((prev) => [...prev, newItem]);
      setSelectedFurniture(newItem.instanceId);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tous les meubles ?')) {
      setPlacedFurniture([]);
      setSelectedFurniture(null);
    }
  };

  const handleMoveFurniture = (instanceId, newX, newY) => {
    setPlacedFurniture((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId
          ? { ...item, x: newX, y: newY }
          : item
      )
    );
  };

  const handleRotateFurniture = (instanceId) => {
    setPlacedFurniture((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId
          ? { ...item, rotation: (item.rotation + 90) % 360 }
          : item
      )
    );
  };

  const handleDeleteFurniture = (instanceId) => {
    setPlacedFurniture((prev) =>
      prev.filter((item) => item.instanceId !== instanceId)
    );
    if (selectedFurniture === instanceId) {
      setSelectedFurniture(null);
    }
  };

  const handleSelectFurniture = (instanceId) => {
    setSelectedFurniture(instanceId);
  };

  const handleResizeFurniture = (instanceId, newWidth, newHeight, newX, newY) => {
    setPlacedFurniture((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId
          ? { ...item, width: newWidth, height: newHeight, x: newX, y: newY }
          : item
      )
    );
  };

  const handleSaveView = () => {
    const currentView = getCurrentView();
    const defaultName = currentView?.name || `Vue ${views.length + 1}`;

    const name = window.prompt(
      currentViewId ? 'Modifier le nom de la vue :' : 'Nom de la vue :',
      defaultName
    );

    if (name === null) return; // User cancelled

    const savedView = saveView(name || defaultName, floorPlanImage, placedFurniture);
    alert(currentViewId ? 'Vue mise à jour !' : 'Vue sauvegardée !');
  };

  const handleLoadView = (viewId) => {
    const view = loadView(viewId);
    if (view) {
      setFloorPlanImage(view.floorPlanImage);
      setPlacedFurniture(view.placedFurniture || []);
      setSelectedFurniture(null);
    }
  };

  const handleNewView = () => {
    if (currentViewId && (floorPlanImage || placedFurniture.length > 0)) {
      const confirm = window.confirm(
        'Créer une nouvelle vue ? Les modifications non sauvegardées seront perdues.'
      );
      if (!confirm) return;
    }

    createNewView();
    setFloorPlanImage(null);
    setPlacedFurniture([]);
    setSelectedFurniture(null);
  };

  const currentView = getCurrentView();

  return (
    <div className="app-container">
      <Toolbar
        onClearAll={handleClearAll}
        hasPlacedFurniture={placedFurniture.length > 0}
        onSaveView={handleSaveView}
        onOpenViews={() => setShowViewsManager(true)}
        onNewView={handleNewView}
        currentViewName={currentView?.name}
        viewsCount={views.length}
      />
      <div className="main-content">
        <FurniturePanel onDragStart={handleDragStart} />
        <FloorPlanCanvas
          ref={canvasRef}
          floorPlanImage={floorPlanImage}
          onImageUpload={setFloorPlanImage}
          placedFurniture={placedFurniture}
          onDrop={onDrop}
          onDragOver={handleDragOver}
          onMoveFurniture={handleMoveFurniture}
          onRotateFurniture={handleRotateFurniture}
          onDeleteFurniture={handleDeleteFurniture}
          onResizeFurniture={handleResizeFurniture}
          selectedFurniture={selectedFurniture}
          onSelectFurniture={handleSelectFurniture}
        />
      </div>

      {showViewsManager && (
        <ViewsManager
          views={views}
          currentViewId={currentViewId}
          onLoadView={handleLoadView}
          onDeleteView={deleteView}
          onClose={() => setShowViewsManager(false)}
        />
      )}
    </div>
  );
}
