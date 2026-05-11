import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  isLoggedIn: !!localStorage.getItem('accessToken'),

  login: (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', token);
    set({ user: userData, accessToken: token, isLoggedIn: true });
  },

  updateUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null, isLoggedIn: false });
  },
}))

export default useAuthStore