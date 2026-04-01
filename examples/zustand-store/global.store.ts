import { create } from 'zustand';

import Toast from '@/types/toast.type';

interface GlobalState {
  toast?: Toast;
  showToast: (toast: Toast) => void;
  resetToast: () => void;
}

const useGlobalStore = create<GlobalState>(set => ({
  toast: undefined,
  showToast: toast => set({ toast }),
  resetToast: () => set({ toast: undefined }),
}));

export default useGlobalStore;
