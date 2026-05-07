import { apiClient } from '@/api/client';
import type { AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO } from '@/api/contracts';
import { API_ENDPOINTS } from '@/api/endpoints';

export const AuthApiService = {
  async login(payload: LoginRequestDTO): Promise<AuthResponseDTO> {
    const { data } = await apiClient.post<AuthResponseDTO>(API_ENDPOINTS.auth.login, payload);
    return data;
  },

  async register(payload: RegisterRequestDTO): Promise<AuthResponseDTO> {
    const { data } = await apiClient.post<AuthResponseDTO>(API_ENDPOINTS.auth.register, payload);
    return data;
  },
};
