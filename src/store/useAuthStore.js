import { create } from 'zustand';

// create 함수로 스토어를 만듭니다. (set 함수를 통해 상태를 변경할 수 있어요)
const useAuthStore = create((set) => ({
  // 1. 상태 (State): 전역으로 관리할 데이터
  user: null,          // 유저 정보 (이름, 이메일 등)
  isLoggedIn: false,   // 로그인 여부

  // 2. 액션 (Actions): 상태를 변경하는 함수들
  login: (userData) => set({ user: userData, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
}));

export default useAuthStore;