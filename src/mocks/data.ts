import type { AuditLog, User } from '@/types/domain';

export const MOCK_CREDENTIALS = {
  email: 'demo@identio.app',
  password: 'Demo1234',
};

export const MOCK_USER: User = {
  id: 'u_001',
  full_name: 'Usuario Demo',
  email: MOCK_CREDENTIALS.email,
  status: 'ENROLLED',
  roles: [{ id: 1, name: 'ROLE_USER' }],
};

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'a_001',
    user_id: 'u_001',
    location_id: 'main-gate',
    event_type: 'VERIFIED',
    timestamp: new Date().toISOString(),
    details: { confidence_score: 0.93 },
  },
  {
    id: 'a_002',
    user_id: 'u_001',
    location_id: 'server-room',
    event_type: 'REJECTED',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    details: { reason: 'Low confidence' },
  },
];
