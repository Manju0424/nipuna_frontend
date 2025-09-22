import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'admin-shell',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div style="padding:16px">
      <h2>Admin</h2>
      <nav style="margin-bottom:12px; display:flex; gap:12px;">
        <a routerLink="/admin/posts">Posts</a>
        <a routerLink="/">Back to site</a>
      </nav>
      <router-outlet />
    </div>
  `
})
export class AdminShell {}


