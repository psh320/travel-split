# Travel Split

A mobile-friendly group expense tracker. Create a trip, share its room code,
record who paid and who participated, then calculate the smallest practical set
of settlement transfers. The app supports equal and exact-amount splits without
requiring user accounts.

## Local development

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Create a local `.env` with the Firebase web configuration:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`npm run build` validates these required values before producing a deployment.
`VITE_FIREBASE_MEASUREMENT_ID` or `VITE_GOOGLE_ANALYTICS_ID` may be added to
enable Google Analytics in production.

## Quality checks

```bash
npm run lint
npm test
npm run build
npm audit
```

`npm run check` runs lint, tests, and the production build in the same order as
the deployment workflows.

The calculation and mutation tests cover cent-accurate equal/custom shares,
settlements, participant removal, stored session data, and trip configuration.

## Code map

- `src/pages`: route-level screens and form orchestration
- `src/components`: reusable visual and UI components
- `src/services/firebase.ts`: Firestore reads, transactional writes, and the
  short-lived trip cache
- `src/services/currentTripSession.ts`: active trip/user context using the
  cross-browser storage fallback
- `src/services/groupHistory.ts`: validated recent-trip persistence
- `src/utils/expenses.ts`: equal/custom expense share calculation
- `src/utils/balanceCalculator.ts`: balances and settlement routes
- `src/utils/tripMutations.ts`: validated, testable trip mutation rules

Money is rounded and distributed in integer minor units so every split and
settlement remains cent-accurate. Writes that replace Firestore participant or
expense arrays run in transactions to avoid losing concurrent changes.

## Analytics privacy

The app sends its own sanitized SPA page views. Dynamic trip, room, and expense
identifiers are replaced with route patterns before analytics events are sent.

In Google Analytics, disable **Page changes based on browser history events**
under Admin → Data Streams → Web → Enhanced measurement → Page views → Advanced
settings. Leaving it enabled can double-count route changes and send the raw
dynamic URL through automatic page views.

## Deployment

```bash
npm run deploy
```

This builds the app and deploys Firebase Hosting to the configured project.
