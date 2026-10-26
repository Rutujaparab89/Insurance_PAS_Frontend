# Customer management setup

## Run frontend

1. Use Node.js 22.22.3+ (required by the Angular 22 dependencies in this project).
2. Run `npm ci`.
3. Run `npm start` and open `http://localhost:4200/login`.
4. The Angular proxy forwards `/api` to `http://localhost:8082`.

## Customer flows

- Admin: open Sidebar > Customer > Customer List. Admin can view customers and use Add Customer.
- Agent: open Sidebar > Customer > Customer List. Agent can view customers only; no Add Customer action is shown.
- Add Customer calls `POST /api/v1/users` with `roleName: CUSTOMER`.
- Customer details call `GET /api/v1/users/{id}`.
- Login field label remains `Username`, but its value must be the registered email address.

Backend access controls must remain enabled; frontend route guards alone are not security controls.
