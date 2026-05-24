import { create } from 'zustand'

const useAuthStore = create((set) => ({
  // user는 메모리에만 유지 (localStorage에 개인정보 평문 저장 방지)
  // 페이지 새로고침 시 Layout에서 /api/users/me 호출로 재수화됨
  user: null,
  // sessionStorage 우선: rememberMe=false 세션이 있으면 localStorage 이전 토큰보다 앞서 사용
  accessToken: sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || null,
  isLoggedIn: !!(sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken')),

  // rememberMe=true  → localStorage (브라우저 재시작 후에도 유지)
  // rememberMe=false → sessionStorage (탭/브라우저 닫으면 만료)
  // 로그인 시 반대 스토리지를 명시적으로 제거해 이전 세션 토큰 잔류 방지
  login: (userData, token, rememberMe = true) => {
    if (rememberMe) {
      sessionStorage.removeItem('accessToken');
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
      sessionStorage.setItem('accessToken', token);
    }
    set({ user: userData, accessToken: token, isLoggedIn: true });
  },

  updateUser: (userData) => {
    set({ user: userData });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    set({ user: null, accessToken: null, isLoggedIn: false });
  },
}))

export default useAuthStore
