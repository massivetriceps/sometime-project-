import { createContext, useContext, useState } from 'react';

const TimetableContext = createContext(null);

export function TimetableProvider({ children }) {
  const [conditions, setConditions] = useState({
    preferredFreeDays: [],
    avoidMorningClasses: false,
    avoidUphill: false,
    preferOnline: false,
    creditRange: '',
    additionalNotes: '',
  });
  const [cart, setCart] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [confirmedPlans, setConfirmedPlans] = useState([]);

  const addToCart = (course, priority = 'medium') => {
    setCart(prev => {
      if (prev.some(item => item.courseId === course.id)) return prev;
      return [...prev, { courseId: course.id, course, priority }];
    });
  };

  const removeFromCart = (courseId) => {
    setCart(prev => prev.filter(item => item.courseId !== courseId));
  };

  const updatePriority = (courseId, priority) => {
    setCart(prev => prev.map(item => item.courseId === courseId ? { ...item, priority } : item));
  };

  const confirmPlan = (plan) => {
    const newPlan = {
      ...plan,
      id: Date.now(),
      name: `2025-1학기 시간표`,
      date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', ''),
    };
    setConfirmedPlans(prev => [...prev, newPlan]);
  };

  const updateConfirmedPlan = (id, updatedCourses) => {
    setConfirmedPlans(prev => prev.map(p => p.id === id ? { ...p, courses: updatedCourses } : p));
  };

  const deleteConfirmedPlan = (id) => {
    setConfirmedPlans(prev => prev.filter(p => p.id !== id));
  };

  return (
    <TimetableContext.Provider value={{
      conditions, setConditions,
      cart, addToCart, removeFromCart, updatePriority,
      isGenerating, setIsGenerating,
      confirmedPlans, confirmPlan, updateConfirmedPlan, deleteConfirmedPlan,
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