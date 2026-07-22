import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Announcement } from '../../models/models';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcements.component.html'
})
export class AnnouncementsComponent implements OnInit {
  announcements: Announcement[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getAnnouncements().subscribe((data) => (this.announcements = data));
  }

  formattedDate(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
