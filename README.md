# BusyBuy (BusyBuy-2)

A small React e-commerce demo app that displays products, supports user authentication (Firebase), a shopping cart, and orders. It uses Firestore as the primary data store and includes a local `src/utils/data.js` fallback dataset so the app works without a populated Firestore.

## What this project does

- Displays a product catalog (local data or Firestore).
- Allows users to sign up / sign in using Firebase Authentication (config present under `src/config/firebase.js`).
- Stores user cart data in a `usersCart` Firestore collection.
- Stores products in a `products` Firestore collection. The repo includes `src/utils/data.js` as a local dataset and utilities in `src/utils/utils.js` to seed or fetch products.
- Routes: `/` (Home), `/signup`, `/signin`, `/cart`, `/myorders` and a catch-all 404.

## Project structure (high level)

- `src/` - React source
  - `components/` - UI components (Navbar, Product grid, Product details, etc.)
  - `context/` - React context (Auth, Products)
  - `pages/` - Route pages (HomePage, CartPage, OrdersPage...)
  - `config/firebase.js` - Firebase initialization
  - `utils/data.js` - Local product dataset (used as fallback)
  - `utils/utils.js` - Helper utilities: seeding and Firestore helpers

## Notable files

- `src/utils/utils.js`
  - `addDataToCollection()` — helper to batch-write local `data` into Firestore `products` collection (run once to seed DB).
  - `getProductsUsingProductIds(cart)` — improved to batch Firestore `in` queries (Firestore supports up to 10 values per `in` query). Falls back to local data when Firestore returns nothing or on error.
  - `getUserCartProducts(uid)` — safely reads a user's cart document and returns a consistent shape when the document does not exist.

- `src/config/firebase.js` — contains Firebase config. Note: the repository currently contains the config values directly; consider moving sensitive keys into environment variables for production.

## Fixes and improvements I made

1. Corrected `storageBucket` in `src/config/firebase.js` to `busybuy-fe33d.appspot.com` (the previous value used an incorrect domain `firebasestorage.app`).
2. Hardened `getUserCartProducts` to handle missing UID, Firestore errors, and missing documents — it now returns `{ docRef, data: null }` when the document doesn't exist.
3. Upgraded `getProductsUsingProductIds` to split product ID lists into batches of 10 and perform multiple `in` queries to Firestore, because Firestore limits `in` to 10 elements. The function still falls back to the local `data` if Firestore returns no results or on error.

These are small, low-risk, backwards-compatible improvements.

## How to run (development)

Prerequisites
- Node.js (recommended LTS)
- npm or yarn

From the project root in a terminal:

1. Install dependencies

```powershell
npm install
```

Note for PowerShell users: you may see an error like `cannot be loaded because running scripts is disabled on this system`. This is an ExecutionPolicy restriction in PowerShell that prevents the npm shim (`npm.ps1`) from running. You have a few options:

- Run the commands in a different shell (Command Prompt, Git Bash, or Windows Terminal configured to use bash).
- Change the execution policy for your user (requires PowerShell):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run `npm install` again.

2. Start the dev server

```powershell
npm start
```

3. Open the app at http://localhost:3000

## Firebase setup

The project currently includes a Firebase configuration in `src/config/firebase.js`. For production or public repos you should avoid committing API keys in source control. Recommended approach:

- Replace the config there with environment variables. For example, use a `.env` file with `REACT_APP_FIREBASE_API_KEY=...` and reference `process.env.REACT_APP_FIREBASE_API_KEY` in the config.

- Secure your Firestore rules so that only authenticated users can read/write their own carts and only admin users can seed the `products` collection.

Seeding Firestore products
- The helper `addDataToCollection()` in `src/utils/utils.js` will batch-write the contents of `src/utils/data.js` into the `products` collection. This is intended to be run once from a development environment.
- To run it safely: temporarily import and call `addDataToCollection()` from a dev-only route or a `useEffect` in a component, run it, and remove the call once the data is populated. Alternatively, create a small Node script that imports the module (note: the project uses ES module import syntax and React build tooling, so creating a standalone Node script may require small adjustments).

## Known issues / notes

- ✅ Build verified: I successfully ran `npm install` and `npm run build` using Command Prompt. The project builds without errors and creates an optimized production build in the `build/` folder.

- Firebase config values are present in plaintext in `src/config/firebase.js`. While Firebase API keys are not secret by themselves, it's better to place them in environment variables and secure Firestore rules.

## Next steps (suggested)

- Move Firebase config into environment variables and update `src/config/firebase.js` to read from `process.env`.
- Add a small `scripts/seed-firestore.js` (Node script) or a secure admin-only route to seed the `products` collection using `addDataToCollection()`.
- Add unit tests for utilities in `src/utils` and snapshot tests for main components.
- Add CI (GitHub Actions) that runs `npm ci` and `npm run build` to verify changes in PRs.

## Contact / Author

This README was generated by a code assistant that inspected the repository and applied a few low-risk fixes. If you want, I can also:

- Move Firebase config to environment variables and create a small seed script.
- Add a CI workflow for GitHub Actions.

Happy to help with the next step — tell me which you'd like me to do next.
