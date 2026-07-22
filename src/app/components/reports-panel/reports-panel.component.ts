import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Report } from '../../models/models';

@Component({
  selector: 'app-reports-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reports-panel.component.html'
})
export class ReportsPanelComponent implements OnInit {
  reports: Report[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  resolve(reportId: number) {
    this.api.resolveReport(reportId).subscribe(() => this.load());
  }

  deletePost(postId: number) {
    if (!confirm('¿Borrar este post reportado?')) return;
    this.api.deletePost(postId).subscribe(() => this.load());
  }

  banPost(postId: number) {
    if (!confirm('¿Banear al autor de este post?')) return;
    this.api.banFromPost(postId).subscribe(() => this.load());
  }
}
