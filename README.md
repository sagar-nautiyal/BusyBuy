# BusyBuy (BusyBuy-2)

A small React e-commerce demo app that displays products, supports user authentication (Firebase), a shopping cart, and orders. It uses Firestore as the primary data store and includes a local `src/utils/data.js` fallback dataset so the app works without a populated Firestore.

## Tech Stack

### Frontend
- **React 18.2.0** - UI library for building user interfaces
- **React Router DOM 6.9.0** - Client-side routing for single page application
- **React Context API** - State management for authentication and products
- **CSS Modules** - Component-scoped styling
- **React Toastify 9.1.1** - Toast notifications for user feedback
- **React Spinners 0.13.8** - Loading indicators and spinners

### Backend & Database
- **Firebase 9.23.0** - Backend-as-a-Service platform
- **Firestore** - NoSQL document database for storing products and user carts
- **Firebase Authentication** - User authentication and authorization

### Development & Build Tools
- **Create React App (react-scripts 5.0.1)** - React development environment and build tool
- **Node.js & npm** - JavaScript runtime and package manager
- **Git** - Version control system

### Testing & Quality
- **Jest** - JavaScript testing framework (via react-scripts)
- **React Testing Library** - Testing utilities for React components
- **ESLint** - Code linting and formatting

### Additional Libraries
- **Axios 1.3.4** - HTTP client for API requests
- **Cypress 12.17.3** - End-to-end testing framework

### Deployment Ready
- **Environment Variables** - Secure configuration management
- **Production Build** - Optimized bundle for deployment
- **Static Hosting Compatible** - Works with Netlify, Vercel, GitHub Pages, etc.

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

- `src/config/firebase.js` — Firebase configuration that reads from environment variables for security. See `.env.example` for required variables.

## Fixes and improvements I made

1. **🔒 Security Fix:** Moved Firebase configuration to environment variables in `src/config/firebase.js`. All sensitive config values are now loaded from `.env` file instead of being hardcoded.
2. Corrected `storageBucket` in Firebase config to use the correct `.appspot.com` domain.
3. Hardened `getUserCartProducts` to handle missing UID, Firestore errors, and missing documents — it now returns `{ docRef, data: null }` when the document doesn't exist.
4. Upgraded `getProductsUsingProductIds` to split product ID lists into batches of 10 and perform multiple `in` queries to Firestore, because Firestore limits `in` to 10 elements. The function still falls back to the local `data` if Firestore returns no results or on error.

These are small, low-risk, backwards-compatible improvements with a major security enhancement.

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

**🔒 Security Note:** Firebase configuration has been moved to environment variables for security.

### Setup Steps:

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your Firebase config values in `.env`:**
   - Go to your Firebase Console → Project Settings → General tab
   - Scroll down to "Your apps" section 
   - Copy the config values and paste them into `.env`

3. **The `.env` file should look like:**
   ```env
   REACT_APP_FIREBASE_API_KEY=your_actual_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

**Important:** Never commit the `.env` file to version control. It's already included in `.gitignore`.

### Firestore Security Rules
- Secure your Firestore rules so that only authenticated users can read/write their own carts and only admin users can seed the `products` collection.

Seeding Firestore products
- The helper `addDataToCollection()` in `src/utils/utils.js` will batch-write the contents of `src/utils/data.js` into the `products` collection. This is intended to be run once from a development environment.
- To run it safely: temporarily import and call `addDataToCollection()` from a dev-only route or a `useEffect` in a component, run it, and remove the call once the data is populated. Alternatively, create a small Node script that imports the module (note: the project uses ES module import syntax and React build tooling, so creating a standalone Node script may require small adjustments).

## Known issues / notes

- ✅ Build verified: I successfully ran `npm install` and `npm run build` using Command Prompt. The project builds without errors and creates an optimized production build in the `build/` folder.

- ✅ Security: Firebase configuration has been moved to environment variables. The `.env` file is excluded from version control to protect sensitive configuration values.

## Next steps (suggested)

- Set up Firestore security rules to restrict access appropriately.
- Add a small `scripts/seed-firestore.js` (Node script) or a secure admin-only route to seed the `products` collection using `addDataToCollection()`.
- Add unit tests for utilities in `src/utils` and snapshot tests for main components.
- Add CI (GitHub Actions) that runs `npm ci` and `npm run build` to verify changes in PRs.

## Contact / Author

This README was generated by a code assistant that inspected the repository and applied a few low-risk fixes. If you want, I can also:

- Move Firebase config to environment variables and create a small seed script.
- Add a CI workflow for GitHub Actions.

Happy to help with the next step — tell me which you'd like me to do next.
