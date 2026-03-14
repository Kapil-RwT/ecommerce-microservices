import api from './axios';
import type { ApiResponse, PageResponse, Product } from '../types';

export const productsApi = {
  getAll: (page = 0, size = 20) =>
    api.get<ApiResponse<PageResponse<Product>>>(`/products?page=${page}&size=${size}`),

  getById: (id: number) =>
    api.get<ApiResponse<Product>>(`/products/${id}`),

  search: (keyword: string, page = 0, size = 20) =>
    api.get<ApiResponse<PageResponse<Product>>>(`/products/search?keyword=${keyword}&page=${page}&size=${size}`),

  getByCategory: (category: string) =>
    api.get<ApiResponse<Product[]>>(`/products/category/${category}`),

  getFeatured: (page = 0, size = 20) =>
    api.get<ApiResponse<PageResponse<Product>>>(`/products/featured?page=${page}&size=${size}`),

  create: (data: Partial<Product>) =>
    api.post<ApiResponse<Product>>('/products', data),
};
