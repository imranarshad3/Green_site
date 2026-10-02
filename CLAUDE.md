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

- `products`: one table for plants and fertilizers (`type` enum). `images` holds object keys in the public `product-images` bucket, such as `plants/monstera.png`, not URLs. `status` is `active`, `draft` (only admins can see it) or `coming_soon` (listed but can't be bought). `stock` is decremented by both order functions, which refuse orders larger than the stock; cancelling an order puts its items back (`restock_cancelled_order` trigger). The client checks `isPurchasable()` / `getAvailabilityLabel()` in `utils/products.js` to show "Sold out" or "Coming soon".
- `cart_items`, `wishlist_items`: per user, enforced by RLS. A cart line is unique on `(user_id, product_id, size, pot_style)` with `nulls not distinct`; fertilizers have null size and pot style.
- `orders`, `order_items`: there is no insert policy. Orders are created only by two security-definer functions: `place_order(shipping, promo_code)` prices the caller's cart from current product prices, snapshots the items and empties the cart; `buy_now(product_id, quantity, size, pot_style, shipping, promo_code)` (the product page's Buy now button) orders a single item and leaves the cart alone. Both hand the subtotal to `create_order()`, which validates the shipping JSON (`clean_shipping()`: name, email, phone, address and city required, postal code optional), applies discounts and delivery, and stores the `shipping_*` columns, `promo_code` and `promo_discount` (`discount` is the total including the promo). `courier` and `tracking_number` are set by admins. Users can update only `status`, and only admins pass that RLS check. Customers cancel through `cancel_order(order_number, reason)`, a security-definer function that only works while the order is `processing` (admins can call it too). The `orders_stamp_status` trigger fills `shipped_at`, `delivered_at` and `cancelled_at` whenever the status changes (moving an order back clears the later stamps); `cancel_reason` is set only by `cancel_order`.
- `contact_messages`: written by the Contact page form, which anyone can insert into. Only admins can read it or toggle `handled`.
- `admins`: user ids that may manage products, upload images and change order status (`public.is_admin()`). Rows are added by hand in the SQL editor.
- `promo_codes`: admin-only table (`percent` or `fixed`, optional minimum subtotal, usage limit, expiry, `active`). Customers never read it; `check_promo(code, subtotal)` validates a code for the cart and checkout UI, and `promo_discount()` is what `create_order()` uses. A promo stacks with the automatic $9 discount, capped at the subtotal, and each order increments `uses`.
- `product_reviews`: one per user per product, readable by everyone. Inserting needs `has_received_product(product_id)` (a delivered order containing it). The `product_reviews_refresh_rating` trigger rewrites `products.rating` and `products.reviews` from the reviews, so the first real review replaces the seeded numbers. Authors edit their own; authors and admins delete.
- `return_requests`: one per order, created only by `request_return(order_number, reason, details)` for delivered orders within 14 days of `delivered_at` (or `created_at` for older orders). Admins set `status` (`requested`/`approved`/`rejected`) and `admin_note`; `resolved_at` is stamped by trigger. The 14 is hard-coded in SQL, so keep it in sync with `RETURN_DAYS`.
- `stock_alerts`: "Notify me" sign-ups (product, user, email) for sold-out or coming-soon products. Nothing sends email; the admin dashboard lists who is waiting with a `mailto:` BCC link.
- Delivery and discount rules exist in `create_order()` (authoritative) and `client/src/app/utils/cart.js` (`getCartTotals`, `getPromoDiscount`; display only). Keep both in sync.

## Client architecture (`client/src/`)

