import { create } from 'zustand';

interface ReservationState {
  cancellationId: string | null;
  openCancelModal: (reservationId: string) => void;
  closeCancelModal: () => void;
}

const useReservationStore = create<ReservationState>(set => ({
  cancellationId: null,
  openCancelModal: reservationId => set({ cancellationId: reservationId }),
  closeCancelModal: () => set({ cancellationId: null }),
}));

export default useReservationStore;
