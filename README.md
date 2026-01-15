# Doorway - Application de Placement de Meubles

Application web pour visualiser l'agencement de meubles sur un plan d'appartement. Glissez-déposez des meubles sur votre plan pour créer votre aménagement idéal.

## Fonctionnalités

- **Upload de plan** : Importez votre plan d'appartement (JPG, PNG)
- **Bibliothèque de meubles** : Sélectionnez parmi une collection de meubles pré-définis
- **Drag & Drop** : Placez intuitivement les meubles sur le plan
- **Manipulation** : Déplacez, faites pivoter et supprimez les meubles placés
- **Interface simple** : Application client-side, rapide et légère

## Technologies

- **Next.js 15** (App Router)
- **React 18**
- **HTML5 Drag & Drop API**
- **CSS Modules**
- Déploiement statique sur **Vercel**

## Démarrage Rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Utilisation

1. **Charger un plan** : Cliquez ou glissez-déposez une image de votre plan d'appartement
2. **Sélectionner des meubles** : Parcourez la bibliothèque dans le panneau de gauche
3. **Placer des meubles** : Glissez-déposez les meubles sur le plan
4. **Ajuster** : Déplacez, faites pivoter (bouton ↻) ou supprimez (bouton ×) les meubles

## Ajouter des Meubles

Pour ajouter vos propres meubles à la bibliothèque :

1. Ajoutez une image SVG dans `public/furniture/`
2. Modifiez `src/config/furniture.js` pour ajouter le meuble :

```javascript
{
  id: 'mon-meuble',
  name: 'Mon Meuble',
  imagePath: '/furniture/mon-meuble.svg',
  defaultWidth: 100,
  defaultHeight: 80,
  aspectRatio: 1.25,
  tags: ['categorie']
}
```

## Build et Déploiement

```bash
# Build pour production
npm run build

# Les fichiers statiques seront dans le dossier 'out/'
```

L'application est configurée pour le déploiement statique sur Vercel. Connectez simplement votre dépôt GitHub à Vercel pour un déploiement automatique.

## Structure du Projet

```
src/
├── app/              # Pages Next.js
├── components/       # Composants React
├── config/           # Configuration (bibliothèque de meubles)
├── hooks/            # Hooks React personnalisés
└── utils/            # Utilitaires

public/
└── furniture/        # Images de meubles (SVG)
```

## Licence

MIT
