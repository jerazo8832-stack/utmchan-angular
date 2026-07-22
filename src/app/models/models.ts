export interface Board {
  slug: string;
  title: string;
  created_at: string;
}

export interface Post {
  id: number;
  board_slug: string;
  thread_id: number | null;
  name: string;
  title: string | null;
  comment: string;
  image_path: string | null;
  ip_address?: string;
  is_deleted: number;
  banned_comment: string | null;
  created_at: string;
  bumped_at: string;
  preview_replies?: Post[];
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface AuthUser {
  user_id: number;
  username: string;
  role: 'admin' | 'janitor';
}

export interface Report {
  report_id: number;
  reason: string;
  post_id: number;
  comment: string;
  board_slug: string;
  thread_id: number | null;
}

export interface StaffMember {
  id: number;
  username: string;
  role: 'admin' | 'janitor';
  is_active: number;
}

export interface Ban {
  id: number;
  ip_address: string;
  reason: string;
  banned_at: string;
}
