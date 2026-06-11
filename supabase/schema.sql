-- Grubel Property Services operational database foundation.
-- Run this in Supabase SQL editor, then create private Storage buckets:
-- service-uploads, subcontractor-documents, project-files.

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null unique,
  role text not null check (role in ('admin', 'customer', 'subcontractor')),
  full_name text
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  email text not null unique,
  phone text not null,
  billing_address text,
  property_address text
);

create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  service_type text not null,
  property_address text,
  property_type text,
  occupancy_status text,
  preferred_date date,
  preferred_time_window text,
  preferred_contact_method text,
  project_description text not null,
  additional_notes text,
  status text not null default 'New'
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid references customers(id) on delete set null,
  service_request_id uuid references service_requests(id) on delete set null,
  quote_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  service_type text not null,
  property_address text,
  amount integer not null default 0,
  deposit_amount integer not null default 0,
  amount_paid integer not null default 0,
  balance_due integer not null default 0,
  quote_status text not null default 'Quote Sent',
  payment_status text not null default 'Unpaid',
  service_status text not null default 'Quote Sent',
  notes text,
  expires_at timestamptz
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid references customers(id) on delete set null,
  quote_id uuid references quotes(id) on delete set null,
  quote_number text,
  customer_name text,
  service_type text,
  property_address text,
  status text not null default 'New Request',
  payment_status text not null default 'Unpaid',
  scheduled_date text,
  assigned_team text,
  next_step text,
  notes text
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid references customers(id) on delete set null,
  service_request_id uuid references service_requests(id) on delete set null,
  quote_id uuid references quotes(id) on delete set null,
  customer_name text not null,
  service_type text not null,
  appointment_date date,
  time_window text,
  contact_method text,
  status text not null default 'Requested',
  notes text
);

create table if not exists uploads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  related_id text not null,
  related_type text not null,
  category text not null,
  file_name text not null,
  file_type text not null,
  size integer not null,
  uploaded_by text,
  storage_bucket text,
  storage_path text,
  public_url text
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid references customers(id) on delete set null,
  quote_id uuid references quotes(id) on delete set null,
  quote_number text,
  amount integer not null,
  status text not null default 'Unpaid',
  method text,
  stripe_session_id text,
  paid_at timestamptz
);

create table if not exists subcontractors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  business_name text,
  phone text not null,
  email text not null unique,
  trade_skills text[] default '{}',
  status text not null default 'Pending Review',
  service_areas text[] default '{}',
  availability text,
  required_documents text[] default '{}',
  missing_documents text[] default '{}'
);

create table if not exists subcontractor_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  application_type text not null,
  applicant_name text not null,
  company_name text,
  email text not null,
  phone text not null,
  experience text,
  services_offered text,
  service_areas text,
  crew_size text,
  licensing_insurance_info text,
  notes text,
  raw_submission jsonb,
  status text not null default 'New'
);

create table if not exists job_assignments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project_id uuid references projects(id) on delete set null,
  subcontractor_id uuid references subcontractors(id) on delete set null,
  quote_number text,
  subcontractor_name text,
  title text not null,
  property_address text,
  status text not null default 'Assigned',
  due_date text,
  notes text
);

create table if not exists crm_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  log_date date not null default current_date,
  type text not null,
  actor text,
  related_quote_or_project text,
  status text,
  notes text
);

alter table if exists projects add column if not exists workflow_stage text;
alter table if exists projects add column if not exists walkthrough_option text;
alter table if exists projects add column if not exists rom_amount numeric;
alter table if exists projects add column if not exists sow_summary text;
alter table if exists projects add column if not exists approval_status text;
alter table if exists projects add column if not exists payment_to_start_status text;
alter table if exists projects add column if not exists vendor_status text;
alter table if exists projects add column if not exists customer_signoff_status text;
alter table if exists projects add column if not exists closeout_status text;

