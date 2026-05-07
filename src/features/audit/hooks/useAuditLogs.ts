import { useQuery } from '@tanstack/react-query';

import { AuditRepository } from '@/repositories/audit.repository';

export function useAuditLogs() {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => AuditRepository.list(),
  });
}
