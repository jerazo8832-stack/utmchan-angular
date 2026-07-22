import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { NavComponent } from './components/nav/nav.component';
import { Board } from './models/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'UTMChan';
  boards: Board[] = [];
  pendingReports = 0;

  constructor(public auth: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getBoards().subscribe((data) => (this.boards = data));
    this.auth.fetchMe().subscribe(() => this.maybeLoadReportsCount());
  }

  maybeLoadReportsCount() {
    if (this.auth.isStaff()) {
      this.api.getReportsCount().subscribe((res) => (this.pendingReports = res.total));
    }
  }

  logout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/board', 'inicio']));
  }
}
