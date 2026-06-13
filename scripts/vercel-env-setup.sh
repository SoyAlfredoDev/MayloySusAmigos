#!/usr/bin/env bash
# Configura variables de Neon en Vercel para mailo-sus-amigos.
# Ejecutar tú mismo: bash scripts/vercel-env-setup.sh
# Requiere: vercel CLI logueado (npx vercel login) y proyecto linkeado (npx vercel link)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "❌ Falta .env en la raíz del proyecto."
  exit 1
fi

read_env() {
  local key="$1"
  local line
  line="$(grep -m1 "^${key}=" .env || true)"
  if [[ -z "$line" ]]; then
    echo ""
    return
  fi
  echo "${line#${key}=}"
}

DATABASE_URL="$(read_env DATABASE_URL)"
DIRECT_URL="$(read_env DIRECT_URL)"
MAILO_POSTGRES_URL="$(read_env MAILO_POSTGRES_URL)"
MAILO_POSTGRES_URL_NON_POOLING="$(read_env MAILO_POSTGRES_URL_NON_POOLING)"

if [[ -z "${DATABASE_URL:-}" || -z "${DIRECT_URL:-}" ]]; then
  echo "❌ DATABASE_URL y DIRECT_URL deben existir en .env"
  exit 1
fi

if [[ "$DATABASE_URL" != *"ep-cool-haze"* ]]; then
  echo "⚠️  DATABASE_URL no apunta a ep-cool-haze. Revisa que sea la base de Mailo."
  read -r -p "¿Continuar igual? (y/N) " ans
  [[ "$ans" == "y" || "$ans" == "Y" ]] || exit 1
fi

APP_URL="${NEXT_PUBLIC_APP_URL:-https://mayloy-sus-amigos.vercel.app}"

upsert_env() {
  local name="$1"
  local value="$2"
  local env="$3"

  if npx vercel env ls 2>/dev/null | grep -q "^ ${name} "; then
    npx vercel env rm "$name" "$env" --yes 2>/dev/null || true
  fi
  printf '%s' "$value" | npx vercel env add "$name" "$env" --yes
  echo "  ✓ $name ($env)"
}

echo "🔧 Configurando Vercel — mailo-sus-amigos"
echo "   Base: ep-cool-haze-ad1tfkym"
echo ""

for ENV in production preview development; do
  echo "→ Entorno: $ENV"
  upsert_env "DATABASE_URL" "$DATABASE_URL" "$ENV"
  upsert_env "DIRECT_URL" "$DIRECT_URL" "$ENV"
  upsert_env "NEXT_PUBLIC_APP_URL" "$APP_URL" "$ENV"
  if [[ -n "$MAILO_POSTGRES_URL" ]]; then
    upsert_env "MAILO_POSTGRES_URL" "$MAILO_POSTGRES_URL" "$ENV"
  fi
  if [[ -n "$MAILO_POSTGRES_URL_NON_POOLING" ]]; then
    upsert_env "MAILO_POSTGRES_URL_NON_POOLING" "$MAILO_POSTGRES_URL_NON_POOLING" "$ENV"
  fi
done

echo ""
echo "✅ Listo. Redeploy:"
echo "   npx vercel --prod"
echo ""
echo "Verifica: https://mayloy-sus-amigos.vercel.app/api/health/db"
