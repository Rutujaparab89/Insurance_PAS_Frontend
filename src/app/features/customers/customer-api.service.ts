
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout } from 'rxjs';

export interface CustomerRecord {
  id: number;
  username: string;
  email: string;
  mobile?: string;
  mobileNumber?: string;
  status?: string;
  role?: string;

  customerId?: number;
  customerCode?: string;
  customerStatus?: string;

  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;

  preferredContactMode?: string;

  employmentType?: string;
  employerName?: string;
  occupation?: string;
  annualIncome?: number;
}

export interface CustomerNominee {
  nomineeId: number;
  customerId: number;
  nomineeName: string;
  relationship: string;
  dateOfBirth?: string;
  sharePercentage?: number;
}

export interface CustomerDocument {
  documentId: number;
  customerId: number;
  documentType: string;
  fileName: string;
  filePath: string;
  uploadedDate?: string;
  verificationStatus?: string;
}

export interface CreateCustomerRequest {
  username: string;
  password: string;
  email: string;
  mobile: string;
  roleName: 'CUSTOMER';
}

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {
  private readonly http = inject(HttpClient);

  private readonly customersApi = '/api/v1/customers';
  private readonly usersApi = '/api/v1/users';

  /**
   * Unwrap common API response formats.
   * Supports plain responses and wrappers containing data.
   */
  private unwrap(response: any): any {
    let value = response;

    for (let i = 0; i < 5; i++) {
      if (
        value &&
        !Array.isArray(value) &&
        typeof value === 'object' &&
        Object.prototype.hasOwnProperty.call(value, 'data') &&
        value.data !== undefined
      ) {
        value = value.data;
      } else {
        break;
      }
    }

    return value;
  }

  /**
   * Extract arrays from common API response formats.
   */
  private getListRows(response: any): any[] {
    const body = this.unwrap(response);

    if (Array.isArray(body)) {
      return body;
    }

    if (Array.isArray(body?.content)) {
      return body.content;
    }

    if (Array.isArray(body?.customers)) {
      return body.customers;
    }

    if (Array.isArray(body?.items)) {
      return body.items;
    }

    if (Array.isArray(body?.results)) {
      return body.results;
    }

    if (Array.isArray(body?.nominees)) {
      return body.nominees;
    }

    if (Array.isArray(body?.documents)) {
      return body.documents;
    }

    throw new Error(
      'Unexpected API response. Check the browser Network response.'
    );
  }

  /**
   * Convert a customer API response into CustomerRecord.
   */
  private toRecord(c: any): CustomerRecord {
    if (!c || typeof c !== 'object' || Array.isArray(c)) {
      throw new Error('Invalid customer object returned by the API.');
    }

    const rawId =
      c.customerId ??
      c.customer_id ??
      c.userId ??
      c.user_id ??
      c.id;

    const id = Number(rawId);

    const firstName = String(
      c.firstName ?? c.first_name ?? ''
    );

    const middleName = String(
      c.middleName ?? c.middle_name ?? ''
    );

    const lastName = String(
      c.lastName ?? c.last_name ?? ''
    );

    const mobile = String(
      c.mobileNumber ??
      c.mobile_number ??
      c.mobile ??
      c.phoneNumber ??
      c.phone_number ??
      ''
    );

    const status = String(
      c.customerStatus ??
      c.customer_status ??
      c.status ??
      'UNKNOWN'
    );

    const roleValue =
      typeof c.role === 'object' && c.role !== null
        ? c.role.name
        : c.role;

    return {
      id,

     username:
  c.username ??
  (
    [firstName, middleName, lastName]
      .filter(value => value.trim().length > 0)
      .join(' ') ||
    c.fullName ||
    c.full_name ||
    c.name ||
    '—'
  ),
      email: String(
        c.email ??
        c.emailAddress ??
        c.email_address ??
        ''
      ),

      mobile,
      mobileNumber: mobile,
      status,
      role: roleValue ?? c.roleName ?? c.role_name ?? 'CUSTOMER',

      customerId: Number.isSafeInteger(id) ? id : undefined,

      customerCode:
        c.customerCode ?? c.customer_code,

      customerStatus: status,

      firstName,
      middleName,
      lastName,

      dateOfBirth:
        c.dateOfBirth ?? c.date_of_birth,

      gender: c.gender,

      maritalStatus:
        c.maritalStatus ?? c.marital_status,

      preferredContactMode:
        c.preferredContactMode ??
        c.preferred_contact_mode,

      employmentType:
        c.employmentType ?? c.employment_type,

      employerName:
        c.employerName ?? c.employer_name,

      occupation: c.occupation,

      annualIncome:
        c.annualIncome != null
          ? Number(c.annualIncome)
          : c.annual_income != null
            ? Number(c.annual_income)
            : undefined
    };
  }

  /**
   * GET /api/v1/customers
   * Retrieve registered customer profiles.
   */
  listCustomers(): Observable<CustomerRecord[]> {
    return this.http
      .get<any>(this.customersApi)
      .pipe(
        timeout(15000),
        map(response => {
          console.log(
            '[CustomerApiService] Raw customer list:',
            response
          );

          return this.getListRows(response)
            .map(item => this.toRecord(item))
            .filter(
              customer =>
                Number.isSafeInteger(customer.id) &&
                customer.id > 0
            );
        })
      );
  }

  /**
   * GET /api/v1/customers/{id}
   * Retrieve a registered customer profile.
   */
  getCustomer(id: number): Observable<CustomerRecord> {
    if (!Number.isSafeInteger(id) || id < 1) {
      throw new Error('A valid customer ID is required.');
    }

    return this.http
      .get<any>(`${this.customersApi}/${id}`)
      .pipe(
        timeout(15000),
        map(response => {
          console.log(
            '[CustomerApiService] Raw customer details:',
            response
          );

          const body = this.unwrap(response);
          const record = body?.customer ?? body;
          const customer = this.toRecord(record);

          if (
            !Number.isSafeInteger(customer.id) ||
            customer.id < 1
          ) {
            throw new Error(
              'Customer response does not contain a valid ID.'
            );
          }

          return customer;
        })
      );
  }

  /**
   * GET /api/v1/customers/{id}/nominees
   */
  listCustomerNominees(
    customerId: number
  ): Observable<CustomerNominee[]> {
    return this.http
      .get<any>(
        `${this.customersApi}/${customerId}/nominees`
      )
      .pipe(
        timeout(15000),
        map(response => {
          console.log(
            '[CustomerApiService] Customer nominees:',
            response
          );

          return this.getListRows(response);
        })
      );
  }

  /**
   * GET /api/v1/customers/{id}/documents
   */
  listCustomerDocuments(
    customerId: number
  ): Observable<CustomerDocument[]> {
    return this.http
      .get<any>(
        `${this.customersApi}/${customerId}/documents`
      )
      .pipe(
        timeout(15000),
        map(response => {
          console.log(
            '[CustomerApiService] Customer documents:',
            response
          );

          return this.getListRows(response);
        })
      );
  }

  /**
   * POST /api/v1/users
   * Create a temporary customer login account only.
   */
  createCustomer(
    request: CreateCustomerRequest
  ): Observable<CustomerRecord> {
    return this.http
      .post<any>(this.usersApi, request)
      .pipe(
        timeout(15000),
        map(response => {
          console.log(
            '[CustomerApiService] Created customer login:',
            response
          );

          const body = this.unwrap(response);
          const record = body?.user ?? body?.customer ?? body;

          return this.toRecord(record);
        })
      );
  }
}
