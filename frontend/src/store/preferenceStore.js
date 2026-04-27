import { create } from 'zustand'

const usePreferenceStore = create((set) => ({
  freeDayMask: 0,       // 공강요일 비트마스크 (월=1,화=2,수=4,목=8,금=16)
  avoidUphill: false,   // 오르막 회피
  allowFirst: false,    // 1교시 허용
  preferOnline: false,  // 온라인 선호

  setPreference: (key, value) => set((state) => ({ ...state, [key]: value })),
  setAll: (prefs) => set(prefs),
  reset: () => set({ freeDayMask: 0, avoidUphill: false, allowFirst: false, preferOnline: false }),
}))

export default usePreferenceStore