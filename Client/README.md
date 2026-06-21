# Job Portal Frontend

React + Vite + Tailwind v4 + Redux Toolkit + Axios

## Setup

```bash
npm install
npm run dev
```

Make sure your Auth Service is running on http://localhost:8000 (configurable in `.env`).

## Structure

- `src/services/axios` - per-backend-service axios instances with interceptors (JWT attach, 401/403/500 handling)
- `src/store` - Redux store
- `src/features/auth` - auth slice, API calls, and pages (Login, Register, Forgot/Reset Password)
- `src/schemas` - Zod validation schemas
- `src/components/ui` - reusable UI primitives
- `src/components/layout` - layout components (ProtectedRoute, etc.)

## Next steps

User Service (profile, skills, resume) and Job Service (jobs, companies, applications, dashboards) integration to follow.
