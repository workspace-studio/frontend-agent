import{ CreateBookingFormValues } from '@/config/form-models.config';
import BookingsService from '@/services/bookings.service';
import{ BookingsParams } from '@/services/bookings.service';
import{ PayloadResponse } from '@/types/response.type';

import { bookingsStore } from './bookings.store';

export async function getBookings(params: BookingsParams): Promise<void> {
  bookingsStore.isLoading = true;

  const { entities, totalCount } = await BookingsService.getBookings(params);

  bookingsStore.isLoading = false;
  bookingsStore.bookings = entities;
  bookingsStore.totalCount = totalCount;
}

export async function getSelectedBooking(id: number): Promise<void> {
  const response = await BookingsService.getBooking(id);
  bookingsStore.selectedBooking = response!;
}

export function clearSelectedBooking(): void {
  bookingsStore.selectedBooking = undefined;
}

export async function createBooking(payload: CreateBookingFormValues): Promise<PayloadResponse<boolean>> {
  bookingsStore.isFormSubmitting = true;

  const response = await BookingsService.createBooking(payload);

  bookingsStore.isFormSubmitting = false;

  return response;
}

export async function updateBooking(
  id: number,
  payload: CreateBookingFormValues
): Promise<PayloadResponse<boolean>> {
  bookingsStore.isFormSubmitting = true;

  const response = await BookingsService.updateBooking(id, payload);

  bookingsStore.isFormSubmitting = false;

  return response;
}

export async function deleteBookings(ids: number[]): Promise<PayloadResponse<boolean>> {
  bookingsStore.isFormSubmitting = true;

  const response = await BookingsService.deleteBookings(ids);

  bookingsStore.isFormSubmitting = false;

  return response;
}

export function toggleCreateModal(isOpen?: boolean | React.MouseEvent): void {
  bookingsStore.createModalOpen =
    typeof isOpen === 'boolean' ? isOpen : !bookingsStore.createModalOpen;
}

export function toggleUpdateModal(isOpen?: boolean | React.MouseEvent): void {
  bookingsStore.updateModalOpen =
    typeof isOpen === 'boolean' ? isOpen : !bookingsStore.updateModalOpen;
}

export function toggleDeleteModal(isOpen?: boolean | React.MouseEvent): void {
  bookingsStore.deleteModalOpen =
    typeof isOpen === 'boolean' ? isOpen : !bookingsStore.deleteModalOpen;
}
