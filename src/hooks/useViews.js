import { useState, useEffect } from 'react';

const STORAGE_KEY = 'doorway_views';

export function useViews() {
  const [views, setViews] = useState([]);
  const [currentViewId, setCurrentViewId] = useState(null);

  // Load views from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setViews(parsed);
      }
    } catch (error) {
      console.error('Error loading views:', error);
    }
  }, []);

  // Save views to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
    } catch (error) {
      console.error('Error saving views:', error);
    }
  }, [views]);

  const saveView = (name, floorPlanImage, placedFurniture) => {
    const newView = {
      id: currentViewId || crypto.randomUUID(),
      name: name || `Vue ${views.length + 1}`,
      floorPlanImage,
      placedFurniture,
      createdAt: currentViewId
        ? views.find(v => v.id === currentViewId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (currentViewId) {
      // Update existing view
      setViews(prev => prev.map(v => v.id === currentViewId ? newView : v));
    } else {
      // Create new view
      setViews(prev => [...prev, newView]);
    }

    setCurrentViewId(newView.id);
    return newView;
  };

  const loadView = (viewId) => {
    const view = views.find(v => v.id === viewId);
    if (view) {
      setCurrentViewId(viewId);
      return view;
    }
    return null;
  };

  const deleteView = (viewId) => {
    setViews(prev => prev.filter(v => v.id !== viewId));
    if (currentViewId === viewId) {
      setCurrentViewId(null);
    }
  };

  const createNewView = () => {
    setCurrentViewId(null);
  };

  const duplicateView = (viewId) => {
    const viewToDuplicate = views.find(v => v.id === viewId);
    if (!viewToDuplicate) return null;

    const newView = {
      id: crypto.randomUUID(),
      name: `${viewToDuplicate.name} (copie)`,
      floorPlanImage: viewToDuplicate.floorPlanImage,
      placedFurniture: viewToDuplicate.placedFurniture?.map(f => ({
        ...f,
        instanceId: crypto.randomUUID()
      })) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setViews(prev => [...prev, newView]);
    setCurrentViewId(newView.id);
    return newView;
  };

  const getCurrentView = () => {
    if (!currentViewId) return null;
    return views.find(v => v.id === currentViewId);
  };

  return {
    views,
    currentViewId,
    saveView,
    loadView,
    deleteView,
    duplicateView,
    createNewView,
    getCurrentView
  };
}