alter table if exists service_requests add column if not exists walkthrough_option text;
alter table if exists service_requests add column if not exists media_status text;
alter table if exists service_requests add column if not exists preferred_days text;

alter table if exists appointments add column if not exists appointment_type text;
alter table if exists appointments add column if not exists contact_method text;
alter table if exists appointments add column if not exists confirmation_status text;

alter table if exists uploads add column if not exists storage_bucket text;
alter table if exists uploads add column if not exists storage_path text;
alter table if exists uploads add column if not exists file_size bigint;
alter table if exists uploads add column if not exists mime_type text;

create index if not exists idx_quotes_quote_number on quotes(quote_number);
create index if not exists idx_projects_quote_number on projects(quote_number);
create index if not exists idx_uploads_related on uploads(related_type, related_id);
create index if not exists idx_service_requests_customer on service_requests(customer_id);
create index if not exists idx_subcontractor_applications_email on subcontractor_applications(email);

-- Row Level Security foundation.
-- Public/anon users have no direct table access. Website submissions and
-- private file metadata writes should go through server API routes using the
-- service role key only on the server.
alter table customers enable row level security;
alter table profiles enable row level security;
alter table service_requests enable row level security;
alter table quotes enable row level security;
alter table projects enable row level security;
alter table payments enable row level security;
alter table appointments enable row level security;
alter table uploads enable row level security;
alter table subcontractors enable row level security;
alter table subcontractor_applications enable row level security;
alter table job_assignments enable row level security;
alter table crm_logs enable row level security;

create policy "service role can manage profiles"
  on profiles for all to service_role using (true) with check (true);
create policy "service role can manage customers"
  on customers for all to service_role using (true) with check (true);
create policy "service role can manage service requests"
  on service_requests for all to service_role using (true) with check (true);
create policy "service role can manage quotes"
  on quotes for all to service_role using (true) with check (true);
create policy "service role can manage projects"
  on projects for all to service_role using (true) with check (true);
create policy "service role can manage payments"
  on payments for all to service_role using (true) with check (true);
create policy "service role can manage appointments"
  on appointments for all to service_role using (true) with check (true);
create policy "service role can manage uploads"
  on uploads for all to service_role using (true) with check (true);
create policy "service role can manage subcontractors"
  on subcontractors for all to service_role using (true) with check (true);
create policy "service role can manage subcontractor applications"
  on subcontractor_applications for all to service_role using (true) with check (true);
create policy "service role can manage job assignments"
  on job_assignments for all to service_role using (true) with check (true);
create policy "service role can manage crm logs"
  on crm_logs for all to service_role using (true) with check (true);

-- Future Supabase Auth policies. These become active once customers and
-- subcontractors authenticate through Supabase Auth and email claims are
-- trusted by the application.
create policy "customers can read their own quotes"
  on quotes for select to authenticated
  using (lower(customer_email) = lower(coalesce(auth.jwt() ->> 'email', '')));

create policy "customers can read their own projects"
  on projects for select to authenticated
  using (
    exists (
      select 1
      from quotes
      where quotes.quote_number = projects.quote_number
        and lower(quotes.customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

create policy "authenticated users can read their own profile"
  on profiles for select to authenticated
  using (id = auth.uid());

create policy "customers can read their own payments"
  on payments for select to authenticated
  using (
    exists (
      select 1
      from quotes
      where quotes.quote_number = payments.quote_number
        and lower(quotes.customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

create policy "subcontractors can read their own assignments"
  on job_assignments for select to authenticated
  using (
    exists (
      select 1
      from subcontractors
      where subcontractors.id = job_assignments.subcontractor_id
        and lower(subcontractors.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

-- Storage security instructions:
-- 1. Create private buckets only: service-uploads, subcontractor-documents,
--    and project-files.
-- 2. Customers upload through server API routes only.
-- 3. Subcontractors upload through server API routes only.
-- 4. Admins access files through protected server routes only.
-- 5. Do not enable public bucket access or return private file URLs directly
--    from public APIs.
