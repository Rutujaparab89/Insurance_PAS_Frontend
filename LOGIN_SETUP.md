# Authentication frontend setup

This frontend uses the supplied Spring Boot Auth Service contract. Login sends `POST /api/v1/auth/login` with `{ "username": "...", "password": "..." }`. The backend returns an `ApiResponse` wrapper whose `data` contains `accessToken`, `refreshToken`, and `user` (including `role`).

## Run
1. Start the Auth Service on `http://localhost:8082`.
2. In this folder run `npm install` (if needed).
3. Run `npm start`. The Angular dev server uses `proxy.conf.json` to forward `/api` requests to port 8082, avoiding browser CORS issues during local development.
4. Open `http://localhost:4200/login`.

The access token is attached to subsequent API calls by an HTTP interceptor. The login response role redirects to `/admin/dashboard`, `/agent/dashboard`, or `/customer/dashboard`. Route guards require login and enforce the matching role. Logout revokes the refresh token through the backend when possible and clears the local session.

This is client-side route protection for navigation, not a replacement for authorization in the backend.
