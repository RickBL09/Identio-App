import { useQuery } from '@tanstack/react-query';

import { AuditRepository } from '@/repositories/audit.repository';

export function useAuditLogs() {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => AuditRepository.list(),
    // Disable automatic fetching until audit API is implemented in gateway
    enabled: false,
  });
}
