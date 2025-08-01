# 🐳 Infrastructure & Docker Configuration

This directory contains the Docker Compose configurations for KusseTechStudio across different environments.

## 📁 Structure

```
infra/
├── docker-compose.base.yml     # Common services (web, redis, nginx)
├── docker-compose.override.yml # Development overrides (hot reload, MailHog)
├── docker-compose.staging.yml  # Staging environment overrides
├── docker-compose.production.yml  # Production environment overrides
├── docker-compose.yml          # DEPRECATED - kept for migration
└── nginx/
    ├── default.conf            # Base nginx configuration
    └── production.conf         # Production-optimized nginx config
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
```

### Staging Environment

```bash
# Staging deployment
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml up -d

# With PostgreSQL
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml --profile postgres up -d

# Check status
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml ps
```

### Production Environment

```bash
# Production deployment
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml up -d

# With PostgreSQL and backup service
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml --profile postgres --profile backup up -d

# View logs
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml logs -f web
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
