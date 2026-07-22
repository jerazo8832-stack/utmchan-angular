import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Board } from '../../models/models';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html'
})
export class NavComponent {
  @Input() boards: Board[] = [];

  private icons: Record<string, string> = {
    inicio: '🏠',
    general: '📌',
    ciencias: '🔬',
    medicina: '💊',
    ingenieria: '⚙️'
  };

  private labels: Record<string, string> = {
    inicio: 'Inicio',
    general: 'General',
    ciencias: 'Ciencias',
    medicina: 'Medicina',
    ingenieria: 'Ingeniería'
  };

  iconFor(slug: string): string {
    return this.icons[slug] || '📋';
  }

  labelFor(slug: string, fallback: string): string {
    return this.labels[slug] || fallback;
  }
}
