# Grubel Property Services Auth Setup

Use Supabase Auth for admin and subcontractor portal access.

1. In Supabase, go to Authentication -> Users.
2. Create the admin user with email/password.
3. Create each subcontractor user with email/password.
4. Copy each Auth user UUID.
5. Insert matching `profiles` rows with the correct role.

Example admin profile:

```sql
insert into profiles (id, email, role, full_name)
values ('AUTH_USER_UUID_HERE', 'info@grubelps.com', 'admin', 'Grubel Admin');
```

Example subcontractor profile:

```sql
insert into profiles (id, email, role, full_name)
values ('AUTH_USER_UUID_HERE', 'partner@example.com', 'subcontractor', 'Subcontractor Partner');
```

Required Vercel environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AUTH_SESSION_SECRET=
```

Security notes:

- `SUPABASE_SERVICE_ROLE_KEY` must only be used server-side.
- Do not expose admin or subcontractor portal links in public navigation.
- Customer portal lookup remains quote number + email based until customer account auth is added.
