import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, take, TimeoutError } from 'rxjs';

import {
  CustomerApiService,
  CustomerRecord
} from '../customer-api.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-list.html'
})
export class CustomerListComponent implements OnInit {
  private readonly api = inject(CustomerApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  customers: CustomerRecord[] = [];
  loading = false;
  error = '';
  search = '';

  readonly isAdmin =
    this.auth.normalizeRole(this.auth.getUser()?.role) === 'ADMIN';

  get filteredCustomers(): CustomerRecord[] {
    const q = this.search.trim().toLowerCase();

    return this.customers.filter(customer => {
      if (!q) return true;

      return [
        customer.username,
        customer.email,
        customer.mobile,
        String(customer.id)
      ].some(value =>
        String(value ?? '').toLowerCase().includes(q)
      );
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    console.log('[CustomerList] Requesting GET /api/v1/customers');

    this.api.listCustomers()
      .pipe(
        take(1),
        finalize(() => {
          this.loading = false;
          // Explicitly update the view after success, error, or timeout.
          this.cdr.detectChanges();
          console.log('[CustomerList] Request finished; loading = false');
        })
      )
      .subscribe({
        next: (rows: CustomerRecord[]) => {
          console.log('[CustomerList] Received customer rows:', rows);
          this.customers = rows;
          this.error = '';
          this.cdr.detectChanges();
        },
        error: (err: unknown) => {
          console.error('[CustomerList] API request failed:', err);
          this.customers = [];
          this.error = this.getErrorMessage(err);
          this.cdr.detectChanges();
        }
      });
  }

  private getErrorMessage(err: unknown): string {
    if (
      err instanceof TimeoutError ||
      (err as any)?.name === 'TimeoutError'
    ) {
      return 'The customer API did not respond within 15 seconds. Please retry.';
    }

    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return 'Cannot reach the customer API. Check the backend and proxy configuration.';
      }
      if (err.status === 401 || err.status === 403) {
        return 'You are not authorized to view customers. Sign in again and retry.';
      }
      if (err.status === 404) {
        return 'Customer API endpoint not found. Verify GET /api/v1/customers.';
      }
      return `Could not load customers (HTTP ${err.status}). ${
        err.error?.message || err.message || 'Please retry.'
      }`;
    }

    return err instanceof Error
      ? err.message
      : 'An unexpected error occurred while loading customers.';
  }

  viewCustomer(customer: CustomerRecord): void {
    const prefix = this.isAdmin ? '/admin' : '/agent';
    this.router.navigate([prefix, 'customers', customer.id]);
  }
}
