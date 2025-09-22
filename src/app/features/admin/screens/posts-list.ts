import { Component, OnInit, signal } from '@angular/core';
import { Posts, PostListItem } from '../../../core/posts';
import { DatePipe, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin-posts-list',
  standalone: true,
  imports: [NgFor, RouterLink, DatePipe],
  template: `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <h3>Posts</h3>
      <a routerLink="/admin/posts/new">New Post</a>
    </div>
    <table style="width:100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Title</th>
          <th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Category</th>
          <th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Published</th>
          <th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let p of list()">
          <td style="padding:8px; border-bottom:1px solid #eee;">{{ p.title }}</td>
          <td style="padding:8px; border-bottom:1px solid #eee;">{{ p.category }}</td>
          <td style="padding:8px; border-bottom:1px solid #eee;">{{ p.published_at ? (p.published_at | date:'medium') : 'Draft' }}</td>
          <td style="padding:8px; border-bottom:1px solid #eee;">
            <a [routerLink]="['/admin/posts', p.id]" style="margin-right:8px;">Edit</a>
            <button (click)="onDelete(p)" style="color:#c00; background:none; border:none; cursor:pointer;">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class AdminPostsList implements OnInit {
  private readonly pageSize = 50;
  protected readonly list = signal<PostListItem[]>([]);

  constructor(private posts: Posts) {}

  ngOnInit(): void {
    this.posts.list({ limit: this.pageSize, offset: 0 }).subscribe(r => this.list.set(r.posts));
  }

  onDelete(p: PostListItem) {
    if (!confirm(`Delete post "${p.title}"?`)) return;
    this.posts.remove(p.id).subscribe(() => {
      this.list.set(this.list().filter(x => x.id !== p.id));
    });
  }
}


