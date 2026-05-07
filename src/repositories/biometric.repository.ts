import { BiometricService } from '@/services/biometric.service';
import { BiometricApiService } from '@/services/biometric.api.service';
import { ENV } from '@/constants/env';

export const BiometricRepository = {
  enroll: () => (ENV.USE_MOCK_API ? BiometricService.enroll() : BiometricApiService.enroll()),
  verify: () => (ENV.USE_MOCK_API ? BiometricService.verify() : BiometricApiService.verify()),
};
