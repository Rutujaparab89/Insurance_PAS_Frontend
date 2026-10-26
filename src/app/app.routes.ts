
import { Routes } from '@angular/router';

import { AdminLayout } from './layout/dashboard/admin/admin-layout/admin-layout';
import { AgentLayout } from './layout/dashboard/agent/agent-layout/agent-layout';
import { CustomerLayout } from './layout/dashboard/customer/customer-layout/customer-layout';

import { AdminDashboard } from './layout/dashboard/admin/admin-dashboard/admin-dashboard';
import { AgentDashboard } from './layout/dashboard/agent/agent-dashboard/agent-dashboard';
import { CustomerDashboard } from './layout/dashboard/customer/customer-dashboard/customer-dashboard';

import { LoginComponent } from './features/auth/login/login';
import { authGuard, guestGuard, roleGuard } from './core/guards/auth.guard';

import { CustomerListComponent } from './features/customers/customer-list/customer-list';
import { CustomerDetailComponent } from './features/customers/customer-detail/customer-detail';
import { CustomerCreateComponent } from './features/customers/customer-create/customer-create';
import { CustomerRegistrationComponent } from './features/customers/customer-registration/customer-registration';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },


  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'customers', component: CustomerListComponent },
      { path: 'customers/new', component: CustomerCreateComponent },
      { path: 'customers/:id', component: CustomerDetailComponent }
    ]
  },
 

  {
    path: 'agent',
    component: AgentLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['AGENT'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AgentDashboard },
      { path: 'customers', component: CustomerListComponent },
      { path: 'customers/:id', component: CustomerDetailComponent }
    ]
  },

  {
    path: 'customer',
    component: CustomerLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CUSTOMER'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: CustomerDashboard },
      { path: 'registration', component: CustomerRegistrationComponent }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: '**', redirectTo: 'login' }
];
