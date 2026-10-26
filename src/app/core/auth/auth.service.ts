import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map, finalize } from 'rxjs';

export type AppRole = 'ADMIN' | 'AGENT' | 'CUSTOMER';
export interface AuthUser {
  id: number;
  username: string;
  email?: string;
  mobile?: string;
  role: string;
  status?: string;
}
export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  accessExpiresInSeconds?: number;
  user: AuthUser;
}
interface ApiResponse<T> { success: boolean; message: string; data: T; timestamp?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private get browser(): boolean { return isPlatformBrowser(this.platformId); }
  // Angular dev-server proxy forwards /api to the API Gateway on port 8080.
  private readonly api = '/api/v1/auth';
  private readonly tokenKey = 'insurance_access_token';
  private readonly refreshKey = 'insurance_refresh_token';
  private readonly userKey = 'insurance_auth_user';

  login(username: string, password: string): Observable<TokenPayload> {
    return this.http.post<ApiResponse<TokenPayload>>(`${this.api}/login`, { username, password }).pipe(
      map(response => {
        const payload = response?.data;
        if (!response?.success || !payload?.accessToken || !payload?.user) {
          throw new Error(response?.message || 'The login response was incomplete.');
        }
        const role = this.normalizeRole(payload.user.role);
        if (!role) throw new Error('Your account does not have a supported role.');
        payload.user.role = role;
        if (this.browser) {
          sessionStorage.setItem(this.tokenKey, payload.accessToken);
          sessionStorage.setItem(this.refreshKey, payload.refreshToken || '');
          sessionStorage.setItem(this.userKey, JSON.stringify(payload.user));
        }
        return payload;
      })
    );
  }

  getAccessToken(): string | null { return this.browser ? sessionStorage.getItem(this.tokenKey) : null; }
  getRefreshToken(): string | null { return this.browser ? sessionStorage.getItem(this.refreshKey) : null; }
  getUser(): AuthUser | null {
    if (!this.browser) return null;
    const raw = sessionStorage.getItem(this.userKey);
    if (!raw) return null;
    try { return JSON.parse(raw) as AuthUser; } catch { this.clearSession(); return null; }
  }
  isAuthenticated(): boolean { return !!this.getAccessToken() && !!this.getUser(); }
  normalizeRole(role: unknown): AppRole | null {
    const value = String(role ?? '').trim().toUpperCase().replace(/^ROLE_/, '');
    return value === 'ADMIN' || value === 'AGENT' || value === 'CUSTOMER' ? value : null;
  }
  dashboardUrl(role = this.getUser()?.role): string {
    switch (this.normalizeRole(role)) {
      case 'ADMIN': return '/admin/dashboard';
      case 'AGENT': return '/agent/dashboard';
      case 'CUSTOMER': return '/customer/dashboard';
      default: return '/login';
    }
  }
  logout(): Observable<unknown> | null {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) { this.clearSession(); return null; }
    return this.http.post(`${this.api}/logout`, { refreshToken }).pipe(
      finalize(() => this.clearSession())
    );
  }
  clearSession(): void {
    if (!this.browser) return;
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.refreshKey);
    sessionStorage.removeItem(this.userKey);
    // Clear keys used by the older frontend version as well.
    sessionStorage.removeItem('token'); sessionStorage.removeItem('role');
    localStorage.removeItem('token'); localStorage.removeItem('role');
  }
}
