'use client';

import { useState, useRef } from 'react';
import FurniturePanel from '@/components/FurniturePanel';
import FloorPlanCanvas from '@/components/FloorPlanCanvas';
import Toolbar from '@/components/Toolbar';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

export default function Home() {
  const [floorPlanImage, setFloorPlanImage] = useState(null);
  const [placedFurniture, setPlacedFurniture] = useState([]);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const canvasRef = useRef(null);

  const { handleDragStart, handleDrop, handleDragOver } = useDragAndDrop();

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

  return (
    <div className="app-container">
      <Toolbar
        onClearAll={handleClearAll}
        hasPlacedFurniture={placedFurniture.length > 0}
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
    </div>
  );
}
