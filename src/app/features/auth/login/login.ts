
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.nonNullable.group({
    username: [
      '',
      [Validators.required, Validators.email]
    ],
    password: [
      '',
      [Validators.required]
    ]
  });

  loading = false;
  showPassword = false;
  errorMessage = '';

  submit(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.loading) {
      return;
    }

    this.loading = true;

    const { username, password } = this.form.getRawValue();

    this.auth.login(username.trim(), password)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          const user = this.auth.getUser();
          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl');

          const home = this.auth.dashboardUrl(user?.role);

          const safeReturn =
            returnUrl &&
            returnUrl.startsWith('/') &&
            !returnUrl.startsWith('//')
              ? returnUrl
              : home;

          void this.router.navigateByUrl(safeReturn || home);
        },

        error: (err: HttpErrorResponse | Error) => {
          const backendMessage =
            err instanceof HttpErrorResponse
              ? err.error?.message || err.error?.error
              : err.message;

          this.errorMessage =
            backendMessage ||
            'Unable to sign in. Check your email and password, then try again.';
        }
      });
  }
}
