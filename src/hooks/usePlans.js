import { useState, useEffect } from 'react';

const STORAGE_KEY = 'doorway_plans';

export function usePlans() {
  const [plans, setPlans] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState(null);

  // Load plans from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPlans(parsed);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  }, []);

  // Save plans to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } catch (error) {
      console.error('Error saving plans:', error);
    }
  }, [plans]);

  const savePlan = (name, elements, canvasSize = { width: 800, height: 600 }) => {
    const newPlan = {
      id: currentPlanId || crypto.randomUUID(),
      name: name || `Plan ${plans.length + 1}`,
      type: 'created',
      elements,
      canvasSize,
      gridSize: 10,
      createdAt: currentPlanId
        ? plans.find(p => p.id === currentPlanId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (currentPlanId) {
      // Update existing plan
      setPlans(prev => prev.map(p => p.id === currentPlanId ? newPlan : p));
    } else {
      // Create new plan
      setPlans(prev => [...prev, newPlan]);
    }

    setCurrentPlanId(newPlan.id);
    return newPlan;
  };

  const loadPlan = (planId) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setCurrentPlanId(planId);
      return plan;
    }
    return null;
  };

  const deletePlan = (planId) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
    if (currentPlanId === planId) {
      setCurrentPlanId(null);
    }
  };

  const createNewPlan = () => {
    setCurrentPlanId(null);
  };

  const duplicatePlan = (planId) => {
    const planToDuplicate = plans.find(p => p.id === planId);
    if (!planToDuplicate) return null;

    const newPlan = {
      id: crypto.randomUUID(),
      name: `${planToDuplicate.name} (copie)`,
      type: 'created',
      elements: planToDuplicate.elements.map(el => ({
        ...el,
        id: crypto.randomUUID()
      })),
      canvasSize: planToDuplicate.canvasSize,
      gridSize: planToDuplicate.gridSize,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPlans(prev => [...prev, newPlan]);
    setCurrentPlanId(newPlan.id);
    return newPlan;
  };

  const getCurrentPlan = () => {
    if (!currentPlanId) return null;
    return plans.find(p => p.id === currentPlanId);
  };

  return {
    plans,
    currentPlanId,
    savePlan,
    loadPlan,
    deletePlan,
    duplicatePlan,
    createNewPlan,
    getCurrentPlan
  };
}
