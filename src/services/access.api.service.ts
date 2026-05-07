import { apiClient } from '@/api/client';
import type { NfcScanResponseDTO } from '@/api/contracts';
import { API_ENDPOINTS } from '@/api/endpoints';

export const AccessApiService = {
  async scanNfc() {
    const { data } = await apiClient.post<NfcScanResponseDTO>(API_ENDPOINTS.access.nfcScan);
    return data;
  },
};
