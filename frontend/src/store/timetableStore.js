import { create } from 'zustand'

const useTimetableStore = create((set) => ({
  cart: [],
  cartLoaded: false,

  // DB에서 불러온 카트 데이터로 store 초기화
  setCartFromDB: (dbItems) => set({
    cart: dbItems.map(c => ({ courseId: c.course_id, course: c, priority: 'medium' })),
    cartLoaded: true,
  }),

  addToCart: (course, priority = 'medium') => set((state) => {
    if (state.cart.some(item => item.courseId === course.id)) return state;
    return { cart: [...state.cart, { courseId: course.id, course, priority }] };
  }),
  removeFromCart: (courseId) => set((state) => ({
    cart: state.cart.filter(item => item.courseId !== courseId)
  })),

  // 로그아웃 시 장바구니 상태 완전 초기화 (cartLoaded 포함)
  resetCart: () => set({ cart: [], cartLoaded: false }),
}))

export default useTimetableStore
