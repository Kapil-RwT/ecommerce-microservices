import api from './axios';
import type { ApiResponse, Order, OrderRequest, PageResponse } from '../types';

export const ordersApi = {
  create: (data: OrderRequest) =>
    api.post<ApiResponse<Order>>('/orders', data),

  getById: (id: number) =>
    api.get<ApiResponse<Order>>(`/orders/${id}`),

  getByUserId: (userId: number) =>
    api.get<ApiResponse<Order[]>>(`/orders/user/${userId}`),

  getAll: (page = 0, size = 20) =>
    api.get<ApiResponse<PageResponse<Order>>>(`/orders?page=${page}&size=${size}`),

  cancel: (id: number, reason?: string) =>
    api.post<ApiResponse<Order>>(`/orders/${id}/cancel?reason=${reason || 'User requested'}`),
};
