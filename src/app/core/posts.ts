import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';

export interface PostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  thumbnail: string;
  published_at: string | null;
}

export interface PostDetail extends PostListItem {
  content: string;
}

export interface ListResponse {
  posts: PostListItem[];
  total: number;
  limit: number;
  offset: number;
}

@Injectable({
  providedIn: 'root'
})
export class Posts {
  constructor(private api: Api) {}

  list(params: { category?: string; limit?: number; offset?: number } = {}): Observable<ListResponse> {
    return this.api.get<ListResponse>('/posts', params);
  }

  get(slug: string): Observable<PostDetail> {
    return this.api.get<PostDetail>(`/posts/${slug}`);
  }

  create(data: any): Observable<any> {
    return this.api.post<any>('/posts', data);
  }

  update(id: number, data: any): Observable<any> {
    return this.api.put<any>(`/posts/${id}`, data);
  }

  remove(id: number): Observable<any> {
    return this.api.delete<any>(`/posts/${id}`);
  }

  uploadImage(file: File): Observable<{ ok: boolean; url: string }>{
    const form = new FormData();
    form.append('file', file);
    return this.api.post<{ ok: boolean; url: string }>(`/uploads`, form as unknown as any);
  }
}
