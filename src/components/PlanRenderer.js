import React from 'react';
import WallElement from './plan-elements/WallElement';
import DoorElement from './plan-elements/DoorElement';
import DoubleDoorElement from './plan-elements/DoubleDoorElement';
import WindowElement from './plan-elements/WindowElement';
import RadiatorElement from './plan-elements/RadiatorElement';
import RoomElement from './plan-elements/RoomElement';
import styles from './PlanRenderer.module.css';

export default function PlanRenderer({
  elements = [],
  canvasSize = { width: 800, height: 600 },
  interactive = false,
  selectedElement = null,
  onElementClick,
  onElementMouseDown,
  showGrid = false,
  gridSize = 10
}) {
  const renderGrid = () => {
    if (!showGrid) return null;

    const lines = [];
    const { width, height } = canvasSize;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#e0e0e0"
          strokeWidth={x % (gridSize * 5) === 0 ? 0.5 : 0.25}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#e0e0e0"
          strokeWidth={y % (gridSize * 5) === 0 ? 0.5 : 0.25}
        />
      );
    }

    return <g className={styles.grid}>{lines}</g>;
  };

  const renderElement = (element) => {
    const isSelected = selectedElement === element.id;

    const handleMouseDown = (e) => {
      if (interactive && onElementMouseDown) {
        e.stopPropagation();
        onElementMouseDown(element.id, e);
      }
    };

    switch (element.type) {
      case 'wall':
        return (
          <WallElement
            key={element.id}
            {...element}
            interactive={interactive}
            isSelected={isSelected}
            onClick={onElementClick}
            onMouseDown={handleMouseDown}
          />
        );

      case 'door':
        return (
          <DoorElement
            key={element.id}
            {...element}
            interactive={interactive}
            isSelected={isSelected}
            onClick={onElementClick}
            onMouseDown={handleMouseDown}
          />
        );

      case 'doubleDoor':
        return (
          <DoubleDoorElement
            key={element.id}
            {...element}
            interactive={interactive}
            isSelected={isSelected}
            onClick={onElementClick}
            onMouseDown={handleMouseDown}
          />
        );

      case 'window':
        return (
          <WindowElement
            key={element.id}
            {...element}
            interactive={interactive}
            isSelected={isSelected}
            onClick={onElementClick}
            onMouseDown={handleMouseDown}
          />
        );

      case 'radiator':
        return (
          <RadiatorElement
            key={element.id}
            {...element}
            interactive={interactive}
            isSelected={isSelected}
            onClick={onElementClick}
            onMouseDown={handleMouseDown}
          />
        );

      case 'room':
        return (
          <RoomElement
            key={element.id}
            {...element}
            interactive={interactive}
            isSelected={isSelected}
            onClick={onElementClick}
            onMouseDown={handleMouseDown}
          />
        );

      default:
        return null;
    }
  };

  // Render elements in order: rooms first (background), then walls, then doors/windows/radiators
  const rooms = elements.filter(el => el.type === 'room');
  const walls = elements.filter(el => el.type === 'wall');
  const doorsAndWindows = elements.filter(el =>
    el.type === 'door' || el.type === 'doubleDoor' || el.type === 'window' || el.type === 'radiator'
  );

  return (
    <svg
      className={styles.planSvg}
      width="100%"
      height="100%"
      viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {renderGrid()}
      {rooms.map(renderElement)}
      {walls.map(renderElement)}
      {doorsAndWindows.map(renderElement)}
    </svg>
  );
}
