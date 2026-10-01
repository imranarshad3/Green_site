-- Messages sent from the Contact page. Anyone (signed in or not) can send
-- one; only admins can read them or mark them handled.

create table public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  subject text not null default 'General' check (char_length(subject) <= 120),
  message text not null check (char_length(message) between 10 and 4000),
  -- Clerk user id when the sender was signed in.
  user_id text default public.requesting_user_id(),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create index contact_messages_created_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (
    handled = false
    and user_id is not distinct from public.requesting_user_id()
  );

create policy "Admins can read contact messages"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update contact messages"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admins may only toggle `handled`.
revoke update on public.contact_messages from anon, authenticated;
grant update (handled) on public.contact_messages to authenticated;
