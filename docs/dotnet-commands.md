# .NET / EF Core / SQL Server versions

SDK — 10.0.302
EF Core / Microsoft.EntityFrameworkCore.SqlServer — ^10.0.10 (pin to match whatever `net{X}.0` the .csproj targets)

# Storage Troubleshooting
```zsh
# See system storage
df -h /

# See size of build artifacts
du -sh server/bin server/obj
```

# Package Troubleshooting

### Clean and restore
```zsh
cd server
rm -rf bin obj
dotnet restore
dotnet build
```

### Add a package pinned to your target framework
```zsh
# Only needed if `dotnet add package` grabs a version newer than your TFM supports
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 10.0.10
```

### Check what's actually installed vs outdated
```zsh
dotnet list package
dotnet list package --outdated
```

#### Optionally
```zsh
# Clear the local NuGet cache if a restore is behaving weirdly
dotnet nuget locals all --clear
```

# EF Core Migrations

### Create Migration
```zsh
cd server
dotnet ef migrations add DescriptiveNameNotUpdate2
```

### Apply Migration
```zsh
dotnet ef database update
```

### Roll back
```zsh
# Roll schema back to a previous migration
dotnet ef database update PreviousMigrationName

# Then delete the bad migration file
dotnet ef migrations remove
```

### List migrations / check status
```zsh
dotnet ef migrations list
```

#### Rules
* **NEVER** edit a migration file after it's been applied anywhere (including just locally) — roll back and regenerate instead #required
* Commit the model change and its migration file together, always #required

# User Secrets

```zsh
# One-time per project
dotnet user-secrets init

# Set the connection string (matches whatever the Docker container's actual SA password is)
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost,1433;Database=vintydev;User Id=sa;Password=DevDev123!;TrustServerCertificate=True"

# See what's set
dotnet user-secrets list

# Remove one
dotnet user-secrets remove "Key:Name"
```

# Docker / SQL Server

### Container lifecycle
```zsh
# Check status
docker ps -a --filter name=vinty-mssql

# Start it (safe — data persists across stop/start)
docker start vinty-mssql

# Stop it
docker stop vinty-mssql
```

#### Optionally
```zsh
# Only if creating fresh (no volume = data lost on `docker rm`)
# SA password must satisfy SQL Server's complexity policy (8+ chars, 3 of: upper/lower/digit/symbol)
docker run --name vinty-mssql -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=DevDev123!" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest

# Then create the database once the container's ready (~10s after first start)
docker exec vinty-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'DevDev123!' -C -Q "IF DB_ID('vintydev') IS NULL CREATE DATABASE vintydev;"
```

### Check container's actual env (password etc.)
```zsh
docker inspect vinty-mssql --format '{{range .Config.Env}}{{println .}}{{end}}' | grep -i mssql
```

### Inspect the database directly
```zsh
# Open sqlcmd shell inside the container
docker exec -it vinty-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'DevDev123!' -C -d vintydev

# One-off: list tables
docker exec vinty-mssql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'DevDev123!' -C -d vintydev -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;"
```

# Build & Run

```zsh
cd server
dotnet build
dotnet run

# Auto-rebuild/restart on file changes
dotnet watch run
```

#### Optionally
```zsh
# Trust the local HTTPS dev cert (only needed once per machine)
dotnet dev-certs https --trust
```

# Troubleshooting Common Errors

### CS0246: type or namespace not found
* Missing `using Microsoft.EntityFrameworkCore;` at the top of the file — `DbContext`, `DbSet`, `ModelBuilder` all live there.

### NU1202: package X is not compatible with netY.0
* `dotnet add package` grabbed the newest version, which targets a newer TFM than the project. Re-run with `--version` pinned to match (see Package Troubleshooting above).

### Login failed for user 'sa'
* The connection string in user secrets doesn't match the container's actual `MSSQL_SA_PASSWORD`. Check with `docker inspect` (see above) and update the secret to match — don't change the container's password to match a guess.

### NU1903: known vulnerability in a package
* Check the advisory for a patched version in the same major line, then add it as a direct `PackageReference` to override the vulnerable transitive one:
```zsh
dotnet add package Microsoft.OpenApi --version 2.11.0
```
