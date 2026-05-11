import { create } from 'zustand'

const useTimetableStore = create((set) => ({
  conditions: {
    preferredFreeDays: [],
    avoidMorningClasses: false,
    avoidUphill: false,
    preferOnline: false,
    creditRange: '',
    additionalNotes: '',
  },
  cart: [],
  cartLoaded: false,
  isGenerating: false,
  confirmedPlans: [],
  timetables: [],
  selectedTimetable: null,
  aiComment: '',

  // DB에서 불러온 카트 데이터로 store 초기화
  setCartFromDB: (dbItems) => set({
    cart: dbItems.map(c => ({ courseId: c.course_id, course: c, priority: 'medium' })),
    cartLoaded: true,
  }),
  clearCart: () => set({ cart: [], cartLoaded: false }),

  setConditions: (conditions) => set({ conditions }),
  setIsGenerating: (bool) => set({ isGenerating: bool }),

  addToCart: (course, priority = 'medium') => set((state) => {
    if (state.cart.some(item => item.courseId === course.id)) return state;
    return { cart: [...state.cart, { courseId: course.id, course, priority }] };
  }),
  removeFromCart: (courseId) => set((state) => ({
    cart: state.cart.filter(item => item.courseId !== courseId)
  })),
  updatePriority: (courseId, priority) => set((state) => ({
    cart: state.cart.map(item => item.courseId === courseId ? { ...item, priority } : item)
  })),

  confirmPlan: (plan) => set((state) => ({
    confirmedPlans: [...state.confirmedPlans, {
      ...plan,
      id: Date.now(),
      name: '2025-1학기 시간표',
      date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', ''),
    }]
  })),
  updateConfirmedPlan: (id, updatedCourses) => set((state) => ({
    confirmedPlans: state.confirmedPlans.map(p => p.id === id ? { ...p, courses: updatedCourses } : p)
  })),
  deleteConfirmedPlan: (id) => set((state) => ({
    confirmedPlans: state.confirmedPlans.filter(p => p.id !== id)
  })),

  setTimetables: (data) => set({ timetables: data }),
  selectTimetable: (timetable) => set({ selectedTimetable: timetable }),
  setAiComment: (comment) => set({ aiComment: comment }),
  reset: () => set({ timetables: [], selectedTimetable: null, aiComment: '' }),
}))

export default useTimetableStore