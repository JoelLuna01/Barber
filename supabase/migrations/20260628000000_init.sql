-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. TABLES CREATION
-- =========================================================================

-- 1.1 Barbershops (Tenants)
create table barbershops (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  logo_url text,
  cover_url text,
  description text,
  address text,
  phone text,
  whatsapp text,
  facebook text,
  instagram text,
  tiktok text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.2 Profiles (Auth Link)
create table profiles (
  id uuid primary key, -- References auth.users(id) in Supabase
  email text not null,
  full_name text,
  avatar_url text,
  role text not null check (role in ('admin', 'barber', 'client')),
  barbershop_id uuid references barbershops(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.3 Categories (for Services and Products)
create table categories (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  name text not null,
  type text not null check (type in ('service', 'product')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.4 Services
create table services (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price decimal(10,2) not null,
  duration_minutes integer not null, -- in minutes
  image_url text,
  color text, -- hex code for calendar display
  is_active boolean default true not null,
  is_featured boolean default false not null,
  display_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.5 Employees (Barbers / Staff)
create table employees (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  name text not null,
  avatar_url text,
  bio text,
  experience_years integer,
  specialties text[], -- array of strings
  social_instagram text,
  social_tiktok text,
  rating_avg decimal(3,2) default 5.00 not null,
  is_active boolean default true not null,
  commission_type text default 'percentage' check (commission_type in ('fixed', 'percentage', 'service_specific')),
  commission_value decimal(10,2) default 0.00 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Map many-to-many services and employees
create table employee_services (
  employee_id uuid references employees(id) on delete cascade,
  service_id uuid references services(id) on delete cascade,
  primary key (employee_id, service_id)
);

-- 1.6 Customers (Tenant Specific)
create table customers (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  avatar_url text,
  birth_date date,
  notes text,
  hair_type text, -- e.g. lacio, rizado, ondulado, crespo
  beard_type text, -- e.g. abundante, candado, corta, ninguna
  allergies text,
  loyalty_points integer default 0 not null,
  total_spent decimal(10,2) default 0.00 not null,
  visits_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.7 Working Hours
create table working_hours (
  id uuid primary key default uuid_generate_v4(),
  employee_id uuid not null references employees(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0 = Sunday, 1 = Monday, etc.
  start_time time not null,
  end_time time not null,
  lunch_start time,
  lunch_end time,
  is_active boolean default true not null
);

-- 1.8 Blocked Dates (Vacations, Manual Block, Holidays)
create table blocked_dates (
  id uuid primary key default uuid_generate_v4(),
  employee_id uuid references employees(id) on delete cascade, -- Null if blocked for entire shop
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.9 Appointments
create table appointments (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  service_id uuid not null references services(id) on delete cascade,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  notes text,
  total_price decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.10 Appointment Photos (Before / After portfolio history)
create table appointment_photos (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid not null references appointments(id) on delete cascade,
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  photo_type text not null check (photo_type in ('before', 'after')),
  image_url text not null,
  products_used text[],
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.11 Products
create table products (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  brand text,
  description text,
  price decimal(10,2) not null,
  cost decimal(10,2) not null,
  stock integer default 0 not null,
  sku text,
  barcode text,
  supplier text,
  image_url text,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.12 Inventory Movements
create table inventory_movements (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  type text not null check (type in ('in', 'out', 'sale', 'adjustment', 'waste')),
  quantity integer not null,
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.13 Cash Register (Caja)
create table cash_registers (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  opened_by uuid not null references profiles(id),
  closed_by uuid references profiles(id),
  opened_at timestamp with time zone default timezone('utc'::text, now()) not null,
  closed_at timestamp with time zone,
  initial_amount decimal(10,2) not null,
  expected_amount decimal(10,2),
  actual_amount decimal(10,2),
  difference decimal(10,2),
  status text not null default 'open' check (status in ('open', 'closed')),
  notes text
);

-- 1.14 Cash Movements (Ingresos / Egresos manuales)
create table cash_movements (
  id uuid primary key default uuid_generate_v4(),
  cash_register_id uuid not null references cash_registers(id) on delete cascade,
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount decimal(10,2) not null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.15 Sales (Transactions)
create table sales (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  cash_register_id uuid references cash_registers(id) on delete set null,
  customer_id uuid references customers(id) on delete set null,
  employee_id uuid references employees(id) on delete set null, -- Barber who processed it
  total_amount decimal(10,2) not null,
  discount_amount decimal(10,2) default 0.00 not null,
  payment_method text not null check (payment_method in ('cash', 'card', 'transfer', 'mercado_pago', 'stripe')),
  payment_status text not null default 'completed' check (payment_status in ('pending', 'completed', 'refunded')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.16 Sale Items
create table sale_items (
  id uuid primary key default uuid_generate_v4(),
  sale_id uuid not null references sales(id) on delete cascade,
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  item_type text not null check (item_type in ('service', 'product')),
  service_id uuid references services(id) on delete set null,
  product_id uuid references products(id) on delete set null,
  quantity integer not null,
  unit_price decimal(10,2) not null,
  total_price decimal(10,2) not null
);

-- 1.17 Commissions (Calculadas)
create table commissions (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  sale_id uuid references sales(id) on delete cascade,
  amount decimal(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  paid_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.18 Expenses
create table expenses (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  category text not null check (category in ('rent', 'services', 'purchases', 'salaries', 'other')),
  description text not null,
  amount decimal(10,2) not null,
  expense_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.19 Reviews
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  appointment_id uuid unique references appointments(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  employee_id uuid references employees(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.20 Gallery
create table gallery (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  image_url text not null,
  caption text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.21 Favorites (Client Favorites)
create table favorites (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  service_id uuid references services(id) on delete cascade,
  employee_id uuid references employees(id) on delete cascade,
  unique(profile_id, service_id),
  unique(profile_id, employee_id)
);

-- 1.22 Notifications
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  title text not null,
  message text not null,
  is_read boolean default false not null,
  type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.23 Promotions
create table promotions (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  name text not null,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value decimal(10,2) not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.24 Activity Logs (Audit / Security logs)
create table activity_logs (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid not null references barbershops(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  action text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 2. INDEXES FOR PERFORMANCE
-- =========================================================================
create index idx_profiles_barbershop on profiles(barbershop_id);
create index idx_categories_barbershop on categories(barbershop_id);
create index idx_services_barbershop on services(barbershop_id);
create index idx_employees_barbershop on employees(barbershop_id);
create index idx_customers_barbershop on customers(barbershop_id);
create index idx_working_hours_employee on working_hours(employee_id);
create index idx_blocked_dates_barbershop on blocked_dates(barbershop_id);
create index idx_appointments_barbershop on appointments(barbershop_id);
create index idx_appointments_employee_time on appointments(employee_id, start_time);
create index idx_products_barbershop on products(barbershop_id);
create index idx_sales_barbershop on sales(barbershop_id);
create index idx_sales_caja on sales(cash_register_id);
create index idx_commissions_employee on commissions(employee_id);
create index idx_expenses_barbershop on expenses(barbershop_id);
create index idx_reviews_employee on reviews(employee_id);
create index idx_gallery_barbershop on gallery(barbershop_id);
create index idx_notifications_profile on notifications(profile_id);

-- =========================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
alter table barbershops enable row level security;
alter table profiles enable row level security;
alter table categories enable row level security;
alter table services enable row level security;
alter table employees enable row level security;
alter table employee_services enable row level security;
alter table customers enable row level security;
alter table working_hours enable row level security;
alter table blocked_dates enable row level security;
alter table appointments enable row level security;
alter table appointment_photos enable row level security;
alter table products enable row level security;
alter table inventory_movements enable row level security;
alter table cash_registers enable row level security;
alter table cash_movements enable row level security;
alter table sales enable row level security;
alter table sale_items enable row level security;
alter table commissions enable row level security;
alter table expenses enable row level security;
alter table reviews enable row level security;
alter table gallery enable row level security;
alter table favorites enable row level security;
alter table notifications enable row level security;
alter table promotions enable row level security;
alter table activity_logs enable row level security;

-- Setup basic RLS rules (Allow public select for booking elements, restrict modification to admins)
create policy "Allow public to read barbershop profile" on barbershops for select using (true);
create policy "Allow public to read categories" on categories for select using (true);
create policy "Allow public to read services" on services for select using (true);
create policy "Allow public to read employees" on employees for select using (true);
create policy "Allow public to read employee services" on employee_services for select using (true);
create policy "Allow public to read working hours" on working_hours for select using (true);
create policy "Allow public to read blocked dates" on blocked_dates for select using (true);
create policy "Allow public to read gallery" on gallery for select using (true);
create policy "Allow public to read reviews" on reviews for select using (true);
create policy "Allow public to read active promotions" on promotions for select using (true);

-- Allow admins full control over everything matching their barbershop_id
-- We can create dynamic functions to verify if the requesting user's profile is admin
create or replace function get_user_role() returns text as $$
  select role from profiles where id = auth.uid() limit 1;
$$ language sql security definer;

create or replace function get_user_barbershop() returns uuid as $$
  select barbershop_id from profiles where id = auth.uid() limit 1;
$$ language sql security definer;

-- Specific policies for tables based on roles:
-- Profiles
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Admins can manage profiles of their barbershop" on profiles for all using (
  get_user_role() = 'admin' and barbershop_id = get_user_barbershop()
);

-- Appointments
create policy "Customers/guests can insert appointments" on appointments for insert with check (true);
create policy "Users can read own appointments" on appointments for select using (
  customer_id in (select id from customers where profile_id = auth.uid()) or
  employee_id in (select id from employees where profile_id = auth.uid()) or
  get_user_role() = 'admin'
);
create policy "Staff can update appointments" on appointments for update using (
  employee_id in (select id from employees where profile_id = auth.uid()) or
  get_user_role() = 'admin'
);

-- =========================================================================
-- 4. SEED DATA FOR A SINGLE SHOP
-- =========================================================================

-- Insert the BarberShop (Single tenant for now)
insert into barbershops (id, name, slug, logo_url, cover_url, description, address, phone, whatsapp, facebook, instagram, tiktok, email)
values (
  '11111111-1111-1111-1111-111111111111',
  'BarberBook Studio',
  'barberbook-studio',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&q=80',
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&q=80',
  'Estilo, técnica y tradición en un ambiente premium pensado para el caballero moderno. Creadores de cortes icónicos y afeitados incomparables.',
  'Av. de la Reforma 450, Col. Juárez, Ciudad de México',
  '+52 55 1234 5678',
  '+52 55 1234 5678',
  'https://facebook.com/barberbookstudio',
  'https://instagram.com/barberbookstudio',
  'https://tiktok.com/@barberbookstudio',
  'contacto@barberbookstudio.com'
);

-- Insert Categories
insert into categories (id, barbershop_id, name, type) values
  ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Cortes', 'service'),
  ('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Afeitado y Barba', 'service'),
  ('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Combos Especiales', 'service'),
  ('c4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Productos para Cabello', 'product');

-- Insert Services
insert into services (id, barbershop_id, category_id, name, description, price, duration_minutes, image_url, color, is_active, is_featured, display_order) values
  (
    's1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'Corte de Cabello Clásico',
    'Corte tradicional con tijera y máquina, lavado de cabello, masaje capilar y peinado con pomada premium.',
    350.00,
    30,
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&q=80',
    '#3B82F6', -- Blue
    true,
    true,
    1
  ),
  (
    's2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'c2222222-2222-2222-2222-222222222222',
    'Perfilado de Barba Ritual',
    'Recorte y alineación de barba con navaja libre, toallas calientes aromatizadas, bálsamo hidratante y aceite protector.',
    280.00,
    20,
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&q=80',
    '#10B981', -- Green
    true,
    true,
    2
  ),
  (
    's3333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'c3333333-3333-3333-3333-333333333333',
    'Ritual Completo (Corte + Barba)',
    'El servicio insignia: Corte de cabello clásico + Ritual de barba completo con toallas calientes y exfoliación facial.',
    550.00,
    50,
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80',
    '#8B5CF6', -- Purple
    true,
    true,
    3
  );

-- Insert Employees (Barberos)
insert into employees (id, barbershop_id, name, avatar_url, bio, experience_years, specialties, social_instagram, social_tiktok, rating_avg, is_active, commission_type, commission_value) values
  (
    'e1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Mateo Silva',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    'Especialista en degradados (fades), cortes modernos de tijera y diseño de barba urbana.',
    8,
    array['Mid Fade', 'Taper Fade', 'Ritual de Barba'],
    'https://instagram.com/mateo_silvabarber',
    'https://tiktok.com/@mateo_silvabarber',
    4.95,
    true,
    'percentage',
    40.00
  ),
  (
    'e2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Lucas Russo',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    'Maestro del corte tradicional clásico, afeitado a navaja libre antigua y tratamientos capilares.',
    12,
    array['Corte Clásico', 'Afeitado Tradicional', 'Masaje Capilar'],
    'https://instagram.com/lucas_russobarber',
    'https://tiktok.com/@lucas_russobarber',
    4.88,
    true,
    'percentage',
    40.00
  );

-- Map Employee Services
insert into employee_services (employee_id, service_id) values
  ('e1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111'),
  ('e1111111-1111-1111-1111-111111111111', 's2222222-2222-2222-2222-222222222222'),
  ('e1111111-1111-1111-1111-111111111111', 's3333333-3333-3333-3333-333333333333'),
  ('e2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111'),
  ('e2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222'),
  ('e2222222-2222-2222-2222-222222222222', 's3333333-3333-3333-3333-333333333333');

-- Insert Working Hours (Monday to Saturday, 09:00 to 18:00, lunch 13:00 to 14:00)
insert into working_hours (employee_id, day_of_week, start_time, end_time, lunch_start, lunch_end, is_active)
select 
  emp.id, 
  days.day, 
  '09:00:00'::time, 
  '18:00:00'::time, 
  '13:00:00'::time, 
  '14:00:00'::time, 
  true
from employees emp
cross join (values (1), (2), (3), (4), (5), (6)) days(day);

-- Insert Sample Products
insert into products (id, barbershop_id, category_id, name, brand, description, price, cost, stock, sku, barcode, supplier, image_url, is_active) values
  (
    'p1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'c4444444-4444-4444-4444-444444444444',
    'Pomada Modeladora Fuerte',
    'Reuzel',
    'Pomada base agua con fijación fuerte y brillo medio. Ideal para peinados Pompadour.',
    320.00,
    180.00,
    15,
    'RZ-POM-01',
    '871891823719',
    'Distribuidora Mexicana de Belleza',
    'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=400&q=80',
    true
  ),
  (
    'p2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'c4444444-4444-4444-4444-444444444444',
    'Aceite Hidratante para Barba',
    'Grave Before Shave',
    'Aceite nutritivo formulado con jojoba, almendras y aroma a sándalo. Hidrata barba y piel.',
    290.00,
    160.00,
    3, -- low stock to trigger warnings
    'GBS-OIL-02',
    '721891823812',
    'Grave Distributing',
    'https://images.unsplash.com/photo-1626015713026-d837d172406f?w=400&q=80',
    true
  );

-- Insert Sample Gallery
insert into gallery (barbershop_id, image_url, caption) values
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80', 'Degradado medio con perfilado de barba ritual.'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', 'Corte clásico pompadour ejecutado a tijera.'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80', 'Fade texturizado con diseño lineal.'),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80', 'Afeitado tradicional premium con ritual de toallas calientes.');
