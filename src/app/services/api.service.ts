import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Announcement, Ban, Board, Post, Report, StaffMember
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ---------- Tableros ----------
  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.base}/boards`);
  }

  // ---------- Anuncios ----------
  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.base}/announcements`);
  }

  publishAnnouncement(title: string, content: string): Observable<any> {
    return this.http.post(`${this.base}/announcements`, { title, content }, { withCredentials: true });
  }

  // ---------- Posts / Hilos ----------
  getBoardView(board: string): Observable<{ board: Board; threads: Post[] }> {
    return this.http.get<{ board: Board; threads: Post[] }>(`${this.base}/posts`, { params: { board } });
  }

  getThreadView(board: string, threadId: number): Observable<{ board: Board; posts: Post[] }> {
    return this.http.get<{ board: Board; posts: Post[] }>(`${this.base}/posts`, {
      params: { board, thread: threadId }
    });
  }

  createPost(formData: FormData): Observable<{ thread_id: number; board: string }> {
    return this.http.post<{ thread_id: number; board: string }>(`${this.base}/posts`, formData, {
      withCredentials: true
    });
  }

  // ---------- Moderación ----------
  deletePost(postId: number): Observable<any> {
    return this.http.post(`${this.base}/mod/delete/${postId}`, {}, { withCredentials: true });
  }

  banFromPost(postId: number): Observable<any> {
    return this.http.post(`${this.base}/mod/ban/${postId}`, {}, { withCredentials: true });
  }

  // ---------- Reportes ----------
  reportPost(postId: number, reason: string): Observable<any> {
    return this.http.post(`${this.base}/reports`, { post_id: postId, reason });
  }

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.base}/reports`, { withCredentials: true });
  }

  getReportsCount(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.base}/reports/count`, { withCredentials: true });
  }

  resolveReport(reportId: number): Observable<any> {
    return this.http.post(`${this.base}/reports/${reportId}/resolve`, {}, { withCredentials: true });
  }

  // ---------- Staff (solo admin) ----------
  getStaff(): Observable<StaffMember[]> {
    return this.http.get<StaffMember[]>(`${this.base}/staff`, { withCredentials: true });
  }

  createStaff(username: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.base}/staff`, { username, password, role }, { withCredentials: true });
  }

  toggleStaff(id: number): Observable<any> {
    return this.http.patch(`${this.base}/staff/${id}/toggle`, {}, { withCredentials: true });
  }

  changeStaffPassword(id: number, newPassword: string): Observable<any> {
    return this.http.patch(`${this.base}/staff/${id}/password`, { new_password: newPassword }, { withCredentials: true });
  }

  getBans(): Observable<Ban[]> {
    return this.http.get<Ban[]>(`${this.base}/staff/bans/list`, { withCredentials: true });
  }

  unban(banId: number): Observable<any> {
    return this.http.delete(`${this.base}/staff/bans/${banId}`, { withCredentials: true });
  }

  // Helper para construir la URL completa de una imagen subida
  imageUrl(imagePath: string): string {
    const origin = this.base.replace(/\/api$/, '');
    return `${origin}/${imagePath}`;
  }
}
