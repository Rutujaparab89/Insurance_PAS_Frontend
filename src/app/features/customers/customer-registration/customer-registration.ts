
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import {
  catchError,
  concatMap,
  finalize,
  from,
  map,
  of,
  switchMap,
  throwError,
  toArray
} from 'rxjs';

interface CustomerResponse {
  customerId?: number;
  id?: number;
  customerCode?: string;
}

interface CustomerRegistrationRequest {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  mobileNumber: string;
  email: string;
  occupation: string;
  employerName: string;
  employmentType: string;
  annualIncome: number;
  preferredContactMode: string;
}

interface DocumentUpload {
  documentType: string;
  file: File | null;
}

@Component({
  selector: 'app-customer-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './customer-registration.html'
})
export class CustomerRegistrationComponent {
  readonly today = new Date().toISOString().slice(0, 10);

  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  readonly occupations = [
    'SOFTWARE_ENGINEER',
    'TEACHER',
    'DOCTOR',
    'POLICE_OFFICER',
    'FIREFIGHTER',
    'MINER',
    'PILOT'
  ];

  readonly employmentTypes = ['PRIVATE', 'GOVERNMENT'];
  readonly contactModes = ['Mobile', 'Email', 'SMS'];
  readonly addressTypes = ['PERMANENT', 'COMMUNICATION'];

  readonly documentTypes = [
    { value: 'AADHAAR_CARD', label: 'Aadhaar Card' },
    { value: 'DRIVING_LICENSE', label: 'Driving License' },
    { value: 'PAN_CARD', label: 'PAN Card' },
    { value: 'PASSPORT_SIZE_PHOTO', label: 'Passport-size Photo' }
  ];

