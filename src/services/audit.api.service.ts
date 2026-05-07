import { apiClient } from '@/api/client';
import type { AuditListResponseDTO } from '@/api/contracts';
import { API_ENDPOINTS } from '@/api/endpoints';

export const AuditApiService = {
  async list() {
    const { data } = await apiClient.get<AuditListResponseDTO>(API_ENDPOINTS.audit.list);
    return data;
  },
};
