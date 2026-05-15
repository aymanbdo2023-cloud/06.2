# Library Management System

Node.js + PostgreSQL + Redis — Dockerized.

## Services

| Service | Image | Purpose |
|---|---|---|
| `app` | Build from `Dockerfile` | Express API server |
| `db` | `postgres:18-alpine` | PostgreSQL database |
| `redis` | `redis:alpine` | Redis cache (placeholder) |

## docker-compose.yml

- **`app`**: Reads DB/Redis connection details from `.env` (via `env_file`). Overrides `DB_HOST=db` and `REDIS_HOST=redis` at runtime so the app resolves the container hostnames.
- **`db`**: Credentials are injected via `${DB_USER}`, `${DB_PASSWORD}`, `${DB_NAME}` — pulled from `.env` through Compose variable substitution. Data persists in a named volume `pgdata` mounted at `/var/lib/postgresql/data`. A healthcheck ensures the app only starts after the database is ready.
- **`redis`**: A lightweight in-memory store. No persistence needed for this setup.

## Environment Variables (`.env`)

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=aycas2009
DB_NAME=library
DB_PORT=5432
APP_PORT=3000
```

> **Note**: `DB_HOST` is set to `localhost` for local development. Docker Compose overrides it to `db` so the container connects to the `db` service.  
> The `.env` file is the single source of truth — update credentials here, and `docker-compose.yml` picks them up automatically.

## Volumes

```yaml
volumes:
  pgdata:
```

Persists PostgreSQL data across container restarts. To reset the database (e.g., to re-run init scripts):

```powershell
docker compose down -v
docker compose up --build
```

## How to Run

```powershell
# Start all services (rebuild app image)
docker compose up --build

# Run in detached mode
docker compose up --build -d

# Check running services
docker compose ps

# Stop everything
docker compose down

# Stop and delete volumes
docker compose down -v
```

## Testing the API

Once running, test the endpoints:

```powershell
# Test basic connectivity
curl http://localhost:3000/test

# Query users (requires users table)
curl http://localhost:3000/users

# Query loans (requires loans table)
curl http://localhost:3000/loans
```

## Creating Tables

Create the required tables by connecting to the database:

```powershell
docker compose exec db psql -U postgres -d library
```<img width="726" height="571" alt="06 2-2" src="https://github.com/user-attachments/assets/7961ab8c-c5a8-459a-a7e5-2c084ac3053b" />


Then run your `CREATE TABLE` statements. Alternatively, the app can auto-create tables on startup by adding `CREATE TABLE IF NOT EXISTS` queries in `server.js`.

## Screensh<img width="718" height="621" alt="06 2-1" src="https://github.com/user-attachments/assets/6fd31c16-3dc6-45d2-ae5d-be697e89aec9" />
ots
![Uploading 06.2-2.png…]()

<img width="1133" height="78" alt="06 2-3" src="https://github.com/user-attachments/assets/e1d3886f-b102-41cb-ba22-daae108e6fa3" />

