# API Gateway integration

This frontend is configured to send all `/api/**` calls through the API Gateway at `http://localhost:8080`. The Angular dev-server proxy is configured in `proxy.conf.json`.

## Run
1. Start Eureka, Auth Service, Customer Service, and API Gateway.
2. From this frontend folder, run `npm install` if dependencies are not installed.
3. Run `npm start` (the Angular development configuration uses `proxy.conf.json`).
4. Sign in again, then open `/agent/customers`.

The existing auth interceptor reads the access token through `AuthService.getAccessToken()` from `sessionStorage` using the `insurance_access_token` key and adds `Authorization: Bearer ...` to API requests.

Customer list API: `/api/v1/customers` -> Gateway `localhost:8080` -> explicit `lb://CUSTOMER-SERVICE` route.
Auth API: `/api/v1/auth/**` -> Gateway `localhost:8080` -> explicit `lb://AUTH-SERVICE` route.

If the customer API returns 403 after the proxy change, inspect the request in DevTools > Network and confirm the `Authorization` header is present. If it is present, review the role/authorization rules in the backend; changing the frontend cannot grant backend permissions.
