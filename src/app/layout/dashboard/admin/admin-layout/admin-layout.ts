
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebar } from '../../../../shared/components/admin/admin-sidebar/admin-sidebar';
import { DashboardTopbar } from '../../../../shared/components/dashboard-topbar/dashboard-topbar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminSidebar, DashboardTopbar],
  templateUrl: './admin-layout.html'
})
export class AdminLayout {}
