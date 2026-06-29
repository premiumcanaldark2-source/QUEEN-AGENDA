-- COPIE E COLE ESTE SCRIPT NO "SQL EDITOR" DO SEU DASHBOARD DO SUPABASE

-- Verificar se a extensão uuid-ossp está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Planos (casos não exista)
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  professionals_count INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Barbearias (casos não exista)
CREATE TABLE IF NOT EXISTS barbershops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  plan_id UUID REFERENCES plans(id),
  status TEXT DEFAULT 'active',
  bio TEXT,
  photo1 TEXT,
  photo2 TEXT,
  photo3 TEXT,
  logo_url TEXT,
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Garantir que as colunas de biografia e fotos de carrossel existem na tabela de barbearias (caso já exista)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='barbershops' AND column_name='bio') THEN
    ALTER TABLE barbershops ADD COLUMN bio TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='barbershops' AND column_name='photo1') THEN
    ALTER TABLE barbershops ADD COLUMN photo1 TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='barbershops' AND column_name='photo2') THEN
    ALTER TABLE barbershops ADD COLUMN photo2 TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='barbershops' AND column_name='photo3') THEN
    ALTER TABLE barbershops ADD COLUMN photo3 TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='barbershops' AND column_name='logo_url') THEN
    ALTER TABLE barbershops ADD COLUMN logo_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='barbershops' AND column_name='banner_url') THEN
    ALTER TABLE barbershops ADD COLUMN banner_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='barbershops' AND column_name='slug') THEN
    ALTER TABLE barbershops ADD COLUMN slug TEXT;
  END IF;

  -- Tentar adicionar a restrição UNIQUE se não existir
  BEGIN
    ALTER TABLE barbershops ADD CONSTRAINT barbershops_slug_key UNIQUE (slug);
  EXCEPTION
    WHEN duplicate_table THEN NULL;
    WHEN others THEN NULL;
  END;

  -- NOVAS COLUNAS PARA NOTIFICAÇÕES
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='barbershops' AND column_name='reminder_lead_time_minutes') THEN
    ALTER TABLE barbershops ADD COLUMN reminder_lead_time_minutes INTEGER DEFAULT 60;
  END IF;
END $$;

-- 3. Tabela de Serviços (Garante que a coluna duration_minutes existe)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Caso a tabela já exista, garantir que a coluna duration_minutes existe:
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='duration_minutes') THEN
    ALTER TABLE services ADD COLUMN duration_minutes INTEGER DEFAULT 30;
  END IF;
END $$;

-- 4. Tabela de Profissionais (Garante que phone e password existem e são únicos)
CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  password TEXT,
  commission_percentage INTEGER DEFAULT 40,
  photo_url TEXT,
  working_hours_type TEXT DEFAULT 'shop', -- 'shop' or 'custom'
  custom_start_time TEXT DEFAULT '08:00',
  custom_end_time TEXT DEFAULT '20:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Caso a tabela já exista, garantir que as colunas e a restrição de unicidade existam:
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professionals' AND column_name='phone') THEN
    ALTER TABLE professionals ADD COLUMN phone TEXT;
  END IF;
  
  -- Tentar adicionar a restrição UNIQUE se não existir
  BEGIN
    ALTER TABLE professionals ADD CONSTRAINT professionals_phone_key UNIQUE (phone);
  EXCEPTION
    WHEN duplicate_table THEN NULL; -- Se já existir
    WHEN others THEN NULL;
  END;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professionals' AND column_name='password') THEN
    ALTER TABLE professionals ADD COLUMN password TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professionals' AND column_name='commission_percentage') THEN
    ALTER TABLE professionals ADD COLUMN commission_percentage INTEGER DEFAULT 40;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professionals' AND column_name='photo_url') THEN
    ALTER TABLE professionals ADD COLUMN photo_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professionals' AND column_name='working_hours_type') THEN
    ALTER TABLE professionals ADD COLUMN working_hours_type TEXT DEFAULT 'shop';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professionals' AND column_name='custom_start_time') THEN
    ALTER TABLE professionals ADD COLUMN custom_start_time TEXT DEFAULT '08:00';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professionals' AND column_name='custom_end_time') THEN
    ALTER TABLE professionals ADD COLUMN custom_end_time TEXT DEFAULT '20:00';
  END IF;
END $$;

-- 5. Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de Clientes para login e cadastro próprio
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Garantir que a coluna password existe na tabela de clientes
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='password') THEN
    ALTER TABLE clients ADD COLUMN password TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='barbershops' AND column_name='whatsapp') THEN
    ALTER TABLE barbershops ADD COLUMN whatsapp TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='plan_id') THEN
    ALTER TABLE clients ADD COLUMN plan_id UUID;
  END IF;

  -- NOVAS COLUNAS PARA NOTIFICAÇÕES (PUSH)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='push_subscription') THEN
    ALTER TABLE clients ADD COLUMN push_subscription TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='notifications_enabled') THEN
    ALTER TABLE clients ADD COLUMN notifications_enabled BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- 7. Tabela de Planos de Assinatura da Barbearia
CREATE TABLE IF NOT EXISTS barbershop_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  limit_count INTEGER NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Garantir que a coluna plan_id na tabela clients é uma chave estrangeira para barbershop_subscriptions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'clients_plan_id_fkey') THEN
    ALTER TABLE clients ADD CONSTRAINT clients_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES barbershop_subscriptions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 8. Popular a Tabela de Planos com opções padrão se ela estiver vazia
INSERT INTO plans (id, name, price, professionals_count)
SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Plano Bronze', 49.90, 3
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Plano Bronze');

INSERT INTO plans (id, name, price, professionals_count)
SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Plano Prata', 79.90, 6
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Plano Prata');

INSERT INTO plans (id, name, price, professionals_count)
SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Plano Gold (Ilimitado)', 149.90, 99
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Plano Gold (Ilimitado)');


