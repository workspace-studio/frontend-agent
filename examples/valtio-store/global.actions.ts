import Toast from '@/types/toast.type';

import { globalStore } from './global.store';

export const showToast = ({ status, text }: Toast): void => {
  globalStore.toast = {
    text,
    status,
  };
};

export const resetToast = (): void => {
  globalStore.toast = undefined;
};

export function setIsFormDirty(isDirty: boolean): void {
  globalStore.isFormDirty = isDirty;
}
