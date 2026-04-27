import { create } from 'zustand'

const useCartStore = create((set) => ({
  cartItems: [],   // [{ course_id, course_name, ... }]

  setCart: (items) => set({ cartItems: items }),
  addItem: (course) => set((state) => ({
    cartItems: [...state.cartItems, course]
  })),
  removeItem: (courseId) => set((state) => ({
    cartItems: state.cartItems.filter((c) => c.course_id !== courseId)
  })),
}))

export default useCartStore