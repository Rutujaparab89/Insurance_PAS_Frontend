
import { Component } from '@angular/core';
import { DashboardSidebar } from '../../dashboard-sidebar/dashboard-sidebar';
import { CUSTOMER_MENU } from '../../dashboard-menu.config';

@Component({
  selector: 'app-customer-sidebar',
  standalone: true,
  imports: [DashboardSidebar],
  templateUrl: './customer-sidebar.html'
})
export class CustomerSidebar {
  readonly menu = CUSTOMER_MENU;
}
