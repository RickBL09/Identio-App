export type UserStatus = 'PENDING' | 'ENROLLED' | 'BLOCKED';
export type RoleName = 'ROLE_USER' | 'ROLE_ADMIN';

export interface Role {
  id: number;
  name: RoleName;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  status: UserStatus;
  roles: Role[];
  profile_image?: string;
}

export type AuditEventType = 'VERIFIED' | 'REJECTED' | 'ENROLLED';

export interface AuditLog {
  id: string;
  user_id?: string;
  location_id: string;
  event_type: AuditEventType;
  timestamp: string;
  details: {
    confidence_score?: number;
    reason?: string;
  };
}
