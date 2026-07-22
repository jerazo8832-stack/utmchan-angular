import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthUser } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Señal reactiva con el usuario actual (null = nadie logueado)
  currentUser = signal<AuthUser | null>(null);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(`${environment.apiUrl}/auth/login`, { username, password }, { withCredentials: true })
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout(): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.currentUser.set(null)));
  }

  fetchMe(): Observable<{ user: AuthUser | null }> {
    return this.http
      .get<{ user: AuthUser | null }>(`${environment.apiUrl}/auth/me`, { withCredentials: true })
      .pipe(tap((res) => this.currentUser.set(res.user)));
  }

  isStaff(): boolean {
    const u = this.currentUser();
    return !!u && (u.role === 'admin' || u.role === 'janitor');
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }
}
