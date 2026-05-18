import { AuditApiService } from '@/services/audit.api.service';
import type { AuditLog } from '@/types/domain';

export const AuditRepository = {
  async list(): Promise<AuditLog[]> {
    return AuditApiService.list();
  },
};
