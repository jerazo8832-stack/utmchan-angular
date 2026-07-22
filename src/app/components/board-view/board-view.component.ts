import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Board, Post } from '../../models/models';
import { PostItemComponent } from '../post-item/post-item.component';
import { PostFormComponent } from '../post-form/post-form.component';
import { AnnouncementsComponent } from '../announcements/announcements.component';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [CommonModule, PostItemComponent, PostFormComponent, AnnouncementsComponent],
  templateUrl: './board-view.component.html'
})
export class BoardViewComponent implements OnInit {
  board: Board | null = null;
  threads: Post[] = [];
  boardSlug = 'inicio';

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.boardSlug = params.get('slug') || 'inicio';
        return this.api.getBoardView(this.boardSlug);
      })
    ).subscribe((res: any) => {
      this.board = res.board;
      this.threads = res.threads || [];
    });
  }

  reload() {
    this.api.getBoardView(this.boardSlug).subscribe((res: any) => {
      this.board = res.board;
      this.threads = res.threads || [];
    });
  }

  onPosted(event: { threadId: number }) {
    // Igual que el PHP original: al crear un hilo nuevo, redirige a su vista completa
    this.router.navigate(['/board', this.boardSlug, 'thread', event.threadId]);
  }
}
