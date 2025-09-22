import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Posts, PostDetail } from '../../../core/posts';

@Component({
  selector: 'admin-post-form',
  standalone: true,
  imports: [FormsModule, NgIf],
  template: `
    <h3>{{ isEdit() ? 'Edit' : 'New' }} Post</h3>
    <form (ngSubmit)="onSubmit()" #f="ngForm" style="max-width:800px; display:block;">
      <label>Title</label>
      <input type="text" [(ngModel)]="model.title" name="title" required style="width:100%; padding:8px; margin:4px 0 12px;" />

      <label>Excerpt</label>
      <textarea [(ngModel)]="model.excerpt" name="excerpt" rows="3" required style="width:100%; padding:8px; margin:4px 0 12px;"></textarea>

      <label>Content</label>
      <textarea [(ngModel)]="model.content" name="content" rows="8" required style="width:100%; padding:8px; margin:4px 0 12px;"></textarea>

      <label>Category</label>
      <input type="text" [(ngModel)]="model.category" name="category" required style="width:100%; padding:8px; margin:4px 0 12px;" />

      <fieldset style="border:1px solid #ddd; padding:12px; margin-bottom:12px;">
        <legend>Thumbnail</legend>
        <div style="display:flex; gap:12px; align-items:center;">
          <label><input type="radio" name="thumbMode" [checked]="thumbMode() === 'link'" (change)="setThumbMode('link')" /> Link</label>
          <label><input type="radio" name="thumbMode" [checked]="thumbMode() === 'file'" (change)="setThumbMode('file')" /> Upload File</label>
        </div>
        <div *ngIf="thumbMode() === 'link'" style="margin-top:8px;">
          <input type="url" [(ngModel)]="thumbnailLink" name="thumbnailLink" placeholder="https://..." style="width:100%; padding:8px;" />
        </div>
        <div *ngIf="thumbMode() === 'file'" style="margin-top:8px;">
          <input type="file" (change)="onFileChange($event)" accept="image/*" />
          <div *ngIf="uploadPreview()" style="margin-top:8px;">
            <img [src]="uploadPreview()" alt="preview" style="max-height:120px;" />
          </div>
        </div>
      </fieldset>

      <label>
        <input type="checkbox" [(ngModel)]="published" name="published" /> Published
      </label>

      <div style="margin-top:16px; display:flex; gap:8px;">
        <button type="submit">Save</button>
        <button type="button" (click)="onCancel()">Cancel</button>
      </div>
    </form>
  `
})
export class AdminPostForm implements OnInit {
  protected readonly isEdit = signal(false);
  protected readonly thumbMode = signal<'link' | 'file'>('link');
  protected thumbnailLink: string = '';
  protected selectedFile: File | null = null;
  protected readonly uploadPreview = signal<string | null>(null);
  protected published = true;

  protected model: any = {
    title: '',
    excerpt: '',
    content: '',
    category: '',
    thumbnail: ''
  };

  private postId: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private posts: Posts) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.postId = Number(id);
      // For edit, backend expects id for PUT; fetch by slug isn't suitable. We can hydrate minimal fields by listing and finding id if needed.
      // Assume admin navigates from list; to be safe, we don't fetch again here to avoid slug mismatch. In real app, add GET by id.
    }
  }

  setThumbMode(mode: 'link' | 'file') { this.thumbMode.set(mode); }

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = (input.files && input.files[0]) || null;
    this.selectedFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.uploadPreview.set(String(reader.result));
      reader.readAsDataURL(file);
    } else {
      this.uploadPreview.set(null);
    }
  }

  private uploadIfNeeded(): Promise<string | null> {
    if (this.thumbMode() === 'file' && this.selectedFile) {
      return new Promise((resolve, reject) => {
        this.posts.uploadImage(this.selectedFile!).subscribe({
          next: r => resolve(r.url),
          error: () => reject('upload failed')
        });
      });
    }
    if (this.thumbMode() === 'link' && this.thumbnailLink) {
      return Promise.resolve(this.thumbnailLink);
    }
    return Promise.resolve(null);
  }

  async onSubmit() {
    const thumbnail = await this.uploadIfNeeded();
    const payload: any = {
      title: this.model.title,
      excerpt: this.model.excerpt,
      content: this.model.content,
      category: this.model.category,
      published: this.published
    };
    if (thumbnail) payload.thumbnail = thumbnail;

    if (this.isEdit() && this.postId != null) {
      this.posts.update(this.postId, payload).subscribe(() => this.router.navigateByUrl('/admin/posts'));
    } else {
      this.posts.create(payload).subscribe(() => this.router.navigateByUrl('/admin/posts'));
    }
  }

  onCancel() {
    this.router.navigateByUrl('/admin/posts');
  }
}


