import { create } from 'zustand'

type ModalId = 'loyalty' | 'new-service' | 'new-professional' | 'edit-professional' | null

interface UIState {
  sidebarOpen:  boolean
  activeModal:  ModalId
  openSidebar:  () => void
  closeSidebar: () => void
  openModal:    (id: ModalId) => void
  closeModal:   () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen:  false,
  activeModal:  null,
  openSidebar:  () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  openModal:    (id) => set({ activeModal: id }),
  closeModal:   () => set({ activeModal: null }),
}))
