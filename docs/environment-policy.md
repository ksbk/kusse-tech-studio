# Environment Configuration Policy

## Overview

KusseTechStudio uses a centralized environment file policy to ensure consistency across development, staging, and production environments.

## File Structure

```text
├── .env.example          # Template for new developers
├── .env                  # Symlink to envs/.env.development (for local dev)
├── envs/
│   ├── .env.development  # Development environment
│   ├── .env.staging      # Staging environment
│   └── .env.production   # Production environment
└── scripts/
    └── env-setup.sh      # Environment management script
```

## Policy Rules

### 1. Root `.env` File

- **MUST** always be a symlink to `envs/.env.development` for local development
- **NEVER** commit a regular `.env` file to the repository
- Use `scripts/env-setup.sh` to manage the symlink

### 2. Environment Files

- **Development**: `envs/.env.development` - Local development settings
- **Staging**: `envs/.env.staging` - Staging environment (production-like)
- **Production**: `envs/.env.production` - Production environment

### 3. Template File

- **`.env.example`**: Template for new developers
- Contains all possible environment variables with safe defaults
- Updated when new environment variables are added

## Usage

### For Developers

**Initial Setup:**

```bash
# Clone repository
git clone <repo>
cd kusse-tech-studio

# Setup development environment
bash scripts/env-setup.sh dev

# Verify setup
bash scripts/env-setup.sh status
```

**Daily Development:**

```bash
# Your .env automatically points to development config
python run.py
# or
make run
```

### For Deployments

**Staging:**

```bash
# In staging environment
bash scripts/env-setup.sh staging
```

**Production:**

```bash
# In production environment
bash scripts/env-setup.sh production
```

**Docker Compose:**

```bash
# Development
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml up

# Staging (uses envs/.env.staging)
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml up -d

# Production (uses envs/.env.production)
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml up -d
```

## Environment Management Script

The `scripts/env-setup.sh` script provides:

```bash
# Setup development environment (creates symlink)
bash scripts/env-setup.sh dev

# Setup staging environment
bash scripts/env-setup.sh staging

# Setup production environment
bash scripts/env-setup.sh production

# Check current status
bash scripts/env-setup.sh status

# Verify all environment files exist
bash scripts/env-setup.sh verify

# Show help
bash scripts/env-setup.sh help
```

## Adding New Environment Variables

1. **Add to `.env.example`** with safe defaults
2. **Add to all environment files** in `envs/`
3. **Update documentation** if needed
4. **Test in all environments**

## Security Guidelines

### Development Environment

- Use safe default values
- Disable CSRF for development convenience
- Use MailHog for email testing
- Enable debug mode and hot reload

### Staging Environment

- Use production-like security settings
- Enable CSRF protection
- Use real email servers
- Disable debug mode

### Production Environment

- Use strong secret keys (via environment variables)
- Enable all security features
- Use production email servers
- Minimize debug information

## Troubleshooting

### `.env` is a regular file instead of symlink

```bash
bash scripts/env-setup.sh dev
```

### Missing environment files

```bash
bash scripts/env-setup.sh verify
```

### Check current environment

```bash
bash scripts/env-setup.sh status
```

### Docker Compose can't find environment files

Ensure you're using the correct relative paths:

```bash
# From project root
cd infra && docker-compose ...

# Docker Compose files reference ../envs/.env.*
```

## Integration with Docker

Docker Compose files reference environment files:

- **Development**: `env_file: ../envs/.env.development`
- **Staging**: `env_file: ../envs/.env.staging`
- **Production**: `env_file: ../envs/.env.production`

This ensures consistent environment variable loading across local development and containerized deployments.
