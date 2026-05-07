import { MOCK_AUDIT_LOGS } from '@/mocks/data';
import { AuditApiService } from '@/services/audit.api.service';
import type { AuditLog } from '@/types/domain';
import { ENV } from '@/constants/env';

export const AuditRepository = {
  async list(): Promise<AuditLog[]> {
    return ENV.USE_MOCK_API ? Promise.resolve(MOCK_AUDIT_LOGS) : AuditApiService.list();
  },
};
