import { apiClient } from '@/api/client';
import type { VerifyResponseDTO } from '@/api/contracts';
import { API_ENDPOINTS } from '@/api/endpoints';

export const BiometricApiService = {
  async enroll() {
    const { data } = await apiClient.post<{ success: boolean }>(API_ENDPOINTS.biometric.enroll);
    return data;
  },

  async verify() {
    const { data } = await apiClient.post<VerifyResponseDTO>(API_ENDPOINTS.biometric.verify);
    return data;
  },
};
