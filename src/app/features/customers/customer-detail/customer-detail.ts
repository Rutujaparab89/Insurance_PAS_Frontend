
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone,
  inject
} from '@angular/core';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, catchError, finalize } from 'rxjs';

import {
  CustomerApiService,
  CustomerRecord,
  CustomerDocument,
  CustomerNominee
} from '../customer-api.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './customer-detail.html'
})
export class CustomerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(CustomerApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);

  customer: CustomerRecord | null = null;
  documents: CustomerDocument[] = [];
  nominees: CustomerNominee[] = [];

  loading = true;
  error = '';

  documentsLoading = false;
  nomineesLoading = false;

  documentsError = '';
  nomineesError = '';

  get backUrl(): string {
    return this.router.url.startsWith('/admin')
      ? '/admin/customers'
      : '/agent/customers';
  }

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id');

    if (!rawId || !/^\d+$/.test(rawId)) {
      this.loading = false;
      this.error = 'Invalid customer ID.';
      return;
    }

    const id = Number(rawId);

    if (!Number.isSafeInteger(id) || id < 1) {
      this.loading = false;
      this.error = 'Invalid customer ID.';
      return;
    }

    this.loadCustomer(id);
  }

  private loadCustomer(id: number): void {
    this.loading = true;
    this.error = '';
    this.customer = null;
    this.documents = [];
    this.nominees = [];

    this.api.getCustomer(id)
      .pipe(
        finalize(() => {
          this.zone.run(() => {
            this.loading = false;
            this.cdr.detectChanges();
          });
        })
      )
      .subscribe({
        next: customer => {
          this.zone.run(() => {
            this.customer = customer;
            this.cdr.detectChanges();

            // Load related information after customer details arrive.
            this.loadRelatedInformation(id);
          });
        },

        error: err => {
          this.zone.run(() => {
            console.error(
              '[CustomerDetail] Customer request failed:',
              err
            );

            this.error =
              err?.error?.message ||
              err?.message ||
              'Could not load customer details. Please try again.';

            this.cdr.detectChanges();
          });
        }
      });
  }

  private loadRelatedInformation(customerId: number): void {
    this.documentsLoading = true;
    this.nomineesLoading = true;

    this.documentsError = '';
    this.nomineesError = '';

    forkJoin({
      documents: this.api.listCustomerDocuments(customerId).pipe(
        catchError(err => {
          console.error(
            '[CustomerDetail] Document request failed:',
            err
          );

          this.documentsError =
            err?.error?.message ||
            'Unable to load customer documents.';

          return of([] as CustomerDocument[]);
        }),

        finalize(() => {
          this.zone.run(() => {
            this.documentsLoading = false;
            this.cdr.detectChanges();
          });
        })
      ),

      nominees: this.api.listCustomerNominees(customerId).pipe(
        catchError(err => {
          console.error(
            '[CustomerDetail] Nominee request failed:',
            err
          );

          this.nomineesError =
            err?.error?.message ||
            'Unable to load customer nominees.';

          return of([] as CustomerNominee[]);
        }),

        finalize(() => {
          this.zone.run(() => {
            this.nomineesLoading = false;
            this.cdr.detectChanges();
          });
        })
      )
    }).subscribe({
      next: result => {
        this.zone.run(() => {
          this.documents = result.documents;
          this.nominees = result.nominees;
          this.cdr.detectChanges();
        });
      },

      error: err => {
        console.error(
          '[CustomerDetail] Related information error:',
          err
        );
      }
    });
  }

  get fullName(): string {
    if (!this.customer) {
      return '';
    }

    return [
      this.customer.firstName,
      this.customer.middleName,
      this.customer.lastName
    ]
      .filter(value => !!value?.trim())
      .join(' ');
  }

  get displayName(): string {
    return this.fullName || this.customer?.username || '—';
  }

  nomineeName(nominee: CustomerNominee): string {
    return nominee.nomineeName || '—';
  }

  formatDate(value?: string): string {
    if (!value) {
      return '—';
    }

    return value;
  }

  goBack(): void {
    void this.router.navigateByUrl(this.backUrl);
  }
}