  readonly maxDocuments = 4;
  readonly maxFileSize = 5 * 1024 * 1024;

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    middleName: ['', [Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    dateOfBirth: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    maritalStatus: ['', [Validators.required]],

    mobileNumber: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
    ],

    email: ['', [Validators.required, Validators.email]],
    preferredContactMode: ['', [Validators.required]],
    occupation: ['', [Validators.required]],
    employerName: [''],
    employmentType: ['', [Validators.required]],

    annualIncome: [
      0,
      [Validators.required, Validators.min(0)]
    ],

    addressLine: ['', [Validators.required]],
    addressLine2: [''],
    city: ['', [Validators.required]],
    district: ['', [Validators.required]],
    state: ['', [Validators.required]],
    country: ['India', [Validators.required]],

    pincode: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]{5,10}$/)]
    ],

    addressType: ['PERMANENT', [Validators.required]]
  });

  readonly nomineeRelationships = [
    'Spouse',
    'Parent',
    'Child',
    'Brother',
    'Sister',
    'Other'
  ];

  nominees: {
    nomineeName: string;
    relationship: string;
    dateOfBirth: string;
    sharePercentage: number;
  }[] = [
    {
      nomineeName: '',
      relationship: '',
      dateOfBirth: '',
      sharePercentage: 100
    }
  ];

  // Start with one optional document entry.
  documentUploads: DocumentUpload[] = [
    {
      documentType: 'AADHAAR_CARD',
      file: null
    }
  ];

  loading = false;
  error = '';
  success = '';
  customerCode = '';

  get nomineeShareTotal(): number {
    return this.nominees.reduce(
      (sum, nominee) =>
        sum + (Number(nominee.sharePercentage) || 0),
      0
    );
  }

  get nomineeShareRemaining(): number {
    return Math.round(
      (100 - this.nomineeShareTotal) * 100
    ) / 100;
  }

  get selectedDocumentCount(): number {
    return this.documentUploads.filter(
      document => document.file !== null
    ).length;
  }

  addNominee(): void {
    if (
      this.nominees.length < 10 &&
      this.nomineeShareRemaining > 0
    ) {
      this.nominees.push({
        nomineeName: '',
        relationship: '',
        dateOfBirth: '',
        sharePercentage: this.nomineeShareRemaining
      });
    }
  }

  removeNominee(index: number): void {
    if (this.nominees.length <= 1) {
      return;
    }

    const removedShare =
      Number(this.nominees[index].sharePercentage) || 0;

    this.nominees.splice(index, 1);

    this.nominees[0].sharePercentage =
      Math.round(
        (Number(this.nominees[0].sharePercentage) +
          removedShare) * 100
      ) / 100;
  }

  // ---------------- DOCUMENT MANAGEMENT ----------------

  addDocument(): void {
    this.error = '';

    if (this.documentUploads.length >= this.maxDocuments) {
      return;
    }

    this.documentUploads.push({
      documentType: 'AADHAAR_CARD',
      file: null
    });
  }

  removeDocument(index: number): void {
    if (
      this.loading ||
      index < 0 ||
      index >= this.documentUploads.length
    ) {
      return;
    }

    this.documentUploads.splice(index, 1);

    // Keep one empty row available for optional document upload.
    if (this.documentUploads.length === 0) {
      this.documentUploads.push({
        documentType: 'AADHAAR_CARD',
        file: null
      });
    }
  }

  onDocumentTypeChange(index: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const document = this.documentUploads[index];

    if (document) {
      document.documentType = select.value;
    }
  }

  onDocumentFileChange(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const document = this.documentUploads[index];

    if (!document) {
      return;
    }

    this.error = '';

    if (!file) {
      document.file = null;
      return;
    }

    const extensionAllowed = /\.(pdf|jpe?g|png)$/i.test(file.name);

    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png'
    ];

    const mimeAllowed =
      !file.type || allowedMimeTypes.includes(file.type);

    if (!extensionAllowed || !mimeAllowed) {
      this.error =
        `Document ${index + 1}: only PDF, JPG, JPEG and PNG files are supported.`;

      input.value = '';
      document.file = null;
      return;
    }

    if (file.size > this.maxFileSize) {
      this.error =
        `Document ${index + 1}: file size must not exceed 5 MB.`;

      input.value = '';
      document.file = null;
      return;
    }

    document.file = file;
  }

  // ---------------- REGISTRATION SUBMISSION ----------------

  submit(): void {
    this.error = '';
    this.success = '';
    this.customerCode = '';

    if (this.loading) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error =
        'Please complete all required fields correctly.';
      return;
    }

    const invalidNominee = this.nominees.some(
      nominee =>
        !nominee.nomineeName.trim() ||
        !nominee.relationship.trim() ||
        !Number.isFinite(Number(nominee.sharePercentage)) ||
        Number(nominee.sharePercentage) <= 0 ||
        Number(nominee.sharePercentage) > 100
    );

    if (
      invalidNominee ||
      Math.abs(this.nomineeShareTotal - 100) > 0.001
    ) {
      this.error =
        'Enter all nominee details and make sure nominee shares total exactly 100%.';
      return;
    }

    const v = this.form.getRawValue();

    const request: CustomerRegistrationRequest = {
      firstName: v.firstName.trim(),
      middleName: v.middleName.trim(),
      lastName: v.lastName.trim(),
      dateOfBirth: v.dateOfBirth,
      gender: v.gender,
      maritalStatus: v.maritalStatus,
      mobileNumber: v.mobileNumber,
      email: v.email.trim(),
      preferredContactMode: v.preferredContactMode,
      occupation: v.occupation,
      employerName: v.employerName.trim(),
      employmentType: v.employmentType,
      annualIncome: Number(v.annualIncome)
    };

    const documentsToUpload = this.documentUploads.filter(
      (
        document
      ): document is DocumentUpload & { file: File } =>
        document.file !== null
    );

    this.loading = true;

    this.http.post<any>(
      '/api/v1/customers',
      request
    ).pipe(
      map(response => response?.data ?? response),

      switchMap((customer: CustomerResponse) => {
        const id = customer?.customerId ?? customer?.id;

        if (!id || !Number.isSafeInteger(Number(id))) {
          return throwError(
            () => new Error(
              'Customer API did not return a valid customerId. Check the POST /api/v1/customers response.'
            )
          );
        }

        const customerId = Number(id);
        this.customerCode = customer.customerCode || '';

        const addressPayload = {
          addressLine: v.addressLine.trim(),
          addressLine2: v.addressLine2.trim(),
          city: v.city.trim(),
          district: v.district.trim(),
          state: v.state.trim(),
          country: v.country.trim(),
          pincode: v.pincode,
          addressType: v.addressType
        };

        // Save address, then nominees, then documents sequentially.
        return this.http.post<any>(
          `/api/v1/customers/${customerId}/addresses`,
          addressPayload
        ).pipe(
          switchMap(() =>
            from(this.nominees).pipe(
              concatMap(nominee =>
                this.http.post<any>(
                  `/api/v1/customers/${customerId}/nominees`,
                  {
                    nomineeName: nominee.nomineeName.trim(),
                    relationship: nominee.relationship.trim(),

                    ...(nominee.dateOfBirth
                      ? { dateOfBirth: nominee.dateOfBirth }
                      : {}),

                    sharePercentage: Number(
                      nominee.sharePercentage
                    )
                  }
                )
              ),
              toArray()
            )
          ),

          switchMap(() =>
            from(documentsToUpload).pipe(
              concatMap(document => {
                const data = new FormData();

                data.append(
                  'documentType',
                  document.documentType
                );

                data.append('file', document.file);

                return this.http.post<any>(
                  `/api/v1/customers/${customerId}/documents`,
                  data
                );
              }),
              toArray()
            )
          ),

          map(() => ({
            customerId,
            customerCode: customer.customerCode || '',
            uploadedDocuments: documentsToUpload.length
          }))
        );
      }),

      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: result => {
        const documentMessage =
          result.uploadedDocuments === 0
            ? ' No documents were uploaded.'
            : ` ${result.uploadedDocuments} document(s) uploaded successfully.`;

        this.success =
          'Customer registration, address and nominee details saved successfully.' +
          documentMessage;

        this.form.reset({
          firstName: '',
          middleName: '',
          lastName: '',
          dateOfBirth: '',
          gender: '',
          maritalStatus: '',
          mobileNumber: '',
          email: '',
          preferredContactMode: '',
          occupation: '',
          employerName: '',
          employmentType: '',
          annualIncome: 0,
          addressLine: '',
          addressLine2: '',
          city: '',
          district: '',
          state: '',
          country: 'India',
          pincode: '',
          addressType: 'PERMANENT'
        });

        this.nominees = [
          {
            nomineeName: '',
            relationship: '',
            dateOfBirth: '',
            sharePercentage: 100
          }
        ];

        this.documentUploads = [
          {
            documentType: 'AADHAAR_CARD',
            file: null
          }
        ];
      },

      error: err => {
        console.error(
          '[CustomerRegistration] Submission failed:',
          err
        );

        this.error =
          err?.error?.message ||
          err?.error?.data?.message ||
          err?.message ||
          'Registration failed. Check the browser Network tab and Customer Service logs.';
      }
    }).add(() => {
      // Ensure the component state is refreshed after completion.
    });
  }
}
