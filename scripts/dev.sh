#!/usr/bin/env bash
set -euo pipefail

# Load local config (MSSQL_SA_PASSWORD, DOCKER_NAME, VITE_API_URL) from a gitignored .env, if present
if [ -f "$(dirname "$0")/../.env" ]; then
    set -a
    # shellcheck disable=SC1091
    source "$(dirname "$0")/../.env"
    set +a
fi

if [ -z "${MSSQL_SA_PASSWORD:-}" ]; then
    echo "MSSQL_SA_PASSWORD is not set. Copy .env.example to .env at the repo root and fill it in." >&2
    exit 1
fi

CONTAINER_NAME="${DOCKER_NAME:-vinty-mssql}"

cleanup()
{
    echo ""
    echo "Stopping ${CONTAINER_NAME}..."
    docker stop "${CONTAINER_NAME}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Docker daemon not running — starting Docker Desktop..."
    open -a Docker

    until docker info >/dev/null 2>&1; do
        sleep 1
    done
fi

# Check if the container is running, and start it if not
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Starting ${CONTAINER_NAME}..."
    docker start "${CONTAINER_NAME}"

    echo "Waiting for SQL Server to accept connections..."
    until docker exec "${CONTAINER_NAME}" /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "${MSSQL_SA_PASSWORD}" -C -Q "SELECT 1" >/dev/null 2>&1; do
        sleep 1
    done
fi

concurrently -n client,server -c blue,green \
    "npm run dev --prefix client" \
    "dotnet watch run --project server"
