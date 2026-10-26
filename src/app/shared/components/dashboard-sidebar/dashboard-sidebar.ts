
import { Component, Input } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { DashboardMenuGroup } from '../dashboard-menu.config';
import { AuthService } from '../../../core/auth/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dashboard-sidebar.html'
})
export class DashboardSidebar {

  @Input() title = 'Insurance Portal';

  @Input() menu: DashboardMenuGroup[] = [];

  @Input() showLogout = true;

  openMenu: string | null = null;

  constructor(private router: Router, private auth: AuthService) {}

  toggleMenu(label: string): void {
    this.openMenu =
      this.openMenu === label ? null : label;
  }

  logout(): void {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;
    const request = this.auth.logout();
    if (!request) { this.router.navigateByUrl('/login'); return; }
    request.pipe(catchError(() => { this.auth.clearSession(); return of(null); }))
      .subscribe(() => this.router.navigateByUrl('/login'));
  }
}
