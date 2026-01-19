import { useRef, useCallback, useEffect, useState } from 'react';
import PlanRenderer from './PlanRenderer';
import styles from './PlanCanvas.module.css';

export default function PlanCanvas({
  activeTool,
  elements,
  selectedElement,
  currentDrawing,
  gridSize,
  gridEnabled,
  onElementClick,
  onElementMouseDown,
  onCanvasClick,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  canvasSize = { width: 800, height: 600 },
  zoom = 1,
  findWallAtPosition,
  findRoomEdgeAtPosition
}) {
  const canvasRef = useRef(null);
  const hasCenteredRef = useRef(false);
  const [snapPreview, setSnapPreview] = useState(null);

  // Center the view only on initial mount for large canvas
  useEffect(() => {
    if (!hasCenteredRef.current && canvasRef.current && canvasSize.width > 1000) {
      const container = canvasRef.current;
      const centerX = (canvasSize.width - container.clientWidth) / 2;
      const centerY = (canvasSize.height - container.clientHeight) / 2;
      container.scrollLeft = centerX;
      container.scrollTop = centerY;
      hasCenteredRef.current = true;
    }
  }, [canvasSize]);

  const getCanvasCoordinates = useCallback((e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const container = canvasRef.current;
    const svg = container.querySelector('svg');
    if (!svg) return { x: 0, y: 0 };

    const rect = svg.getBoundingClientRect();
    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, [canvasSize, zoom]);

  const handleMouseDown = useCallback((e) => {
    // Don't start drag if clicking on an SVG element (already selected element)
    if (e.target.tagName !== 'svg' && e.target.tagName !== 'DIV') {
      return; // Clicked on an element, let PlanRenderer handle it
    }
    const coords = getCanvasCoordinates(e);
    onMouseDown && onMouseDown(coords, e);
  }, [getCanvasCoordinates, onMouseDown]);

  const handleMouseMove = useCallback((e) => {
    const coords = getCanvasCoordinates(e);
    onMouseMove && onMouseMove(coords, e);

    // Update snap preview for door/window/radiator tools
    if ((activeTool === 'door' || activeTool === 'doubleDoor' || activeTool === 'window' || activeTool === 'radiator') && findWallAtPosition && findRoomEdgeAtPosition) {
      const wall = findWallAtPosition(coords.x, coords.y, 15);
      const roomEdge = findRoomEdgeAtPosition(coords.x, coords.y, 15);

      if (wall || roomEdge) {
        let targetEdge = null;

        if (wall && roomEdge) {
          // Both found, choose the closer one
          const wallDist = Math.sqrt(
            Math.pow(coords.x - ((wall.points[0].x + wall.points[1].x) / 2), 2) +
            Math.pow(coords.y - ((wall.points[0].y + wall.points[1].y) / 2), 2)
          );
          const roomDist = Math.sqrt(
            Math.pow(coords.x - ((roomEdge.edge.start.x + roomEdge.edge.end.x) / 2), 2) +
            Math.pow(coords.y - ((roomEdge.edge.start.y + roomEdge.edge.end.y) / 2), 2)
          );

          if (wallDist <= roomDist) {
            targetEdge = { start: wall.points[0], end: wall.points[1] };
          } else {
            targetEdge = { start: roomEdge.edge.start, end: roomEdge.edge.end };
          }
        } else if (wall) {
          targetEdge = { start: wall.points[0], end: wall.points[1] };
        } else if (roomEdge) {
          targetEdge = { start: roomEdge.edge.start, end: roomEdge.edge.end };
        }

        setSnapPreview(targetEdge);
      } else {
        setSnapPreview(null);
      }
    } else {
      setSnapPreview(null);
    }
  }, [getCanvasCoordinates, onMouseMove, activeTool, findWallAtPosition, findRoomEdgeAtPosition]);

  const handleMouseUp = useCallback((e) => {
    const coords = getCanvasCoordinates(e);
    onMouseUp && onMouseUp(coords, e);
  }, [getCanvasCoordinates, onMouseUp]);

  const handleClick = useCallback((e) => {
    const coords = getCanvasCoordinates(e);
    onCanvasClick && onCanvasClick(coords, e);
  }, [getCanvasCoordinates, onCanvasClick]);

  // Render temporary drawing preview
  const renderDrawingPreview = () => {
    if (!currentDrawing) return null;

    if (currentDrawing.type === 'wall' && currentDrawing.currentPoint) {
      return (
        <line
          x1={currentDrawing.startPoint.x}
          y1={currentDrawing.startPoint.y}
          x2={currentDrawing.currentPoint.x}
          y2={currentDrawing.currentPoint.y}
          stroke="#4A90E2"
          strokeWidth={10}
          strokeDasharray="5,5"
          opacity={0.6}
        />
      );
    }

    if (currentDrawing.type === 'room' && currentDrawing.currentPoint) {
      const x1 = Math.min(currentDrawing.startPoint.x, currentDrawing.currentPoint.x);
      const y1 = Math.min(currentDrawing.startPoint.y, currentDrawing.currentPoint.y);
      const width = Math.abs(currentDrawing.currentPoint.x - currentDrawing.startPoint.x);
      const height = Math.abs(currentDrawing.currentPoint.y - currentDrawing.startPoint.y);

      return (
        <rect
          x={x1}
          y={y1}
          width={width}
          height={height}
          fill="#4A90E2"
          fillOpacity={0.1}
          stroke="#4A90E2"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
      );
    }

    return null;
  };

  const getCursor = () => {
    switch (activeTool) {
      case 'wall':
        return 'crosshair';
      case 'door':
      case 'doubleDoor':
      case 'window':
      case 'radiator':
        return 'copy';
      case 'room':
        return 'crosshair';
      case 'select':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div
      ref={canvasRef}
      className={styles.planCanvas}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      style={{ cursor: getCursor() }}
    >
      <svg
        className={styles.svg}
        width={canvasSize.width}
        height={canvasSize.height}
        viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
      >
        {/* Grid */}
        {gridEnabled && (
          <g className={styles.grid}>
            {Array.from({ length: Math.ceil(canvasSize.width / gridSize) + 1 }, (_, i) => (
              <line
                key={`v-${i}`}
                x1={i * gridSize}
                y1={0}
                x2={i * gridSize}
                y2={canvasSize.height}
                stroke="#e0e0e0"
                strokeWidth={i % 5 === 0 ? 0.5 : 0.25}
              />
            ))}
            {Array.from({ length: Math.ceil(canvasSize.height / gridSize) + 1 }, (_, i) => (
              <line
                key={`h-${i}`}
                x1={0}
                y1={i * gridSize}
                x2={canvasSize.width}
                y2={i * gridSize}
                stroke="#e0e0e0"
                strokeWidth={i % 5 === 0 ? 0.5 : 0.25}
              />
            ))}
          </g>
        )}

        {/* Existing elements */}
        <PlanRenderer
          elements={elements}
          canvasSize={canvasSize}
          interactive={true}
          selectedElement={selectedElement}
          onElementClick={onElementClick}
          onElementMouseDown={(id, e) => {
            const coords = getCanvasCoordinates(e);
            onElementMouseDown && onElementMouseDown(id, coords);
          }}
          showGrid={false} // We handle grid separately
        />

        {/* Drawing preview */}
        {renderDrawingPreview()}

        {/* Snap preview for door/window/radiator placement */}
        {snapPreview && (activeTool === 'door' || activeTool === 'doubleDoor' || activeTool === 'window' || activeTool === 'radiator') && (
          <line
            x1={snapPreview.start.x}
            y1={snapPreview.start.y}
            x2={snapPreview.end.x}
            y2={snapPreview.end.y}
            stroke="#4A90E2"
            strokeWidth={15}
            opacity={0.3}
            pointerEvents="none"
          />
        )}
      </svg>

      {/* Hint text */}
      <div className={styles.hint}>
        {activeTool === 'wall' && !currentDrawing && 'Cliquez pour placer le début du mur'}
        {activeTool === 'wall' && currentDrawing && 'Cliquez pour terminer le mur'}
        {activeTool === 'door' && 'Cliquez sur un mur ou bord de pièce pour placer une porte'}
        {activeTool === 'doubleDoor' && 'Cliquez sur un mur ou bord de pièce pour placer une porte double'}
        {activeTool === 'window' && 'Cliquez sur un mur ou bord de pièce pour placer une fenêtre'}
        {activeTool === 'radiator' && 'Cliquez sur un mur ou bord de pièce pour placer un radiateur'}
        {activeTool === 'room' && !currentDrawing && 'Cliquez et glissez pour créer une pièce'}
        {activeTool === 'room' && currentDrawing && 'Relâchez pour créer la pièce'}
        {activeTool === 'select' && 'Cliquez sur un élément pour le sélectionner'}
      </div>
    </div>
  );
}
