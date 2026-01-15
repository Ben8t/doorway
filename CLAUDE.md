# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Doorway is a Next.js application for furniture placement on floor plans. Users can upload apartment floor plans and drag furniture from a library onto the plan to visualize furniture arrangements.

**Technology Stack:**
- Next.js 15.x (App Router)
- React 18+
- HTML5 Drag & Drop API
- CSS Modules
- Static site (no backend)

**Key Features:**
- Upload floor plan images
- Drag & drop furniture from library onto plan
- Move, rotate, and delete placed furniture
- Fully client-side, deployed as static site on Vercel

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production (static export to out/)
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.js     # Root layout
│   ├── page.js       # Main application page
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── FloorPlanCanvas.js    # Canvas with floor plan and furniture
│   ├── FurniturePanel.js     # Left sidebar with furniture library
│   ├── FurnitureItem.js      # Individual furniture item (draggable)
│   ├── PlacedFurniture.js    # Placed furniture on canvas
│   ├── ImageUploader.js      # Floor plan image uploader
│   └── Toolbar.js            # Top toolbar with actions
├── config/           # Configuration files
│   └── furniture.js  # Furniture library configuration
├── hooks/            # Custom React hooks
│   └── useDragAndDrop.js  # Drag & drop logic
└── utils/            # Utility functions

public/
└── furniture/        # Furniture images (SVG files)
```

## Architecture

### Component Hierarchy

```
page.js (Main Container)
├── Toolbar (Top bar with actions)
├── FurniturePanel (Left sidebar)
│   └── FurnitureItem[] (Draggable furniture from library)
└── FloorPlanCanvas (Main canvas)
    ├── ImageUploader (Shown when no floor plan)
    ├── Background Image (Floor plan)
    └── PlacedFurniture[] (Furniture instances on canvas)
```

### State Management

- **React useState** for all state (no external state library)
- **Main state in page.js:**
  - `floorPlanImage`: Data URL of uploaded floor plan
  - `placedFurniture`: Array of placed furniture instances
  - `selectedFurniture`: ID of currently selected furniture

### Placed Furniture Data Structure

Each placed furniture item has:
```javascript
{
  instanceId: 'uuid',      // Unique instance ID
  furnitureId: 'chair-1',  // Reference to furniture config
  name: 'Chaise',          // Display name
  imagePath: '/furniture/chair.svg',
  x: 100,                  // X position on canvas
  y: 150,                  // Y position on canvas
  width: 60,               // Width in pixels
  height: 60,              // Height in pixels
  rotation: 0,             // Rotation in degrees (0, 90, 180, 270)
  zIndex: timestamp        // For layering (higher = on top)
}
```

## Configuration

### Furniture Library

Furniture library is defined in `src/config/furniture.js` with this structure:

```javascript
export const furnitureLibrary = {
  categories: [
    {
      id: 'seating',
      name: 'Assises',
      items: [
        {
          id: 'chair-1',
          name: 'Chaise',
          imagePath: '/furniture/chair.svg',
          defaultWidth: 60,
          defaultHeight: 60,
          aspectRatio: 1,
          tags: ['chair', 'dining']
        }
      ]
    }
  ]
};
```

### Adding New Furniture

1. Add furniture image to `public/furniture/` (preferably SVG)
2. Add entry to appropriate category in `src/config/furniture.js`:
```javascript
{
  id: 'unique-id',
  name: 'Furniture Name',
  imagePath: '/furniture/image.svg',
  defaultWidth: 100,
  defaultHeight: 80,
  aspectRatio: 1.25,
  tags: ['category', 'type']
}
```

## Key Design Patterns

### Drag & Drop Implementation

**Native HTML5 Drag & Drop API** is used for all drag operations:

1. **From Library to Canvas:**
   - `FurnitureItem`: `draggable="true"`, stores furniture data in `handleDragStart`
   - `FloorPlanCanvas`: receives drop, calculates coordinates via `getBoundingClientRect()`
   - Creates new instance with unique ID and position

2. **Moving Placed Furniture:**
   - `PlacedFurniture`: Uses mouse events (mousedown, mousemove, mouseup)
   - Calculates new position relative to canvas
   - Updates state to trigger re-render

### CSS Modules

- Each component has its own CSS Module file (`.module.css`)
- Scoped styles prevent naming conflicts
- Global styles in `app/globals.css` for layout and CSS variables

### Static Export

Configured in `next.config.mjs`:
```javascript
{
  output: 'export',
  images: { unoptimized: true }
}
```

**Important:** Do not use:
- `next/image` component (use regular `<img>` tags)
- Server-side features (API routes, server components with data fetching)
- Dynamic routes with getStaticPaths

## Deployment

Deployed on Vercel as static site:

1. Push to GitHub repository
2. Connect repository to Vercel
3. Vercel auto-detects Next.js configuration
4. Build command: `npm run build`
5. Output directory: `out/`
6. Site deployed automatically on push to main

Build output is a static site with all HTML/CSS/JS files in the `out/` directory.

## Common Tasks

### Updating Floor Plan Display

Floor plan image is stored as a Data URL in state. The canvas displays it as a background image with `pointer-events: none` so furniture can be placed on top.

### Coordinate Calculation

When dropping furniture, coordinates are calculated relative to canvas:
```javascript
const rect = canvasRef.current.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;
```

### Furniture Selection

Clicking on placed furniture sets its `instanceId` as `selectedFurniture`. Selected furniture shows:
- Outline (blue border)
- Delete button (×)
- Rotate button (↻)
