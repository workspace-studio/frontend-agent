import { proxy, useSnapshot } from 'valtio';

import{ BookingModel } from '@/models/booking.model';

interface BookingsStore {
  bookings: BookingModel[];
  selectedBooking?: BookingModel;
  totalCount: number;
  isLoading: boolean;
  createModalOpen: boolean;
  updateModalOpen: boolean;
  deleteModalOpen: boolean;
  isFormSubmitting: boolean;
}

export const bookingsStore = proxy<BookingsStore>({
  bookings: [],
  selectedBooking: undefined,
  totalCount: 0,
  isLoading: false,
  createModalOpen: false,
  updateModalOpen: false,
  deleteModalOpen: false,
  isFormSubmitting: false,
});

export const useBookingsStore = (): BookingsStore => useSnapshot(bookingsStore);
