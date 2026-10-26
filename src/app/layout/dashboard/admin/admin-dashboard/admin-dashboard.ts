
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboard {
  readonly cards = [
    { title: 'Customers', icon: 'bi-people', path: '/admin/customer/list', description: 'Customer list and KYC' },
    { title: 'Agents', icon: 'bi-person-badge', path: '/admin/agent/list', description: 'Agent management' },
    { title: 'Products', icon: 'bi-box-seam', path: '/admin/products/list', description: 'Insurance products' },
    { title: 'Quotes', icon: 'bi-file-earmark-text', path: '/admin/quotes/list', description: 'Review quotations' },
    { title: 'Policies', icon: 'bi-shield-check', path: '/admin/policies/list', description: 'Manage policies' },
    { title: 'Premiums', icon: 'bi-cash-stack', path: '/admin/premiums/schedule', description: 'Premium schedules' },
    { title: 'Payments', icon: 'bi-credit-card', path: '/admin/payments/history', description: 'Payment history' },
    { title: 'Claims', icon: 'bi-clipboard-check', path: '/admin/claims/list', description: 'Review claims' },
    { title: 'Documents', icon: 'bi-folder', path: '/admin/documents/customer', description: 'Manage documents' },
    { title: 'Reports', icon: 'bi-bar-chart', path: '/admin/reports/policy', description: 'Business reports' }
  ];
}
