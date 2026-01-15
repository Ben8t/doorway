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
          realWidth: 45,  // cm
          realHeight: 45, // cm
          aspectRatio: 1,
          dynamic: false,
          tags: ['chair', 'dining']
        },
        {
          id: 'sofa-1',
          name: 'Canapé',
          imagePath: '/furniture/sofa.svg',
          defaultWidth: 180,
          defaultHeight: 80,
          realWidth: 180,  // cm
          realHeight: 80,  // cm
          minWidth: 120,   // cm
          maxWidth: 300,   // cm
          minHeight: 70,   // cm
          maxHeight: 100,  // cm
          aspectRatio: 2.25,
          dynamic: true,
          component: 'DynamicSofa',
          tags: ['sofa', 'living-room']
        }
      ]
    },
    {
      id: 'tables',
      name: 'Tables',
      items: [
        {
          id: 'table-dining',
          name: 'Table à Manger',
          imagePath: '/furniture/table.svg',
          defaultWidth: 120,
          defaultHeight: 80,
          realWidth: 120,  // cm
          realHeight: 80,  // cm
          minWidth: 80,    // cm
          maxWidth: 250,   // cm
          minHeight: 70,   // cm
          maxHeight: 120,  // cm
          aspectRatio: 1.5,
          dynamic: true,
          component: 'DynamicTable',
          tags: ['table', 'dining']
        },
        {
          id: 'coffee-table',
          name: 'Table Basse',
          imagePath: '/furniture/coffee-table.svg',
          defaultWidth: 120,
          defaultHeight: 70,
          realWidth: 120,  // cm
          realHeight: 70,  // cm
          aspectRatio: 1.71,
          dynamic: false,
          tags: ['table', 'living-room', 'coffee']
        },
        {
          id: 'desk-1',
          name: 'Bureau',
          imagePath: '/furniture/desk.svg',
          defaultWidth: 140,
          defaultHeight: 70,
          realWidth: 140,  // cm
          realHeight: 70,  // cm
          minWidth: 100,   // cm
          maxWidth: 200,   // cm
          minHeight: 60,   // cm
          maxHeight: 80,   // cm
          aspectRatio: 2,
          dynamic: true,
          component: 'DynamicDesk',
          tags: ['desk', 'office']
        }
      ]
    },
    {
      id: 'beds',
      name: 'Lits',
      items: [
        {
          id: 'bed-queen',
          name: 'Lit Double',
          imagePath: '/furniture/bed.svg',
          defaultWidth: 150,
          defaultHeight: 200,
          realWidth: 160,   // cm
          realHeight: 200,  // cm
          aspectRatio: 0.75,
          dynamic: false,
          tags: ['bed', 'bedroom']
        }
      ]
    },
    {
      id: 'storage',
      name: 'Rangement',
      items: [
        {
          id: 'bookshelf-1',
          name: 'Bibliothèque',
          imagePath: '/furniture/bookshelf.svg',
          defaultWidth: 100,
          defaultHeight: 40,
          realWidth: 100,  // cm
          realHeight: 40,  // cm
          aspectRatio: 2.5,
          dynamic: false,
          tags: ['storage', 'shelf']
        },
        {
          id: 'kallax-1x3',
          name: 'Kallax (Meuble TV)',
          imagePath: '/furniture/kallax.svg',
          defaultWidth: 150,
          defaultHeight: 50,
          realWidth: 150,  // cm
          realHeight: 40,  // cm
          minWidth: 100,   // cm
          maxWidth: 300,   // cm
          minHeight: 40,   // cm
          maxHeight: 80,   // cm
          aspectRatio: 3,
          dynamic: true,
          component: 'DynamicKallax',
          tags: ['storage', 'shelf', 'ikea', 'tv']
        }
      ]
    },
    {
      id: 'decor',
      name: 'Décoration',
      items: [
        {
          id: 'fireplace-1',
          name: 'Cheminée',
          imagePath: '/furniture/fireplace.svg',
          defaultWidth: 100,
          defaultHeight: 60,
          realWidth: 100,  // cm
          realHeight: 60,  // cm
          aspectRatio: 1.67,
          dynamic: false,
          tags: ['fireplace', 'decor']
        }
      ]
    }
  ]
};

// Helper function to get all furniture items
export function getAllFurniture() {
  return furnitureLibrary.categories.flatMap(cat =>
    cat.items.map(item => ({ ...item, category: cat.id }))
  );
}

// Helper function to get furniture by ID
export function getFurnitureById(id) {
  return getAllFurniture().find(item => item.id === id);
}
