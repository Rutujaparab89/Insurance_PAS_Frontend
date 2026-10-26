
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customer-dashboard.html'
})
export class CustomerDashboard {
  readonly cards = [
    { title: 'My Profile', icon: 'bi-person', path: '/customer/profile/personal' },
    { title: 'Insurance Products', icon: 'bi-shield-check', path: '/customer/products/health' },
    { title: 'My Quotes', icon: 'bi-file-earmark-text', path: '/customer/quotes/my-quotes' },
    { title: 'My Policies', icon: 'bi-journal-check', path: '/customer/policies/active' },
    { title: 'Premiums', icon: 'bi-credit-card', path: '/customer/premiums/paid' },
    { title: 'Claims', icon: 'bi-clipboard-check', path: '/customer/claims/status' },
    { title: 'Documents', icon: 'bi-folder', path: '/customer/documents/upload' },
    { title: 'Support', icon: 'bi-headset', path: '/customer/support/request' },
    { title: 'Customer Registration', icon: 'bi-person-plus', path: '/customer/registration' }
  ];
}
