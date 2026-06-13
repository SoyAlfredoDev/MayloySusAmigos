-- Revierte SOLO objetos creados por Mailo (20250613000000_init_mailo).
-- NO toca: Booking, Room, PendingCheckout, SpecialRequest, ni 20260522180921_init

-- Tablas Mailo (hijos primero por FKs)
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "cart_items" CASCADE;
DROP TABLE IF EXISTS "appointments" CASCADE;
DROP TABLE IF EXISTS "blocked_slots" CASCADE;
DROP TABLE IF EXISTS "schedules" CASCADE;
DROP TABLE IF EXISTS "professional_specialties" CASCADE;
DROP TABLE IF EXISTS "medical_records" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "carts" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "pets" CASCADE;
DROP TABLE IF EXISTS "addresses" CASCADE;
DROP TABLE IF EXISTS "services" CASCADE;
DROP TABLE IF EXISTS "professionals" CASCADE;
DROP TABLE IF EXISTS "specialties" CASCADE;
DROP TABLE IF EXISTS "brands" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Enums Mailo
DROP TYPE IF EXISTS "MedicalRecordType" CASCADE;
DROP TYPE IF EXISTS "ContactPreference" CASCADE;
DROP TYPE IF EXISTS "PetSex" CASCADE;
DROP TYPE IF EXISTS "PetTypeFilter" CASCADE;
DROP TYPE IF EXISTS "PaymentProvider" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "OrderStatus" CASCADE;
DROP TYPE IF EXISTS "AppointmentStatus" CASCADE;
DROP TYPE IF EXISTS "ServiceModule" CASCADE;
DROP TYPE IF EXISTS "PetSize" CASCADE;
DROP TYPE IF EXISTS "PetSpecies" CASCADE;
DROP TYPE IF EXISTS "UserRole" CASCADE;

-- Registro de migración Mailo (conserva 20260522180921_init)
DELETE FROM "_prisma_migrations"
WHERE "migration_name" = '20250613000000_init_mailo';
