# 🐳 Infrastructure & Docker Configuration

This directory contains the Docker Compose configurations for KusseTechStudio across different environments.

## 📁 Structure

```
infra/
├── docker-compose.base.yml        # Common services (web, redis, nginx)
├── docker-compose.override.yml    # Development overrides (hot reload, MailHog)
├── docker-compose.development.yml # Development environment overrides
├── docker-compose.staging.yml     # Staging environment overrides
├── docker-compose.production.yml  # Production environment overrides
└── nginx/
    ├── default.conf               # Base nginx configuration
    └── production.conf            # Production-optimized nginx config
```

> **✅ Clean Structure**: All root-level Docker Compose files have been removed. This directory now contains the complete and authoritative Docker infrastructure configuration for all environments.

## 🎯 Environment-Specific Combinations

### Development Environment

**Base + Development overrides**

```bash
docker-compose -f docker-compose.base.yml -f docker-compose.development.yml up
```

- Uses `envs/.env.development`
- Includes hot reload, debug mode, MailHog
- Exposes all ports for debugging

### Staging Environment

**Base + Staging overrides**

```bash
docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml up -d
```

- Uses `envs/.env.staging`
- Production-like setup with some debugging enabled
- SSL termination, optimized for testing

### Production Environment

**Base + Production overrides**

```bash
docker-compose -f docker-compose.base.yml -f docker-compose.production.yml up -d
```

- Uses `envs/.env.production`
- Full security hardening, resource limits
- SSL/TLS, backup services, monitoring

> **✅ Structure Complete**: All root-level Docker Compose files (`docker-compose.yml`, `docker-compose.prod.yml`) have been completely removed from the repository. This `infra/` directory now contains the single source of truth for all Docker infrastructure configuration across all environments. Use the environment-specific combinations above for all Docker operations.

## 🚀 Quick Start Guide

### Prerequisites
- Docker and Docker Compose installed
- Environment files configured in `/envs/` directory

### First-Time Setup

1. **Install Pre-commit Hook (Recommended)**

   ```bash
   # Install git hook for code quality
   ln -sf ../../scripts/security/pre-commit.sh .git/hooks/pre-commit
   chmod +x .git/hooks/pre-commit
   ```

2. **Create Local Override File (Optional)**

   ```bash
   # Copy template for local customization
   cp infra/docker-compose.override.yml.template infra/docker-compose.override.yml
   # Edit as needed (file is gitignored)
   ```

### Common Development Workflow

1. **Start Development Environment**
   ```bash
   # Using Makefile (recommended)
   make dev
   
   # Or directly with Docker Compose
   cd infra
   docker-compose -f docker-compose.base.yml -f docker-compose.development.yml up
   ```

2. **View Logs**
   ```bash
   make dev-logs
   ```

3. **Stop Environment**
   ```bash
   make dev-down
   ```

### Environment Management

| Environment | Makefile Command | Direct Command |
|-------------|------------------|----------------|
| **Development** | `make dev` | `cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml up` |
| **Staging** | `make staging` | `cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml up -d` |
| **Production** | `make prod` | `cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml up -d` |

### Local Development Customization

Create `docker-compose.override.yml` in the `infra/` directory for local-specific tweaks:

```yaml
# infra/docker-compose.override.yml
# This file is gitignored and allows local customizations
version: "3.9"

services:
  web:
    # Example: Mount additional volumes for development
    volumes:
      - ../local-data:/app/local-data
    # Example: Override environment variables
    environment:
      - DEBUG_LEVEL=verbose
      
  # Example: Add a local service
  localdb:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: local_test
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
    ports:
      - "5433:5432"
```

## 🚀 Usage Examples

### Local Development

```bash
# Standard development setup (using new naming convention)
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml up

# Or explicitly with development profile
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml --profile development up

# With PostgreSQL database
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml --profile postgres up

# With all development services including MailHog
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml --profile development up mailhog

# Using Makefile (recommended)
make dev           # Standard development
make dev-build     # With rebuild
make dev-logs      # View logs
make dev-down      # Stop services
```

### Staging Environment

```bash
# Staging deployment
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml up -d

# With PostgreSQL
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml --profile postgres up -d

# Check status
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml ps

# Using Makefile (recommended)
make staging       # Deploy staging
make staging-logs  # View logs
make staging-down  # Stop services
```

### Production Environment

```bash
# Production deployment
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml up -d

# With PostgreSQL and backup service
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml --profile postgres --profile backup up -d

# View logs
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml logs -f web

# Using Makefile (recommended)
make prod          # Deploy production
make prod-logs     # View logs
make prod-down     # Stop services
```

### Environment-Specific Examples

