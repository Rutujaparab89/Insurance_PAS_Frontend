
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './agent-dashboard.html'
})
export class AgentDashboard {
  readonly cards = [
    { title: 'Customers', icon: 'bi-people', path: '/agent/customer/list' },
    { title: 'Generate Quote', icon: 'bi-file-earmark-plus', path: '/agent/quotes/generate' },
    { title: 'Policies', icon: 'bi-shield-check', path: '/agent/policies/list' },
    { title: 'Due Premiums', icon: 'bi-cash-stack', path: '/agent/premiums/due' },
    { title: 'Claims', icon: 'bi-clipboard-check', path: '/agent/claims/history' },
    { title: 'Documents', icon: 'bi-folder', path: '/agent/documents/kyc' },
    { title: 'Commission', icon: 'bi-wallet2', path: '/agent/commission/history' },
    { title: 'Profile', icon: 'bi-person-circle', path: '/agent/profile' }
  ];
}
