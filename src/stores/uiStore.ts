import { create } from 'zustand'

type AppMode = 'edit' | 'teleprompter'

interface UiState {
  mode: AppMode
  sidebarOpen: boolean
  teleprompterSceneIndex: number
  setMode: (mode: AppMode) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTeleprompterSceneIndex: (index: number) => void
}

export const useUiStore = create<UiState>()((set) => ({
  mode: 'edit',
  sidebarOpen: false,
  teleprompterSceneIndex: 0,

  setMode: (mode) => set({ mode, teleprompterSceneIndex: 0 }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTeleprompterSceneIndex: (index) => set({ teleprompterSceneIndex: index }),
}))
