import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Por favor, llena todos los campos.';
      return;
    }
    this.loading = true;
    this.error = null;
    this.auth.login(this.username.trim(), this.password.trim()).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/board', 'inicio']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || 'Usuario o contraseña incorrectos.';
      }
    });
  }
}
