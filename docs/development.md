# Development Guide

## Quick Start

1. **Clone and Setup Environment**:

   ```bash
   git clone <repository-url>
   cd kusse-tech-studio

   # Setup development environment (creates .env symlink)
   bash scripts/env-setup.sh dev

   # Verify environment setup
   bash scripts/env-setup.sh status
   ```

2. **Python Environment** (if not using Docker):

   ```bash
   python scripts/setup.py
   source venv/bin/activate
   ```

3. **Run Application**:

   **Option A: Direct Flask (Development)**:

   ```bash
   python run.py
   # or
   make run
   ```

   **Option B: Docker Compose (Recommended)**:

   ```bash
   # Development (with hot reload)
   make dev

   # Build development environment
   make dev-build

   # Staging
   make staging

   # Production
   make prod
   ```

## Environment Management

KusseTechStudio uses a centralized environment configuration policy. See [Environment Policy](environment-policy.md) for details.

**Key Points:**

- Root `.env` is always a symlink to `envs/.env.development`
- Use `scripts/env-setup.sh` to manage environments
- Never commit a regular `.env` file to the repository

**Quick Commands:**

```bash
# Setup development
bash scripts/env-setup.sh dev

# Check current environment
bash scripts/env-setup.sh status

# Switch to staging (for testing)
bash scripts/env-setup.sh staging
```

## Development Workflow

### Building Assets

```bash
./scripts/build.sh
```

### Running Tests

```bash
pytest
```

### Code Quality

```bash
flake8 .
black .
isort .
```

## Project Structure

- `config/` - Application configuration
- `app/core/` - Core application logic
- `app/templates/` - Jinja2 templates
- `app/static/` - Compiled static assets
- `src/` - Source assets (SCSS, JS, images)
- `tests/` - Test suite
- `scripts/` - Build and deployment scripts
- `infra/` - Docker infrastructure configurations

## Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

## Docker Development

### Environment-Specific Configurations

- **Development**: Includes hot reload, debug mode, MailHog for email testing
- **Staging**: Production-like environment with SSL and gunicorn
- **Production**: Optimized with resource limits, health checks, and backups

### Docker Commands

```bash
# Start development environment
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml up --build

# View logs
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml logs -f

# Stop services
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml down
```

## Adding New Features

1. Create feature branch
2. Add tests first (TDD)
3. Implement feature
4. Update documentation
5. Create pull request
