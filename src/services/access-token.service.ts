/**
 * Service for managing temporary access tokens for NFC transmission
 */
class AccessTokenService {
  private accessToken: string | null = null;
  private expirationTime: number | null = null;

  /**
   * Store a temporary access token with expiration
   * @param token The access token to store
   * @param expiresInSeconds How long the token is valid (default: 90 seconds)
   */
  setAccessToken(token: string, expiresInSeconds: number = 90): void {
    this.accessToken = token;
    this.expirationTime = Date.now() + (expiresInSeconds * 1000);
  }

  /**
   * Get the current access token if it's still valid
   * @returns The access token or null if expired/not set
   */
  getAccessToken(): string | null {
    if (!this.accessToken || !this.expirationTime) {
      return null;
    }

    // Check if token has expired
    if (Date.now() > this.expirationTime) {
      this.clearAccessToken();
      return null;
    }

    return this.accessToken;
  }

  /**
   * Check if there's a valid access token
   */
  hasValidToken(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * Get remaining time in seconds before token expires
   */
  getRemainingTime(): number {
    if (!this.expirationTime) {
      return 0;
    }

    const remaining = Math.max(0, Math.floor((this.expirationTime - Date.now()) / 1000));
    return remaining;
  }

  /**
   * Clear the stored access token
   */
  clearAccessToken(): void {
    this.accessToken = null;
    this.expirationTime = null;
  }
}

export const accessTokenService = new AccessTokenService();

// Made with Bob
