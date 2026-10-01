# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Plantify is a full-stack plant e-commerce site (a college project), set up as an npm-workspaces monorepo:

- `client/`: React 19 + Vite 8 + React Router 7. It uses plain JavaScript/JSX, with no TypeScript and no test framework. Auth is Clerk (`@clerk/clerk-react`) and icons come from `lucide-react`.
- `server/`: the Supabase project (Postgres schema, row-level security, the checkout function, seed data, storage bucket config). There is no custom API server; the client talks to Supabase directly with `@supabase/supabase-js`.

Supabase is configured with **Clerk as a third-party auth provider**. Users exist only in Clerk, and their Clerk user id arrives as the JWT `sub` claim, which SQL reads via `public.requesting_user_id()`. Tables store it in a `user_id text` column; there is no `auth.users` row.

## Commands

```bash
npm install                 # installs both workspaces
npm run dev -w client       # Vite dev server
npm run build               # production build of the client
npm run lint                # oxlint on the client (.oxlintrc.json; rules-of-hooks is an error)

cd server
npx supabase migration new <name>              # new SQL migration
npx supabase db push --dry-run                 # preview what would change on the linked project
npx supabase db push                           # apply migrations to the linked (hosted) project
npx supabase db push --include-seed            # ...and run supabase/seed.sql
npx supabase seed buckets --linked             # upload supabase/storage/product-images to the bucket

npm run build-setup -w server     # regenerate supabase/setup.sql (all migrations + seed) for the SQL Editor
npm run upload-images -w server   # upload product photos with the service key from server/.env
```

No tests are configured. The Supabase CLI isn't linked on this machine, so new migrations have been applied by pasting them into the dashboard SQL Editor. Secrets used by server scripts (`SUPABASE_SERVICE_ROLE_KEY`, optional `SUPABASE_DB_URL`) live in git-ignored `server/.env`; see `server/.env.example`. The root `npm run dev`/`db:*` scripts start a local Supabase in Docker, which needs `CLERK_DOMAIN` in `server/supabase/.env` (see `.env.example`).

**Required env (`client/.env`):** `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (the publishable key). `main.jsx` and `SupabaseProvider` throw at startup if any is missing.

## Database (`server/supabase/migrations/`)

- `products`: one table for plants and fertilizers (`type` enum). `images` holds object keys in the public `product-images` bucket, such as `plants/monstera.png`, not URLs.
- `cart_items`, `wishlist_items`: per user, enforced by RLS. A cart line is unique on `(user_id, product_id, size, pot_style)` with `nulls not distinct`; fertilizers have null size and pot style.
- `orders`, `order_items`: there is no insert policy. Orders are created only by the `place_order()` security-definer function, which prices the caller's cart from current product prices, snapshots the items and empties the cart. Users can update only `status`, and only admins pass that RLS check.
- `contact_messages`: written by the Contact page form, which anyone can insert into. Only admins can read it or toggle `handled`.
- `admins`: user ids that may manage products, upload images and change order status (`public.is_admin()`). Rows are added by hand in the SQL editor.
- Delivery and discount rules exist both in `place_order()` (authoritative) and `client/src/app/utils/cart.js` (display only). Keep them in sync.

## Client architecture (`client/src/`)

**Providers:** `main.jsx` nests them in this order: `ClerkProvider`, `SupabaseProvider`, `ProductsProvider`, `CartProvider`, `WishlistProvider`, `OrdersProvider`, then `<App/>`. Each domain in `app/Context/` has a `XContext.js` file (the context plus its `useX()` hook) and a matching `XProvider.jsx`. They're split so provider files only export components, which keeps oxlint's `only-export-components` rule happy.
- `SupabaseProvider` creates one client whose `accessToken` callback returns the current Clerk session token.
- `useProducts()` loads the whole catalog once and maps rows to camelCase component props (`toProduct` in `utils/products.js`, which also builds image URLs). It exposes `plants`, `fertilizers`, `allProducts` (admins also get hidden ones), `findProduct(type, id)` and `reload()`.
- `useCart()`: guests use localStorage (`plantify-guest-cart`), and signed-in users use `cart_items`. Updates are optimistic, and database writes go through an ordered queue (`cartStore.js`). The guest cart merges into the account on sign-in.
- `useWishlist()` and `useOrders()` are database-only. Guests pressing a heart get Clerk's sign-in modal. `placeOrder()` calls the `place_order` RPC.
- Provider state is tagged with the owning `userId`, so a previous user's data never flashes after an account switch.
- Effects that load data use `promise.then(setState)` rather than `async` functions, because oxlint's `set-state-in-effect` rule flags the latter.

**Routes (`App.jsx`):**
- `/product/:id` and `/products/fertilizer/:id` both render `ProductDetails`, using database ids.
- `/account`, `/orders` and `/wishlist` use `ProtectedRoute`. `/admin` uses `AdminRoute`, which also needs a row in `admins`. That check only hides the UI; RLS is the real protection.
- `*` renders `NotFoundPage`. `/contact` and `/faq` are real pages, and `/shipping` redirects to `/faq#delivery`.
- Every page except `HomePage` is `React.lazy`-loaded, so a page's CSS only loads with it. Never rely on another page's stylesheet: give page-specific elements unique class names. The product page uses `ph-*`, because `product-price` and similar names also exist in the product-card CSS.

**Navbar:** every page renders `ReusedComponents/Navbar` itself: `variant="dark"` (default, green) or `"light"` (cream, used by `/account`). It's sticky, with a Products dropdown, an active-route dot, a cart badge, and below 56rem a hamburger that opens a full-width menu.

**Cart buttons:** `ReusedComponents/CartButton/CartButton.jsx` adds an item (defaulting to Medium and Ivory), then disables itself and shows a `QuantityStepper` bound to that cart line. It's built on `useCartLine(product, options)`, which `ProductHero` also uses directly.

**Conventions:**
- Each page section lives in its own folder with a matching `.jsx` and `.css` file.
- All CSS is global and scoped by class-name prefix, so check new class names for collisions. The only intentional global rule is the margin/padding reset in `src/styles/base.css`.
- Fraunces (display) and Inter (body) load from Google Fonts in `index.html`.
- Write `font-size` in `rem` (16px base).
- Static decorative images are WebP files imported from folders next to their component. Product photos live only in the storage bucket, also as WebP, with older PNGs kept there for existing order snapshots. Convert new images to WebP before adding them.
- Store contact details (phone, email, address, hours) and the guarantee and returns windows (`GUARANTEE_DAYS`, `RETURN_DAYS`, both 14) live in `app/utils/storeInfo.js`, and pricing rules in `app/utils/cart.js`. Pages should import them rather than hard-code them.
- The `--hm-*` design tokens are defined on `:root` in `src/styles/base.css`. The shared `hm-*` utility classes (`hm-container`, `hm-title`, `hm-button` and so on) live in the eagerly loaded home page CSS and are reused by the Contact and FAQ pages and `HomeFooter`.
- Imports must match file-name case exactly.
