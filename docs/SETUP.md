# GameForge Ecommerce Setup

## Run in VS Code

1. Open this folder in VS Code.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase URL and anon key.
5. Run `npm run dev`.
6. Open `http://localhost:3000`.

## Demo login behavior

The app works in demo mode if Supabase env vars are not set.

- Admin email: `admin@gamestore.test`
- Any other email becomes a customer account.
- Password must be at least 6 characters.

To change the admin email, set `NEXT_PUBLIC_ADMIN_EMAIL` in `.env.local`.

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. In Authentication settings, enable email/password auth.
5. Create your admin user using the same email as `NEXT_PUBLIC_ADMIN_EMAIL`.
6. Insert or update that user's row in `profiles` with role `admin`.

Example:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@gamestore.test';
```

The current UI uses local demo product data for presentation speed. The Supabase schema is ready for replacing the demo arrays with live queries for products, orders, wishlists, reviews, and admin management.
