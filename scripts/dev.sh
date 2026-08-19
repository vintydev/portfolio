#!/usr/bin/env bash
set -euo pipefail

CONTAINER_NAME="vinty-mssql"

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
    until docker exec "${CONTAINER_NAME}" /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'DevDev123!' -C -Q "SELECT 1" >/dev/null 2>&1; do
        sleep 1
    done
fi

concurrently -n client,server -c blue,green \
    "npm run dev --prefix client" \
    "dotnet watch run --project server"
