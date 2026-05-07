import { useState } from 'react';

import { BiometricRepository } from '@/repositories/biometric.repository';

export function useBiometric() {
  const [isLoading, setIsLoading] = useState(false);

  const enroll = async () => {
    setIsLoading(true);
    try {
      return await BiometricRepository.enroll();
    } finally {
      setIsLoading(false);
    }
  };

  const verify = async () => {
    setIsLoading(true);
    try {
      return await BiometricRepository.verify();
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, enroll, verify };
}
