import { useState } from 'react';

import { AccessRepository } from '@/repositories/access.repository';

export function useNfcAccess() {
  const [isLoading, setIsLoading] = useState(false);

  const scanAccess = async () => {
    setIsLoading(true);
    try {
      return await AccessRepository.scanNfc();
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, scanAccess };
}
