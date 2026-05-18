import { useState } from 'react';

import { BiometricRepository } from '@/repositories/biometric.repository';

export function useBiometric() {
  const [isLoading, setIsLoading] = useState(false);

  const enroll = async (imageBase64: string) => {
    setIsLoading(true);
    try {
      return await BiometricRepository.enroll(imageBase64);
    } finally {
      setIsLoading(false);
    }
  };

  const verify = async (imageBase64: string, sessionId: string, channel?: string) => {
    setIsLoading(true);
    try {
      return await BiometricRepository.verify(imageBase64, sessionId, channel);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, enroll, verify };
}
