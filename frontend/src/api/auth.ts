import api from './axios';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<ApiResponse<AuthResponse>>('/users/register', data),

  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/users/login', data),
};
