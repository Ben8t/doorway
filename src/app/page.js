'use client';

import { useState, useRef } from 'react';
import FurniturePanel from '@/components/FurniturePanel';
import FloorPlanCanvas from '@/components/FloorPlanCanvas';
import Toolbar from '@/components/Toolbar';
import ViewsManager from '@/components/ViewsManager';
import PlanCanvas from '@/components/PlanCanvas';
import PlanToolbar from '@/components/PlanToolbar';
import PlanSelector from '@/components/PlanSelector';
import PlanPropertiesPanel from '@/components/PlanPropertiesPanel';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useViews } from '@/hooks/useViews';
import { usePlans } from '@/hooks/usePlans';
import { usePlanDrawing } from '@/hooks/usePlanDrawing';

export default function Home() {
  const [appMode, setAppMode] = useState('furniture'); // 'furniture' | 'plan-create' | 'plan-edit'
  const [floorPlanImage, setFloorPlanImage] = useState(null);
  const [placedFurniture, setPlacedFurniture] = useState([]);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [showViewsManager, setShowViewsManager] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [draggingElement, setDraggingElement] = useState(null);
  const [planZoom, setPlanZoom] = useState(1);
  const [furnitureZoom, setFurnitureZoom] = useState(1);
  const canvasRef = useRef(null);

  const { handleDragStart, handleDrop, handleDragOver } = useDragAndDrop();
  const {
    views,
    currentViewId,
    saveView,
    loadView,
    deleteView,
    duplicateView,
    createNewView,
    getCurrentView
  } = useViews();

  const {
    plans,
    currentPlanId,
    savePlan,
    loadPlan,
    deletePlan,
    createNewPlan,
    getCurrentPlan
  } = usePlans();

  const {
    activeTool,
    elements,
    selectedElement,
    currentDrawing,
    gridEnabled,
    setActiveTool,
    setSelectedElement,
    setGridEnabled,
    startDrawingWall,
    updateDrawingWall,
    finishDrawingWall,
    addDoorToWall,
    addDoubleDoorToWall,
    addWindowToWall,
    addRadiatorToWall,
    startDrawingRoom,
    updateDrawingRoom,
    finishDrawingRoom,
    deleteElement,
    moveElement,
    updateElementProperties,
    findWallAtPosition,
    findRoomEdgeAtPosition,
    loadElements,
    clearAll
  } = usePlanDrawing();

  // Plan mode handlers
  const handleCreatePlan = () => {
    createNewPlan();
    clearAll();
    setAppMode('plan-create');
  };

  const handleSelectPlan = () => {
    setShowPlanSelector(true);
  };

  const handleUsePlanAsBackground = (planId) => {
    setFloorPlanImage({ type: 'plan', planId });
    setAppMode('furniture');
    setShowPlanSelector(false);
  };

  const handleEditPlan = (planId) => {
    const plan = loadPlan(planId);
    if (plan) {
      loadElements(plan.elements);
      setAppMode('plan-edit');
      setShowPlanSelector(false);
    }
  };

  const handleSavePlan = () => {
    const currentPlan = getCurrentPlan();
    const defaultName = currentPlan?.name || `Plan ${plans.length + 1}`;

    const name = window.prompt(
      currentPlanId ? 'Modifier le nom du plan :' : 'Nom du plan :',
      defaultName
    );

    if (name === null) return;

    savePlan(name || defaultName, elements, { width: 4000, height: 4000 });
    alert(currentPlanId ? 'Plan mis à jour !' : 'Plan sauvegardé !');
  };

  const handleExitPlanMode = () => {
    // If current plan exists, use it as background
    if (currentPlanId) {
      setFloorPlanImage({ type: 'plan', planId: currentPlanId });
    }
    setAppMode('furniture');
    setPlanZoom(1); // Reset zoom when exiting
  };

  const handleZoomIn = () => {
    setPlanZoom(prev => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setPlanZoom(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleFurnitureZoomIn = () => {
    setFurnitureZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleFurnitureZoomOut = () => {
    setFurnitureZoom(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleFurnitureZoomReset = () => {
    setFurnitureZoom(1);
  };

  const handleExportPlan = () => {
    const currentPlan = getCurrentPlan();
    if (!currentPlan) {
      alert('Aucun plan à exporter. Veuillez d\'abord sauvegarder votre plan.');
      return;
    }

    exportPlanToFile(currentPlan);
  };

  const handleExportPlanById = (planId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      alert('Plan introuvable.');
      return;
    }

    exportPlanToFile(plan);
  };

  const exportPlanToFile = (plan) => {
    const exportData = {
      version: '1.0',
      plan: plan,
      exportDate: new Date().toISOString()
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plan.name || 'plan'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportPlan = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);

        // Validate the imported data
        if (!importData.plan || !importData.plan.elements) {
          alert('Fichier invalide: format de plan non reconnu.');
          return;
        }

        const importedPlan = importData.plan;

        // Generate new ID for the imported plan
        const newPlan = {
          ...importedPlan,
          id: crypto.randomUUID(),
          name: `${importedPlan.name || 'Plan'} (importé)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Add to plans list
        savePlan(newPlan.name, newPlan.elements, newPlan.canvasSize);
        alert(`Plan "${newPlan.name}" importé avec succès !`);

        // Clear the file input
        event.target.value = '';
      } catch (error) {
        console.error('Error importing plan:', error);
        alert('Erreur lors de l\'importation du plan. Veuillez vérifier le fichier.');
      }
    };
    reader.readAsText(file);
  };

  const handlePlanCanvasClick = (coords) => {
    if (activeTool === 'wall') {
      if (!currentDrawing) {
        startDrawingWall(coords);
      } else {
        finishDrawingWall(coords);
        setActiveTool('select');
      }
    } else if (activeTool === 'door') {
      addDoorToWall(coords.x, coords.y);
      setActiveTool('select');
    } else if (activeTool === 'doubleDoor') {
      addDoubleDoorToWall(coords.x, coords.y);
      setActiveTool('select');
    } else if (activeTool === 'window') {
      addWindowToWall(coords.x, coords.y);
      setActiveTool('select');
    } else if (activeTool === 'radiator') {
      addRadiatorToWall(coords.x, coords.y);
      setActiveTool('select');
    }
  };

  const handlePlanCanvasMouseDown = (coords, e) => {
    if (activeTool === 'room') {
      startDrawingRoom(coords);
    }
    // Note: element dragging is handled by handleElementMouseDown
  };

  const handleElementMouseDown = (elementId, coords) => {
    if (activeTool === 'select') {
      // Select the element and start dragging immediately
      setSelectedElement(elementId);
      setDraggingElement({
        id: elementId,
        startX: coords.x,
        startY: coords.y
      });
    }
  };

  const handlePlanCanvasMouseMove = (coords) => {
    if (activeTool === 'wall' && currentDrawing) {
      updateDrawingWall(coords);
    } else if (activeTool === 'room' && currentDrawing) {
      updateDrawingRoom(coords);
    } else if (activeTool === 'select' && draggingElement) {
      // Dragging an element
      const deltaX = coords.x - draggingElement.startX;
      const deltaY = coords.y - draggingElement.startY;

      moveElement(draggingElement.id, deltaX, deltaY);

      setDraggingElement({
        ...draggingElement,
        startX: coords.x,
        startY: coords.y
      });
    }
  };

  const handlePlanCanvasMouseUp = (coords) => {
    if (activeTool === 'room' && currentDrawing) {
      const label = window.prompt('Nom de la pièce (optionnel):');
      finishDrawingRoom(coords, label || '');
      setActiveTool('select');
    } else if (draggingElement) {
      // Stop dragging
      setDraggingElement(null);
    }
  };

  const handleDeleteSelectedElement = () => {
    if (selectedElement) {
      deleteElement(selectedElement);
    }
  };

  // Furniture mode handlers
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

  const handleDuplicateView = (viewId) => {
    const newView = duplicateView(viewId);
    if (newView) {
      setFloorPlanImage(newView.floorPlanImage);
      setPlacedFurniture(newView.placedFurniture || []);
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
  const currentPlan = getCurrentPlan();

  return (
    <div className="app-container">
      <Toolbar
        appMode={appMode}
        onClearAll={handleClearAll}
        hasPlacedFurniture={placedFurniture.length > 0}
        onSaveView={handleSaveView}
        onOpenViews={() => setShowViewsManager(true)}
        onNewView={handleNewView}
        onCreatePlan={handleCreatePlan}
        currentViewName={currentView?.name}
        currentPlanName={currentPlan?.name}
        viewsCount={views.length}
        zoom={furnitureZoom}
        onZoomIn={handleFurnitureZoomIn}
        onZoomOut={handleFurnitureZoomOut}
        onZoomReset={handleFurnitureZoomReset}
      />
      <div className="main-content">
        {appMode === 'furniture' && (
          <>
            <FurniturePanel onDragStart={handleDragStart} />
            <FloorPlanCanvas
              ref={canvasRef}
              floorPlanImage={floorPlanImage}
              onImageUpload={setFloorPlanImage}
              onCreatePlan={handleCreatePlan}
              onSelectPlan={handleSelectPlan}
              placedFurniture={placedFurniture}
              onDrop={onDrop}
              onDragOver={handleDragOver}
              onMoveFurniture={handleMoveFurniture}
              onRotateFurniture={handleRotateFurniture}
              onDeleteFurniture={handleDeleteFurniture}
              onResizeFurniture={handleResizeFurniture}
              selectedFurniture={selectedFurniture}
              onSelectFurniture={handleSelectFurniture}
              plans={plans}
              zoom={furnitureZoom}
            />
          </>
        )}

        {(appMode === 'plan-create' || appMode === 'plan-edit') && (
          <>
            <PlanToolbar
              activeTool={activeTool}
              onToolChange={setActiveTool}
              gridEnabled={gridEnabled}
              onGridToggle={setGridEnabled}
              onSave={handleSavePlan}
              onExport={handleExportPlan}
              onExit={handleExitPlanMode}
              selectedElement={selectedElement}
              onDeleteSelected={handleDeleteSelectedElement}
              zoom={planZoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />
            <PlanCanvas
              activeTool={activeTool}
              elements={elements}
              selectedElement={selectedElement}
              currentDrawing={currentDrawing}
              gridSize={10}
              gridEnabled={gridEnabled}
              onElementClick={(id) => setSelectedElement(id)}
              onElementMouseDown={handleElementMouseDown}
              onCanvasClick={handlePlanCanvasClick}
              onMouseDown={handlePlanCanvasMouseDown}
              onMouseMove={handlePlanCanvasMouseMove}
              onMouseUp={handlePlanCanvasMouseUp}
              canvasSize={{ width: 4000, height: 4000 }}
              zoom={planZoom}
              findWallAtPosition={findWallAtPosition}
              findRoomEdgeAtPosition={findRoomEdgeAtPosition}
            />
            <PlanPropertiesPanel
              selectedElement={selectedElement}
              elements={elements}
              onUpdateElement={updateElementProperties}
              onDeleteElement={deleteElement}
            />
          </>
        )}
      </div>

      {showViewsManager && (
        <ViewsManager
          views={views}
          currentViewId={currentViewId}
          onLoadView={handleLoadView}
          onDuplicateView={handleDuplicateView}
          onDeleteView={deleteView}
          onClose={() => setShowViewsManager(false)}
          plans={plans}
        />
      )}

      {showPlanSelector && (
        <PlanSelector
          plans={plans}
          onUsePlan={handleUsePlanAsBackground}
          onEditPlan={handleEditPlan}
          onDeletePlan={deletePlan}
          onClose={() => setShowPlanSelector(false)}
          onImport={handleImportPlan}
          onExportPlan={handleExportPlanById}
        />
      )}
    </div>
  );
}
