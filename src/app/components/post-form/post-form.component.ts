import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-form.component.html'
})
export class PostFormComponent {
  @Input() board = '';
  @Input() threadId: number | null = null;
  @Output() posted = new EventEmitter<{ threadId: number }>();

  name = '';
  title = '';
  comment = '';
  file: File | null = null;
  error: string | null = null;
  loading = false;

  constructor(private api: ApiService) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.file = input.files && input.files.length ? input.files[0] : null;
  }

  // Permite que el footer/otros componentes inserten una cita ">>#N" en el textarea
  appendQuote(postNum: number) {
    this.comment += `>>#${postNum} \n`;
  }

  submit() {
    if (!this.comment.trim() && !this.file) {
      this.error = '❌ El comentario no puede estar vacío si no subes una imagen.';
      return;
    }

    const formData = new FormData();
    formData.append('board', this.board);
    if (this.threadId) formData.append('thread', String(this.threadId));
    formData.append('name', this.name.trim());
    if (!this.threadId) formData.append('title', this.title.trim());
    formData.append('comment', this.comment.trim());
    if (this.file) formData.append('image', this.file);

    this.loading = true;
    this.error = null;

    this.api.createPost(formData).subscribe({
      next: (res) => {
        this.loading = false;
        this.name = '';
        this.title = '';
        this.comment = '';
        this.file = null;
        this.posted.emit({ threadId: res.thread_id });
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || 'Ocurrió un error al publicar.';
      }
    });
  }
}
