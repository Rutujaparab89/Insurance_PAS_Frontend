
import { Component } from '@angular/core';

import {
  DashboardSidebar
} from '../../dashboard-sidebar/dashboard-sidebar';

import {
  ADMIN_MENU
} from '../../dashboard-menu.config';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [DashboardSidebar],
  templateUrl: './admin-sidebar.html'
})
export class AdminSidebar {

  readonly menu = ADMIN_MENU;

}
