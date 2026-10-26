
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-topbar.html'
})
export class DashboardTopbar {
  constructor(private auth: AuthService) {}
  get username(): string { return this.auth.getUser()?.username || this.role; }
  @Input() role: 'Admin' | 'Agent' | 'Customer' = 'Customer';
  @Input() homeUrl = '/customer/dashboard';
}
