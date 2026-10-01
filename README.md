# Plantify

A full-stack plant shop:

- **`client/`**: React 19, Vite and React Router, with sign-in through [Clerk](https://clerk.com).
- **`server/`**: a [Supabase](https://supabase.com) project, containing the Postgres schema, row-level security, the checkout function, seed data and the product-image storage bucket.

## Setup

1. **Install dependencies:** `npm install`
2. **Configure the client.** Create `client/.env` with:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<publishable key>
   ```
3. **Connect Clerk to Supabase.**
   - In the Clerk dashboard: **Integrations → Supabase → Activate**.
   - In the Supabase dashboard: **Authentication → Third-Party Auth → Add Clerk**, using your Clerk domain.
4. **Create the database and upload the product images:**
   ```bash
   cd server
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npx supabase db push --include-seed
   npx supabase seed buckets --linked
   ```
5. **Make yourself an admin.** In the Supabase SQL editor, run:
   ```sql
   insert into admins (user_id) values ('<your Clerk user id>');
   ```
6. **Run the app:** `npm run dev -w client`

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev -w client` | Start the Vite dev server |
| `npm run build` | Build the client for production |
| `npm run lint` | Lint the client with oxlint |
