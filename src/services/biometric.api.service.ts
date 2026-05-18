import { apiClient } from '@/api/client';
import type {
  EnrollRequestDTO,
  EnrollResponseDTO,
  VerifyRequestDTO,
  VerifyResponseDTO,
  AttemptsListResponseDTO
} from '@/api/contracts';
import { API_ENDPOINTS } from '@/api/endpoints';

export const BiometricApiService = {
  async enroll(payload: EnrollRequestDTO): Promise<EnrollResponseDTO> {
    const { data } = await apiClient.post<EnrollResponseDTO>(
      API_ENDPOINTS.biometric.enroll,
      payload
    );
    return data;
  },

  async verify(payload: VerifyRequestDTO): Promise<VerifyResponseDTO> {
    const { data } = await apiClient.post<VerifyResponseDTO>(
      API_ENDPOINTS.biometric.verify,
      payload
    );
    return data;
  },

  async getAttempts(): Promise<AttemptsListResponseDTO> {
    const { data } = await apiClient.get<AttemptsListResponseDTO>(
      API_ENDPOINTS.biometric.attempts
    );
    return data;
  },
};
