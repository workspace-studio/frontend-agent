import { proxy, useSnapshot } from 'valtio';

import Toast from '@/types/toast.type';

interface GlobalStore {
  toast?: Toast;
  isFormDirty: boolean;
}

export const globalStore = proxy<GlobalStore>({
  toast: undefined,
  isFormDirty: false,
});

export const useGlobalStore = (): GlobalStore => useSnapshot(globalStore);
