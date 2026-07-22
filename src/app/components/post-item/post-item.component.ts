import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/models';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-item.component.html'
})
export class PostItemComponent {
  @Input() post!: Post;
  @Input() isPreview = false;       // true si se muestra como vista previa dentro del tablón
  @Input() showBoardTag = false;    // true en la vista "inicio" (combinada de todos los tableros)
  @Input() insideThread = false;    // true si ya estamos dentro de la vista de un hilo
  @Output() changed = new EventEmitter<void>();
  @Output() quote = new EventEmitter<number>();

  constructor(public api: ApiService, public auth: AuthService) {}

  get formattedComment(): string {
    // Igual que el PHP original: escapa HTML, resalta citas ">>#N" y respeta saltos de línea
    const escaped = this.escapeHtml(this.post.comment);
    const withQuotes = escaped.replace(/&gt;&gt;#(\d+)/g, '<span class="reply-reference-tag">>>#$1</span>');
    return withQuotes.replace(/\n/g, '<br>');
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  formattedDate(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  onQuoteClick() {
    this.quote.emit(this.post.id);
  }

  report() {
    const reason = window.prompt('¿Por qué reportas este post? (Spam, Ofensivo, etc.)');
    if (reason && reason.trim()) {
      this.api.reportPost(this.post.id, reason.trim()).subscribe({
        next: () => alert('✅ Reporte enviado. Gracias por ayudarnos a mantener el orden.'),
        error: () => alert('❌ No se pudo enviar el reporte.')
      });
    }
  }

  deletePost() {
    if (!confirm('¿Seguro que deseas borrar este post?')) return;
    this.api.deletePost(this.post.id).subscribe({
      next: () => this.changed.emit(),
      error: () => alert('❌ No se pudo borrar el post.')
    });
  }

  banAuthor() {
    if (!confirm('¿Seguro que deseas marcar este usuario como baneo?')) return;
    this.api.banFromPost(this.post.id).subscribe({
      next: () => this.changed.emit(),
      error: () => alert('❌ No se pudo aplicar el baneo.')
    });
  }
}
