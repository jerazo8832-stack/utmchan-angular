import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Ban, StaffMember } from '../../models/models';

@Component({
  selector: 'app-staff-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-panel.component.html'
})
export class StaffPanelComponent implements OnInit {
  staff: StaffMember[] = [];
  bans: Ban[] = [];

  newUsername = '';
  newPassword = '';
  newRole: 'janitor' | 'admin' = 'janitor';

  error: string | null = null;
  success: string | null = null;

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    this.loadStaff();
    this.loadBans();
  }

  loadStaff() {
    this.api.getStaff().subscribe((data) => (this.staff = data));
  }

  loadBans() {
    this.api.getBans().subscribe((data) => (this.bans = data));
  }

  createStaff() {
    this.error = null;
    this.success = null;
    if (!this.newUsername.trim() || !this.newPassword.trim()) {
      this.error = 'Usuario y contraseña son obligatorios.';
      return;
    }
    this.api.createStaff(this.newUsername.trim(), this.newPassword.trim(), this.newRole).subscribe({
      next: () => {
        this.success = `✅ Cuenta "${this.newUsername}" creada correctamente.`;
        this.newUsername = '';
        this.newPassword = '';
        this.newRole = 'janitor';
        this.loadStaff();
      },
      error: (err) => (this.error = err?.error?.error || 'No se pudo crear la cuenta.')
    });
  }

  toggle(member: StaffMember) {
    this.api.toggleStaff(member.id).subscribe(() => this.loadStaff());
  }

  changePassword(member: StaffMember) {
    const newPass = window.prompt(`Nueva contraseña para "${member.username}":`);
    if (newPass && newPass.trim()) {
      this.api.changeStaffPassword(member.id, newPass.trim()).subscribe({
        next: () => alert('✅ Contraseña actualizada.'),
        error: () => alert('❌ No se pudo actualizar la contraseña.')
      });
    }
  }

  unban(ban: Ban) {
    if (!confirm(`¿Levantar el baneo a la IP ${ban.ip_address}?`)) return;
    this.api.unban(ban.id).subscribe(() => this.loadBans());
  }
}
