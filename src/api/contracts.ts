import type { AuditLog } from '@/types/domain';

// Auth DTOs
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
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshRequestDTO {
  refresh_token: string;
}

// Biometric/Verification DTOs
export interface EnrollRequestDTO {
  image_base64: string;
}

export interface EnrollResponseDTO {
  user_id: string;
  embedding_id: string;
  message: string;
}

export interface VerifyRequestDTO {
  image_base64: string;
  session_id: string;
  channel?: string;
}

export interface VerifyResponseDTO {
  result: 'MATCH' | 'NO_MATCH' | 'AMBIGUOUS' | 'LOW_QUALITY';
  score: number;
  session_id: string;
  access_token?: string; // Temporary token for NFC transmission when result is MATCH
}

export interface VerificationAttemptDTO {
  session_id: string;
  result: string;
  similarity_score: number;
  created_at: string;
}

export interface AttemptsListResponseDTO {
  user_id: string;
  attempts: VerificationAttemptDTO[];
}

// Access DTOs
export interface NfcScanResponseDTO {
  allowed: boolean;
  location_id: string;
  reason?: string;
}

// Audit DTOs
export type AuditListResponseDTO = AuditLog[];
