import { api } from '@/config/axios.config';
import { SortDirection } from '@/config/constants.config';
import{ CreateBookingFormValues } from '@/config/form-models.config';
import{ BookingModel } from '@/models/booking.model';
import{ ErrorModel } from '@/models/error.model';
import{ PaginatedResponse, PayloadResponse } from '@/types/response.type';
import { createQueryParams } from '@/utils/static/queryParams';

export interface BookingsParams {
  pageNumber?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export default class BookingsService {
  public static async getBookings(params: BookingsParams): Promise<PaginatedResponse<BookingModel>> {
    try {
      const queryParams = createQueryParams(params);
      const { data } = await api.get(`/bookings${queryParams}`);

      return data;
    } catch {
      return {
        entities: [],
        totalCount: 0,
      };
    }
  }

  public static async getBooking(id: number): Promise<BookingModel | null> {
    try {
      const { data } = await api.get(`/bookings/${id}`);

      return data || null;
    } catch {
      return null;
    }
  }

  public static async createBooking(payload: CreateBookingFormValues): Promise<PayloadResponse<boolean>> {
    try {
      await api.put('/bookings', payload);

      return { payload: true };
    } catch (error) {
      const { message } = error as ErrorModel;

      return { payload: false, message };
    }
  }

  public static async updateBooking(
    id: number,
    payload: CreateBookingFormValues
  ): Promise<PayloadResponse<boolean>> {
    try {
      await api.post(`/bookings/${id}`, { id, ...payload });

      return { payload: true };
    } catch (error) {
      const { message } = error as ErrorModel;

      return { payload: false, message };
    }
  }

  public static async deleteBookings(ids: number[]): Promise<PayloadResponse<boolean>> {
    try {
      await api.delete(`/bookings/${ids}`);

      return { payload: true };
    } catch (error) {
      const { message } = error as ErrorModel;

      return { payload: false, message };
    }
  }
}