**Providers:** `main.jsx` nests them in this order: `ClerkProvider`, `SupabaseProvider`, `ProductsProvider`, `CartProvider`, `WishlistProvider`, `OrdersProvider`, then `<App/>`. Each domain in `app/Context/` has a `XContext.js` file (the context plus its `useX()` hook) and a matching `XProvider.jsx`. They're split so provider files only export components, which keeps oxlint's `only-export-components` rule happy.
- `SupabaseProvider` creates one client whose `accessToken` callback returns the current Clerk session token.
- `useProducts()` loads the whole catalog once and maps rows to camelCase component props (`toProduct` in `utils/products.js`, which also builds image URLs). It exposes `plants`, `fertilizers`, `allProducts` (admins also get drafts), `findProduct(type, id)` and `reload()`.
- `useCart()`: guests use localStorage (`plantify-guest-cart`), and signed-in users use `cart_items`. Updates are optimistic, and database writes go through an ordered queue (`cartStore.js`). The guest cart merges into the account on sign-in.
- `useWishlist()` and `useOrders()` are database-only. Guests pressing a heart get Clerk's sign-in modal. `useOrders()` exposes `placeOrder({ shipping, promoCode })`, `buyNow(product, { quantity, size, potStyle, shipping, promoCode })`, `getOrder`, `cancelOrder`, `requestReturn` and `checkPromo`.
- Both checkout paths use `ReusedComponents/CheckoutDialog` (`co-*` classes): the cart's Proceed to Checkout and the product page's Buy now. It collects delivery details (prefilled from the customer's latest order, else their Clerk profile), takes a promo code, shows the totals and, on success, navigates to `/orders/<number>` with `state.placed` for the thank-you banner. Payment is cash on delivery. The cart's Discount code box applies a promo that is passed into the dialog.
- `useStockAlert(product)` (Context/) reads and toggles the signed-in user's `stock_alerts` row; `ProductHero` shows Notify me in place of Buy now when the product can't be bought. `ProductDetails/ProductReviews` (`rv-*`) lists reviews with a rating breakdown and shows the review form to customers who received the product.
- Provider state is tagged with the owning `userId`, so a previous user's data never flashes after an account switch.
- Effects that load data use `promise.then(setState)` rather than `async` functions, because oxlint's `set-state-in-effect` rule flags the latter.

**Routes (`App.jsx`):**
- `/product/:id` and `/products/fertilizer/:id` both render `ProductDetails`, using database ids.
- `/account`, `/orders`, `/orders/:orderNumber` and `/wishlist` use `ProtectedRoute`. `/orders/:orderNumber` (`OrderDetailsPage`, `od-*` classes) takes the `PLT-…` order number. It shows the cached order from `useOrders()` right away and refreshes it with `getOrder(orderNumber)`, which queries Supabase directly. The page also shows the delivery address, any promo, the courier and tracking number once shipped, and a return request panel (`OdReturn`) for delivered orders inside the return window. It offers Buy again (re-adds still-purchasable items to the cart with their size and pot style), Print receipt (`@media print` rules in `OrderDetailsPage.css`, scoped under `.od-page`) and, while the order is processing, Cancel with an inline reason picker and confirm. `/admin` uses `AdminRoute`, which also needs a row in `admins`. That check only hides the UI; RLS is the real protection.
- `/admin` has its own chrome instead of the site `Navbar`: a dark left sidebar (`AdminPage/AdminSidebar/`) with Dashboard, Products, Orders and Messages, badge counts for processing orders and unread messages, a View store link and the signed-in admin with sign-out. Below 60rem the sidebar becomes a drawer behind a menu button. The current page is in the URL as `?tab=` (no param means Dashboard).
- The admin Products tab (`AdminPage/AdminProducts/`) switches between plants and fertilizers with two buttons (`&type=plants|fertilizers` in the URL) and shows one table with inline status and stock editing, delete with an inline Yes/No confirm (cart and wishlist rows cascade; order items keep their snapshot with `product_id` set to null; storage images are kept because order snapshots and other products may still use them), units sold per product (non-cancelled orders), and Best seller (revenue) and Most ordered (units) highlights.
- The admin Orders tab (`AdminPage/AdminOrders/`) has status filter buttons with counts (plus Returns for pending return requests), a search over order number, customer name, email, phone, city, tracking number and product names, checkboxes with a bulk status change, and Export CSV of the filtered orders (`ordersCsv.js`, built in the browser). `&order=<order number>` in the URL opens `AdminPage/AdminOrderDetail/` inside the admin chrome: status select, items and totals, delivery contact details, a courier and tracking number form, the return request with Approve/Decline and a note to the customer, a timeline from the status timestamps with the cancel reason, the customer id with a copy button, and that customer's other orders. Dashboard recent orders link there too.
- The admin Promotions tab (`AdminPage/AdminPromos/`) creates promo codes and pauses or deletes them, showing uses and whether each is live, paused, expired or used up.
- `/admin` opens on the Dashboard tab (`AdminPage/AdminDashboard/`): KPIs, revenue chart, top products, order status and recent orders for a chosen date range, all computed client-side from the admin's view of `orders` in `dashboardStats.js`. Cancelled orders are left out of revenue. Needs attention also counts returns to review and products low on stock, and there are Low stock (active products with 5 or fewer) and Restock requests cards. `RevenueChart` is a hand-rolled SVG, so there is no chart library.
- `*` renders `NotFoundPage`. `/contact` and `/faq` are real pages, and `/shipping` redirects to `/faq#delivery`.
- Scrolling is handled once, in `ReusedComponents/ScrollManager` (mounted in `App.jsx`): a new path scrolls to the top, Back/Forward restores the saved position for that history entry, `#hash` links scroll smoothly to the element, and query-string-only changes leave the scroll alone. Pages shouldn't call `window.scrollTo` on mount. `App.jsx` also wraps routes in a `.route-view` div keyed by pathname for a short fade-in (disabled under `prefers-reduced-motion`).
- Every page except `HomePage` is `React.lazy`-loaded, so a page's CSS only loads with it. Never rely on another page's stylesheet: give page-specific elements unique class names. The product page uses `ph-*`, because `product-price` and similar names also exist in the product-card CSS.

**Navbar:** every page renders `ReusedComponents/Navbar` itself: `variant="dark"` (default, green) or `"light"` (cream, used by `/account`). It's sticky, with a Products dropdown, an active-route dot, a cart badge, and below 56rem a hamburger that opens a full-width menu.

**Cart buttons:** `ReusedComponents/CartButton/CartButton.jsx` adds an item (defaulting to Medium and Ivory), then disables itself and shows a `QuantityStepper` bound to that cart line. It's built on `useCartLine(product, options)`, which `ProductHero` also uses directly.

**Conventions:**
- Source files (JS/JSX, CSS, SQL, scripts) contain no comments, by the owner's choice. Don't add any; put explanations in this file or in commit messages instead.
- Each page section lives in its own folder with a matching `.jsx` and `.css` file.
- All CSS is global and scoped by class-name prefix, so check new class names for collisions. The only intentional global rule is the margin/padding reset in `src/styles/base.css`.
- Fraunces (display) and Inter (body) load from Google Fonts in `index.html`.
- Write `font-size` in `rem` (16px base).
- Static decorative images are WebP files imported from folders next to their component. Product photos live only in the storage bucket, also as WebP, with older PNGs kept there for existing order snapshots. Convert new images to WebP before adding them.
- Store contact details (phone, email, address, hours) and the guarantee and returns windows (`GUARANTEE_DAYS`, `RETURN_DAYS`, both 14) live in `app/utils/storeInfo.js`, and pricing rules in `app/utils/cart.js`. Pages should import them rather than hard-code them.
- The `--hm-*` design tokens are defined on `:root` in `src/styles/base.css`. The shared `hm-*` utility classes (`hm-container`, `hm-title`, `hm-button` and so on) live in the eagerly loaded home page CSS and are reused by the Contact and FAQ pages and `HomeFooter`.
- Imports must match file-name case exactly.
