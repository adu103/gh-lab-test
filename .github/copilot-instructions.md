# Project Guidelines

React and TypeScript service-request tracker using Vite.

- Write strict, type-safe TypeScript. Never use `any`; narrow `unknown`
  when needed. Reuse domain types from `src/types.ts`.
- Use React functional components and hooks. Follow existing controlled-form
  and immutable state-update patterns in `src/App.tsx`.
- Keep business logic in pure functions in `src/lib`. Pass time-dependent
  values explicitly to keep behavior deterministic.
- Cover business-logic changes and relevant edge cases with colocated Vitest
  tests, following `src/lib/requests.test.ts`.
- Use semantic HTML, associated form labels, accessible button names,
  native controls, and visible keyboard focus. Never rely on color alone.
- Reuse CSS variables from `src/index.css` and the existing visual style
  and responsive layouts in `src/App.css`.
- Keep changes focused. Reuse existing utilities and add dependencies only
  when necessary; explain the need for each addition.
- Run `npm test`, `npm run lint`, and `npm run build` before declaring work
  complete. Report failures or checks that could not run.