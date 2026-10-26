
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CustomerApiService } from '../customer-api.service';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './customer-create.html'
})
export class CustomerCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(CustomerApiService);

  readonly form = this.fb.nonNullable.group({
    username: [
      '',
      [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-z0-9]+$/)
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(150)
      ]
    ],
    mobile: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{10,20}$/)
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(72)
      ]
    ]
  });

  loading = false;
  error = '';
  success = '';
  createdEmail = '';

  submit(): void {
    if (this.loading) {
      return;
    }

    this.error = '';
    this.success = '';
    this.createdEmail = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const username = value.username.trim();
    const email = value.email.trim();
    const mobile = value.mobile.trim();
    const password = value.password;

    this.loading = true;

    this.api.createCustomer({
      username,
      email,
      mobile,
      password,
      roleName: 'CUSTOMER'
    })
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.createdEmail = email;
          this.success =
            'Temporary customer login created successfully. ' +
            'The customer can log in using the registered email ' +
            'and temporary password, then complete Customer Registration. ' +
            'The customer profile will appear in the Admin and Agent ' +
            'Customer Lists after registration is submitted.';

          this.form.reset({
            username: '',
            email: '',
            mobile: '',
            password: ''
          });
        },

        error: (err) => {
          console.error(
            '[CustomerCreate] Failed to create temporary customer login:',
            err
          );

          const backendMessage =
            err?.error?.message ??
            err?.error?.data?.message ??
            err?.error?.error ??
            '';

          if (err?.status === 409) {
            this.error =
              backendMessage ||
              'An account with this username, email, or mobile number ' +
              'may already exist. Please verify the existing account ' +
              'or use unique details.';
          } else if (err?.status === 400) {
            this.error =
              backendMessage ||
              'The submitted details are invalid. Please check the form.';
          } else if (err?.status === 401 || err?.status === 403) {
            this.error =
              'You are not authorized to create customer accounts. ' +
              'Please log in with an Admin account.';
          } else if (err?.status === 0) {
            this.error =
              'Cannot connect to the Auth Service. Check that the ' +
              'Auth Service and API Gateway are running.';
          } else {
            this.error =
              backendMessage ||
              'Could not create the temporary customer login. ' +
              'Please check the Auth Service logs and try again.';
          }
        }
      });
  }
}
