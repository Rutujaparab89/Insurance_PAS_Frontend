
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerSidebar } from '../../../../shared/components/customer/customer-sidebar/customer-sidebar';
import { DashboardTopbar } from '../../../../shared/components/dashboard-topbar/dashboard-topbar';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [RouterOutlet, CustomerSidebar, DashboardTopbar],
  templateUrl: './customer-layout.html'
})
export class CustomerLayout {}
