import { Routes } from '@angular/router';
import { BoardViewComponent } from './components/board-view/board-view.component';
import { ThreadViewComponent } from './components/thread-view/thread-view.component';
import { LoginComponent } from './components/login/login.component';
import { ReportsPanelComponent } from './components/reports-panel/reports-panel.component';
import { StaffPanelComponent } from './components/staff-panel/staff-panel.component';
import { staffGuard } from './guards/staff.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'board/inicio', pathMatch: 'full' },
  { path: 'board/:slug', component: BoardViewComponent },
  { path: 'board/:slug/thread/:threadId', component: ThreadViewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'mod/reportes', component: ReportsPanelComponent, canActivate: [staffGuard] },
  { path: 'mod/staff', component: StaffPanelComponent, canActivate: [staffGuard], data: { role: 'admin' } },
  { path: '**', redirectTo: 'board/inicio' }
];
