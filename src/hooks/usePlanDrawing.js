import { useState, useCallback } from 'react';

export function usePlanDrawing() {
  const [activeTool, setActiveTool] = useState('wall'); // 'wall' | 'door' | 'doubleDoor' | 'window' | 'radiator' | 'room' | 'select'
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [currentDrawing, setCurrentDrawing] = useState(null);
  const [gridSize, setGridSize] = useState(10);
  const [gridEnabled, setGridEnabled] = useState(true);

  // Helper: Snap point to grid
  const snapToGrid = useCallback((x, y) => {
    if (!gridEnabled) return { x, y };
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }, [gridSize, gridEnabled]);

  // Helper: Calculate distance from point to line segment
  const pointToLineDistance = useCallback((px, py, start, end) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {
      // Start and end are the same point
      return Math.sqrt((px - start.x) ** 2 + (py - start.y) ** 2);
    }

    // Calculate projection of point onto line segment
    let t = ((px - start.x) * dx + (py - start.y) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));

    const projX = start.x + t * dx;
    const projY = start.y + t * dy;

    return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
  }, []);

  // Helper: Find wall at position
  const findWallAtPosition = useCallback((x, y, tolerance = 10) => {
    return elements.find(el => {
      if (el.type !== 'wall') return false;
      const distance = pointToLineDistance(x, y, el.points[0], el.points[1]);
      return distance <= tolerance;
    });
  }, [elements, pointToLineDistance]);

  // Helper: Find room edge at position
  const findRoomEdgeAtPosition = useCallback((x, y, tolerance = 15) => {
    for (const el of elements) {
      if (el.type !== 'room') continue;

      const points = el.points;
      // Check each edge of the room
      for (let i = 0; i < points.length; i++) {
        const start = points[i];
        const end = points[(i + 1) % points.length];
        const distance = pointToLineDistance(x, y, start, end);

        if (distance <= tolerance) {
          return {
            element: el,
            edge: { start, end, index: i }
          };
        }
      }
    }
    return null;
  }, [elements, pointToLineDistance]);

  // Helper: Calculate position along wall
  const calculateWallPosition = useCallback((x, y, wall) => {
    const start = wall.points[0];
    const end = wall.points[1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;

    let t = ((x - start.x) * dx + (y - start.y) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));

    return {
      x: start.x + t * dx,
      y: start.y + t * dy,
      t // Parameter along the wall (0 to 1)
    };
  }, []);

  // Helper: Calculate wall angle
  const calculateWallAngle = useCallback((wall) => {
    const start = wall.points[0];
    const end = wall.points[1];
    return Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);
  }, []);

  // Wall drawing
  const startDrawingWall = useCallback((point) => {
    const snapped = snapToGrid(point.x, point.y);
    setCurrentDrawing({
      type: 'wall',
      startPoint: snapped
    });
  }, [snapToGrid]);

  const updateDrawingWall = useCallback((point) => {
    if (!currentDrawing || currentDrawing.type !== 'wall') return;
    const snapped = snapToGrid(point.x, point.y);
    setCurrentDrawing(prev => ({
      ...prev,
      currentPoint: snapped
    }));
  }, [currentDrawing, snapToGrid]);

  const finishDrawingWall = useCallback((point) => {
    if (!currentDrawing || currentDrawing.type !== 'wall') return;
    const snapped = snapToGrid(point.x, point.y);

    // Don't create wall if start and end are the same
    if (snapped.x === currentDrawing.startPoint.x && snapped.y === currentDrawing.startPoint.y) {
      setCurrentDrawing(null);
      return;
    }

    const newWall = {
      id: crypto.randomUUID(),
      type: 'wall',
      points: [currentDrawing.startPoint, snapped],
      thickness: 10,
      color: '#000000'
    };

    setElements(prev => [...prev, newWall]);
    setCurrentDrawing(null);
  }, [currentDrawing, snapToGrid]);

  // Door/Window placement
  const addDoorToWall = useCallback((x, y) => {
    const wall = findWallAtPosition(x, y, 15);
    const roomEdge = findRoomEdgeAtPosition(x, y, 15);

    let targetWall = null;
    let position = null;
    let rotation = 0;
    let wallId = null;
    let roomId = null;

    if (wall && roomEdge) {
      // Both found, choose the closer one
      const wallDist = pointToLineDistance(x, y, wall.points[0], wall.points[1]);
      const roomDist = pointToLineDistance(x, y, roomEdge.edge.start, roomEdge.edge.end);

      if (wallDist <= roomDist) {
        targetWall = wall;
        wallId = wall.id;
      } else {
        targetWall = { points: [roomEdge.edge.start, roomEdge.edge.end] };
        roomId = roomEdge.element.id;
      }
    } else if (wall) {
      targetWall = wall;
      wallId = wall.id;
    } else if (roomEdge) {
      targetWall = { points: [roomEdge.edge.start, roomEdge.edge.end] };
      roomId = roomEdge.element.id;
    } else {
      return; // No wall or room edge found
    }

    position = calculateWallPosition(x, y, targetWall);
    rotation = calculateWallAngle(targetWall);

    const newDoor = {
      id: crypto.randomUUID(),
      type: 'door',
      position: { x: position.x, y: position.y },
      wallId,
      roomId,
      width: 80,
      openingSide: 'left',
      rotation
    };

    setElements(prev => [...prev, newDoor]);
  }, [findWallAtPosition, findRoomEdgeAtPosition, calculateWallPosition, calculateWallAngle, pointToLineDistance]);

  const addWindowToWall = useCallback((x, y) => {
    const wall = findWallAtPosition(x, y, 15);
    const roomEdge = findRoomEdgeAtPosition(x, y, 15);

    let targetWall = null;
    let position = null;
    let rotation = 0;
    let wallId = null;
    let roomId = null;

    if (wall && roomEdge) {
      // Both found, choose the closer one
      const wallDist = pointToLineDistance(x, y, wall.points[0], wall.points[1]);
      const roomDist = pointToLineDistance(x, y, roomEdge.edge.start, roomEdge.edge.end);

      if (wallDist <= roomDist) {
        targetWall = wall;
        wallId = wall.id;
      } else {
        targetWall = { points: [roomEdge.edge.start, roomEdge.edge.end] };
        roomId = roomEdge.element.id;
      }
    } else if (wall) {
      targetWall = wall;
      wallId = wall.id;
    } else if (roomEdge) {
      targetWall = { points: [roomEdge.edge.start, roomEdge.edge.end] };
      roomId = roomEdge.element.id;
    } else {
      return; // No wall or room edge found
    }

    position = calculateWallPosition(x, y, targetWall);
    rotation = calculateWallAngle(targetWall);

    const newWindow = {
      id: crypto.randomUUID(),
      type: 'window',
      position: { x: position.x, y: position.y },
      wallId,
      roomId,
      width: 120,
      rotation
    };

    setElements(prev => [...prev, newWindow]);
  }, [findWallAtPosition, findRoomEdgeAtPosition, calculateWallPosition, calculateWallAngle, pointToLineDistance]);

  const addDoubleDoorToWall = useCallback((x, y) => {
    const wall = findWallAtPosition(x, y, 15);
    const roomEdge = findRoomEdgeAtPosition(x, y, 15);

    let targetWall = null;
    let position = null;
    let rotation = 0;
    let wallId = null;
    let roomId = null;

    if (wall && roomEdge) {
      // Both found, choose the closer one
      const wallDist = pointToLineDistance(x, y, wall.points[0], wall.points[1]);
      const roomDist = pointToLineDistance(x, y, roomEdge.edge.start, roomEdge.edge.end);

      if (wallDist <= roomDist) {
        targetWall = wall;
        wallId = wall.id;
      } else {
        targetWall = { points: [roomEdge.edge.start, roomEdge.edge.end] };
        roomId = roomEdge.element.id;
      }
    } else if (wall) {
      targetWall = wall;
      wallId = wall.id;
    } else if (roomEdge) {
      targetWall = { points: [roomEdge.edge.start, roomEdge.edge.end] };
      roomId = roomEdge.element.id;
    } else {
      return; // No wall or room edge found
    }

    position = calculateWallPosition(x, y, targetWall);
    rotation = calculateWallAngle(targetWall);

    const newDoubleDoor = {
      id: crypto.randomUUID(),
      type: 'doubleDoor',
      position: { x: position.x, y: position.y },
      wallId,
      roomId,
      width: 120,
      openingDirection: 'outward',
      rotation
    };

    setElements(prev => [...prev, newDoubleDoor]);
  }, [findWallAtPosition, findRoomEdgeAtPosition, calculateWallPosition, calculateWallAngle, pointToLineDistance]);

  const addRadiatorToWall = useCallback((x, y) => {
    const wall = findWallAtPosition(x, y, 15);
    const roomEdge = findRoomEdgeAtPosition(x, y, 15);

    let targetWall = null;
    let position = null;
    let rotation = 0;
    let wallId = null;
    let roomId = null;

    if (wall && roomEdge) {
      // Both found, choose the closer one
      const wallDist = pointToLineDistance(x, y, wall.points[0], wall.points[1]);
      const roomDist = pointToLineDistance(x, y, roomEdge.edge.start, roomEdge.edge.end);

      if (wallDist <= roomDist) {
        targetWall = wall;
        wallId = wall.id;
      } else {
        targetWall = { points: [roomEdge.edge.start, roomEdge.edge.end] };
        roomId = roomEdge.element.id;
      }
    } else if (wall) {
      targetWall = wall;
      wallId = wall.id;
    } else if (roomEdge) {
      targetWall = { points: [roomEdge.edge.start, roomEdge.edge.end] };
      roomId = roomEdge.element.id;
    } else {
      return; // No wall or room edge found
    }

    position = calculateWallPosition(x, y, targetWall);
    rotation = calculateWallAngle(targetWall);

    const newRadiator = {
      id: crypto.randomUUID(),
      type: 'radiator',
      position: { x: position.x, y: position.y },
      wallId,
      roomId,
      width: 80,
      height: 15,
      rotation
    };

    setElements(prev => [...prev, newRadiator]);
  }, [findWallAtPosition, findRoomEdgeAtPosition, calculateWallPosition, calculateWallAngle, pointToLineDistance]);

  // Room rectangle drawing
  const startDrawingRoom = useCallback((point) => {
    const snapped = snapToGrid(point.x, point.y);
    setCurrentDrawing({
      type: 'room',
      startPoint: snapped
    });
  }, [snapToGrid]);

  const updateDrawingRoom = useCallback((point) => {
    if (!currentDrawing || currentDrawing.type !== 'room') return;
    const snapped = snapToGrid(point.x, point.y);
    setCurrentDrawing(prev => ({
      ...prev,
      currentPoint: snapped
    }));
  }, [currentDrawing, snapToGrid]);

  const finishDrawingRoom = useCallback((point, label = '') => {
    if (!currentDrawing || currentDrawing.type !== 'room') return;
    const snapped = snapToGrid(point.x, point.y);

    const x1 = Math.min(currentDrawing.startPoint.x, snapped.x);
    const y1 = Math.min(currentDrawing.startPoint.y, snapped.y);
    const x2 = Math.max(currentDrawing.startPoint.x, snapped.x);
    const y2 = Math.max(currentDrawing.startPoint.y, snapped.y);

    const width = x2 - x1;
    const height = y2 - y1;

    // Don't create room if too small
    if (width < 20 || height < 20) {
      setCurrentDrawing(null);
      return;
    }

    const newRoom = {
      id: crypto.randomUUID(),
      type: 'room',
      points: [
        { x: x1, y: y1 },
        { x: x2, y: y1 },
        { x: x2, y: y2 },
        { x: x1, y: y2 }
      ],
      label: label || '',
      dimensions: { width, height },
      fill: '#f5f5f5'
    };

    setElements(prev => [...prev, newRoom]);
    setCurrentDrawing(null);
    return newRoom;
  }, [currentDrawing, snapToGrid]);

  // Element manipulation
  const deleteElement = useCallback((elementId) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  const moveElement = useCallback((elementId, deltaX, deltaY) => {
    setElements(prev => prev.map(el => {
      if (el.id !== elementId) return el;

      if (el.type === 'wall') {
        return {
          ...el,
          points: el.points.map(p => ({ x: p.x + deltaX, y: p.y + deltaY }))
        };
      } else if (el.type === 'room') {
        return {
          ...el,
          points: el.points.map(p => ({ x: p.x + deltaX, y: p.y + deltaY }))
        };
      } else if (el.type === 'door' || el.type === 'doubleDoor' || el.type === 'window' || el.type === 'radiator') {
        return {
          ...el,
          position: { x: el.position.x + deltaX, y: el.position.y + deltaY }
        };
      } else {
        return {
          ...el,
          position: { x: el.position.x + deltaX, y: el.position.y + deltaY }
        };
      }
    }));
  }, []);

  const updateElementProperties = useCallback((elementId, properties) => {
    setElements(prev => prev.map(el =>
      el.id === elementId ? { ...el, ...properties } : el
    ));
  }, []);

  // Reset/Load
  const loadElements = useCallback((newElements) => {
    setElements(newElements);
    setSelectedElement(null);
    setCurrentDrawing(null);
  }, []);

  const clearAll = useCallback(() => {
    setElements([]);
    setSelectedElement(null);
    setCurrentDrawing(null);
  }, []);

  return {
    // State
    activeTool,
    elements,
    selectedElement,
    currentDrawing,
    gridSize,
    gridEnabled,

    // Setters
    setActiveTool,
    setSelectedElement,
    setGridSize,
    setGridEnabled,

    // Wall operations
    startDrawingWall,
    updateDrawingWall,
    finishDrawingWall,

    // Door/Window operations
    addDoorToWall,
    addDoubleDoorToWall,
    addWindowToWall,
    addRadiatorToWall,

    // Room operations
    startDrawingRoom,
    updateDrawingRoom,
    finishDrawingRoom,

    // Element manipulation
    deleteElement,
    moveElement,
    updateElementProperties,

    // Utilities
    findWallAtPosition,
    findRoomEdgeAtPosition,
    snapToGrid,
    loadElements,
    clearAll
  };
}