#### Development with Custom Overrides
```bash
# Copy the template for local customization
cp infra/docker-compose.override.yml.template infra/docker-compose.override.yml

# Edit your local overrides (file is gitignored)
# Then run development normally - overrides are applied automatically
make dev
```

#### Staging with Database Migration
```bash
# Deploy staging with database
make staging
# Run migrations
make migrate-staging
# Check logs
make staging-logs
```

#### Production Zero-Downtime Deployment
```bash
# Scale up new instances
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml up -d --scale web=2

# Verify new instances are healthy
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml ps

# Update load balancer configuration (external step)
# Remove old instances
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml up -d --scale web=1 --force-recreate
```

## 🔧 Environment Configuration

Each environment uses its corresponding `.env` file from the `/envs/` directory:

- **Development**: `envs/.env.development`
- **Staging**: `envs/.env.staging`
- **Production**: `envs/.env.production`

### Environment Variables

Key variables that should be set in your environment files:

```bash
# Core Flask Configuration
FLASK_ENV=development|staging|production
FLASK_DEBUG=True|False
SECRET_KEY=your-secret-key

# Database (optional - defaults to SQLite)
DATABASE_URL=postgresql://user:pass@db:5432/dbname

# Email Configuration
MAIL_SERVER=smtp.example.com
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-email-password

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Security (Production)
WTF_CSRF_ENABLED=True
PREFERRED_URL_SCHEME=https
```

## 🐳 Docker Profiles

The configuration uses Docker Compose profiles to enable/disable services:

- **`development`**: Development-specific services (MailHog, hot reload)
- **`postgres`**: PostgreSQL database service
- **`backup`**: Database backup service (production only)

## 🏥 Health Checks

All services include health checks for monitoring:

- **Web**: `http://localhost:5000/health`
- **Redis**: `redis-cli ping`
- **Nginx**: `wget http://localhost/health`
- **PostgreSQL**: Built-in health check

## 📊 Monitoring & Logs

```bash
# View service status
docker-compose ps

# Follow logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f web

# Resource usage
docker stats
```

## 🔄 Common Operations

### Development Workflow

```bash
# Start development environment
docker-compose up

# Rebuild after code changes
docker-compose up --build

# Reset development database
docker-compose down -v
docker-compose up
```

### Production Deployment

```bash
# Deploy new version
docker-compose -f infra/docker-compose.base.yml -f infra/docker-compose.prod.yml pull
docker-compose -f infra/docker-compose.base.yml -f infra/docker-compose.prod.yml up -d --force-recreate

# Zero-downtime deployment (with load balancer)
docker-compose -f infra/docker-compose.base.yml -f infra/docker-compose.prod.yml up -d --scale web=2
# Update load balancer to point to new instances
# Stop old instances
```

### Database Operations

```bash
# Create database backup
docker-compose exec db pg_dump -U kussetechstudio kussetechstudio > backup.sql

# Restore database backup
docker-compose exec -T db psql -U kussetechstudio -d kussetechstudio < backup.sql

# Access database shell
docker-compose exec db psql -U kussetechstudio -d kussetechstudio
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Use strong, unique SECRET_KEY
- [ ] Configure SSL certificates in `/ssl/` directory
- [ ] Set up proper firewall rules
- [ ] Use managed database service instead of container
- [ ] Configure log aggregation
- [ ] Set up monitoring and alerting
- [ ] Regular security updates

### SSL/TLS Configuration

```bash
# Generate self-signed certificates for testing
mkdir -p ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/private.key -out ssl/certificate.crt

# For production, use Let's Encrypt or proper CA certificates
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**

   ```bash
   # Check what's using port 5000
   lsof -i :5000
   # Change port in environment file
   PORT=5001 docker-compose up
   ```

2. **Permission issues**

   ```bash
   # Fix volume permissions
   sudo chown -R $USER:$USER ./app/static/dist
   ```

3. **Database connection issues**

   ```bash
   # Check database logs
   docker-compose logs db
   # Verify network connectivity
   docker-compose exec web ping db
   ```

4. **Memory issues**
   ```bash
   # Check resource usage
   docker stats
   # Increase memory limits in compose files
   ```

### Useful Debug Commands

```bash
# Enter running container
docker-compose exec web bash

# Check environment variables
docker-compose exec web env

# Test database connection
docker-compose exec web python -c "from app import create_app; app = create_app(); print('DB connected!')"

# Check nginx configuration
docker-compose exec nginx nginx -t
```

## 📈 Performance Tuning

### Production Optimizations

- Use `gunicorn` with multiple workers
- Configure Redis for caching
- Set appropriate resource limits
- Use nginx for static file serving
- Enable gzip compression
- Configure proper log rotation

### Development Optimizations

- Use volume mounts for faster rebuilds
- Enable hot reload for development
- Use minimal resource allocation
