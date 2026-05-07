import type { AuditLog, User } from '@/types/domain';

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  full_name: string;
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: User;
}

export interface VerifyResponseDTO {
  event_type: 'VERIFIED' | 'REJECTED';
  confidence_score: number;
}

export interface NfcScanResponseDTO {
  allowed: boolean;
  location_id: string;
  reason?: string;
}

export type AuditListResponseDTO = AuditLog[];
