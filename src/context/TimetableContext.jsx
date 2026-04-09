import { createContext, useContext, useState, useCallback } from 'react';

const TimetableContext = createContext(null);

const DEFAULT_CONDITIONS = {
  preferredFreeDays: [],
  avoidMorningClasses: false,
  avoidUphill: false,
  preferOnline: false,
  minCredits: 15,
  maxCredits: 21,
  additionalNotes: '',
};

export function TimetableProvider({ children }) {
  const [conditions, setConditions] = useState(DEFAULT_CONDITIONS);
  const [cart, setCart] = useState([]);
  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addToCart = useCallback((course, priority = 'medium') => {
    setCart(prev => {
      if (prev.some(item => item.courseId === course.id)) return prev;
      return [...prev, { courseId: course.id, course, priority }];
    });
  }, []);

  const removeFromCart = useCallback((courseId) => {
    setCart(prev => prev.filter(item => item.courseId !== courseId));
  }, []);

  return (
    <TimetableContext.Provider value={{
      conditions, setConditions,
      cart, setCart, addToCart, removeFromCart,
      plans, setPlans,
      activePlanId, setActivePlanId,
      isGenerating, setIsGenerating,
    }}>
      {children}
    </TimetableContext.Provider>
  );
}

export function useTimetable() {
  const ctx = useContext(TimetableContext);
  if (!ctx) throw new Error('useTimetable must be used within TimetableProvider');
  return ctx;
}
