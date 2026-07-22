import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Board, Post } from '../../models/models';
import { PostItemComponent } from '../post-item/post-item.component';
import { PostFormComponent } from '../post-form/post-form.component';

@Component({
  selector: 'app-thread-view',
  standalone: true,
  imports: [CommonModule, RouterLink, PostItemComponent, PostFormComponent],
  templateUrl: './thread-view.component.html'
})
export class ThreadViewComponent implements OnInit {
  board: Board | null = null;
  boardSlug = '';
  threadId = 0;
  posts: Post[] = [];

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.boardSlug = params.get('slug') || '';
        this.threadId = Number(params.get('threadId'));
        return this.api.getThreadView(this.boardSlug, this.threadId);
      })
    ).subscribe((res: any) => {
      this.board = res.board;
      this.posts = res.posts || [];
    });
  }

  reload() {
    this.api.getThreadView(this.boardSlug, this.threadId).subscribe((res: any) => {
      this.board = res.board;
      this.posts = res.posts || [];
    });
  }

  @ViewChild(PostFormComponent) postForm?: PostFormComponent;

  // Cuando el usuario hace clic en el número de un post, se inserta la cita
  // ">>#N" directamente en el textarea del formulario de respuesta.
  onQuote(postId: number) {
    this.postForm?.appendQuote(postId);
    // Llevamos el foco al textarea para que el usuario siga escribiendo
    document.getElementById('replyContent')?.focus();
  }
}
