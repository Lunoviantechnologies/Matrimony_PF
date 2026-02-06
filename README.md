# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Environment (avoid 403 in production)

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_URL` to your backend API base URL:
   - **Local:** `http://localhost:8080/api`
   - **Production:** `https://your-backend-domain.com/api` (no trailing slash)
3. On the **backend**, set CORS to allow your frontend origin (e.g. in `application-prod.properties` or env `CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com`). If the frontend origin is not allowed, the browser will get 403.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
