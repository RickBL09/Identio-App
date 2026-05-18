import { BiometricApiService } from '@/services/biometric.api.service';
import type { EnrollRequestDTO, VerifyRequestDTO } from '@/api/contracts';

export const BiometricRepository = {
  async enroll(imageBase64: string) {
    const payload: EnrollRequestDTO = {
      image_base64: imageBase64,
    };
    return BiometricApiService.enroll(payload);
  },

  async verify(imageBase64: string, sessionId: string, channel?: string) {
    const payload: VerifyRequestDTO = {
      image_base64: imageBase64,
      session_id: sessionId,
      channel,
    };
    return BiometricApiService.verify(payload);
  },

  async getAttempts() {
    return BiometricApiService.getAttempts();
  },
};
