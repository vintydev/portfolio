# .NET / EF Core / Postgres versions

SDK — 10.0.302
EF Core / Npgsql — ^10.0.10 (pin to match whatever `net{X}.0` the .csproj targets)

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
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 8.0.10
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

# Set the connection string (matches whatever the Docker container's actual password is)
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=vintydev;Username=postgres;Password=devdev123"

# See what's set
dotnet user-secrets list

# Remove one
dotnet user-secrets remove "Key:Name"
```

# Docker / Postgres

### Container lifecycle
```zsh
# Check status
docker ps -a --filter name=vinty-pg

# Start it (safe — data persists across stop/start)
docker start vinty-pg

# Stop it
docker stop vinty-pg
```

#### Optionally
```zsh
# Only if creating fresh (no volume = data lost on `docker rm`)
docker run --name vinty-pg -e POSTGRES_PASSWORD=devdev123 -e POSTGRES_DB=vintydev -p 5432:5432 -d postgres:16
```

### Check container's actual env (password etc.)
```zsh
docker inspect vinty-pg --format '{{range .Config.Env}}{{println .}}{{end}}' | grep -i postgres
```

### Inspect the database directly
```zsh
# Open psql shell inside the container
docker exec -it vinty-pg psql -U postgres -d vintydev

# One-off: list tables
docker exec vinty-pg psql -U postgres -d vintydev -c "\dt"
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

### 28P01: password authentication failed for user "postgres"
* The connection string in user secrets doesn't match the container's actual `POSTGRES_PASSWORD`. Check with `docker inspect` (see above) and update the secret to match — don't change the container's password to match a guess.

### NU1903: known vulnerability in a package
* Check the advisory for a patched version in the same major line, then add it as a direct `PackageReference` to override the vulnerable transitive one:
```zsh
dotnet add package Microsoft.OpenApi --version 2.11.0
```
