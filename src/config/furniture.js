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
        },
        {
          id: 'sofa-1',
          name: 'Canapé 3 Places',
          imagePath: '/furniture/sofa.svg',
          defaultWidth: 180,
          defaultHeight: 80,
          aspectRatio: 2.25,
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
          aspectRatio: 1.5,
          tags: ['table', 'dining']
        },
        {
          id: 'coffee-table',
          name: 'Table Basse',
          imagePath: '/furniture/coffee-table.svg',
          defaultWidth: 120,
          defaultHeight: 70,
          aspectRatio: 1.71,
          tags: ['table', 'living-room', 'coffee']
        },
        {
          id: 'desk-1',
          name: 'Bureau',
          imagePath: '/furniture/desk.svg',
          defaultWidth: 140,
          defaultHeight: 70,
          aspectRatio: 2,
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
          aspectRatio: 0.75,
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
          aspectRatio: 2.5,
          tags: ['storage', 'shelf']
        },
        {
          id: 'kallax-1x3',
          name: 'Kallax 1×3 (Meuble TV)',
          imagePath: '/furniture/kallax.svg',
          defaultWidth: 150,
          defaultHeight: 50,
          aspectRatio: 3,
          tags: ['storage', 'shelf', 'ikea', 'tv']
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
