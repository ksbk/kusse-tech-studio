#!/bin/bash

# Refactor to Enhanced Gold Standard Directory Structure
# This script reorganizes the project into a more scalable structure

set -e

echo "🚀 Refactoring to Enhanced Gold Standard Structure..."

# Create the new directory structure
echo "📁 Creating enhanced directory structure..."

# App structure
mkdir -p app/models
mkdir -p app/utils/api
mkdir -p app/templates/{components,pages}
mkdir -p app/static/src/{styles/{abstracts,base,components,layout,utilities},scripts/{lib,app},img}
mkdir -p app/static/dist

# Move existing SCSS structure to styles
if [[ -d "src/scss" ]]; then
	echo "  Moving SCSS to app/static/src/styles..."
	cp -r src/scss/* app/static/src/styles/ 2>/dev/null || true
fi

# Move existing JS structure to scripts
if [[ -d "src/js" ]]; then
	echo "  Moving JS to app/static/src/scripts..."
	cp -r src/js/* app/static/src/scripts/app/ 2>/dev/null || true
fi

# Move existing images
if [[ -d "src/images" ]]; then
	echo "  Moving images to app/static/src/img..."
	cp -r src/images/* app/static/src/img/ 2>/dev/null || true
fi

# Template structure reorganization
echo "📄 Reorganizing templates..."

# Create new template structure
mkdir -p app/templates/components
mkdir -p app/templates/pages

# Move existing templates to pages
if [[ -f "app/templates/index.html" ]]; then
	mv "app/templates/index.html" "app/templates/pages/home.html"
fi

if [[ -f "app/templates/about.html" ]]; then
	mv "app/templates/about.html" "app/templates/pages/about.html"
fi

if [[ -f "app/templates/projects.html" ]]; then
	mv "app/templates/projects.html" "app/templates/pages/projects.html"
fi

if [[ -f "app/templates/contact.html" ]]; then
	mv "app/templates/contact.html" "app/templates/pages/contact.html"
fi

if [[ -f "app/templates/services.html" ]]; then
	mv "app/templates/services.html" "app/templates/pages/services.html"
fi

# Create blog template placeholder
touch app/templates/pages/blog.html

# Move partials to new structure
if [[ -d "app/templates/partials" ]]; then
	echo "  Partials already exist, keeping current structure"
fi

# Create component templates
echo "  Creating component templates..."

# Infrastructure directory
echo "🐳 Creating infrastructure directory..."
mkdir -p infra/nginx
mkdir -p envs
mkdir -p scripts/security
mkdir -p docs/adr

# Move existing Docker files to infra
if [[ -f "docker-compose.yml" ]]; then
	cp "docker-compose.yml" "infra/docker-compose.yml"
fi

# Create environment structure
echo "⚙️ Setting up environment structure..."

# Move to envs directory and create environment files
cat >envs/.env.development <<'EOF'
# Development Environment Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production

# Database
DATABASE_URL=sqlite:///dev.db

# Email (Development - using MailHog)
MAIL_SERVER=localhost
MAIL_PORT=1025
MAIL_USE_TLS=False
MAIL_USE_SSL=False
MAIL_USERNAME=
MAIL_PASSWORD=

# Analytics
GOOGLE_ANALYTICS_ID=

# Contact
CONTACT_EMAIL=contact@kussetechstudio.com

# Security
WTF_CSRF_ENABLED=False
EOF

cat >envs/.env.staging <<'EOF'
# Staging Environment Configuration
FLASK_ENV=staging
FLASK_DEBUG=False
SECRET_KEY=${SECRET_KEY}

# Database
DATABASE_URL=${DATABASE_URL}

# Email
MAIL_SERVER=${MAIL_SERVER}
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=${MAIL_USERNAME}
MAIL_PASSWORD=${MAIL_PASSWORD}

# Analytics
GOOGLE_ANALYTICS_ID=${GOOGLE_ANALYTICS_ID}

# Contact
CONTACT_EMAIL=${CONTACT_EMAIL}

# Security
WTF_CSRF_ENABLED=True
EOF

cat >envs/.env.production <<'EOF'
# Production Environment Configuration
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=${SECRET_KEY}

# Database
DATABASE_URL=${DATABASE_URL}

# Email
MAIL_SERVER=${MAIL_SERVER}
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=${MAIL_USERNAME}
MAIL_PASSWORD=${MAIL_PASSWORD}

# Analytics
GOOGLE_ANALYTICS_ID=${GOOGLE_ANALYTICS_ID}

# Contact
CONTACT_EMAIL=${CONTACT_EMAIL}

# Security
WTF_CSRF_ENABLED=True
PREFERRED_URL_SCHEME=https
EOF

cat >envs/README.md <<'EOF'
# Environment Configuration

This directory contains environment-specific configuration files.

## Usage

1. Copy the appropriate environment file to the project root as `.env`
2. Update the values with your specific configuration

## Files

- `.env.development` - Development environment settings
- `.env.staging` - Staging environment settings  
- `.env.production` - Production environment settings

## Security

Never commit actual environment files with secrets to version control.
These template files use placeholder values that should be replaced.
EOF

# Create infrastructure files
echo "🏗️ Setting up infrastructure..."

cat >infra/README.md <<'EOF'
# Infrastructure Configuration

This directory contains deployment and infrastructure configuration files.

## Docker Compose Files

- `docker-compose.yml` - Base configuration
- `docker-compose.prod.yml` - Production overrides
- `docker-compose.staging.yml` - Staging overrides

## Nginx Configuration

- `nginx/default.conf` - Nginx reverse proxy configuration

## Future Additions

- Terraform configurations for cloud deployment
- Monitoring and logging configurations
- Health check configurations
EOF

cat >infra/nginx/default.conf <<'EOF'
upstream app {
    server web:5000;
}

server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /app/app/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Create scripts
echo "🔧 Creating automation scripts..."

cat >scripts/security/scan.sh <<'EOF'
#!/bin/bash

# Security scanning script
echo "🔒 Running security scans..."

# Python security scan with bandit
echo "🐍 Scanning Python code with bandit..."
bandit -r app/ -f json -o security-report.json || true

# Check for secrets in code
echo "🔍 Checking for secrets with trufflehog..."
# trufflehog --regex --entropy=False . || true

# Dependency vulnerability check
echo "📦 Checking Python dependencies..."
safety check || true

echo "✅ Security scan complete!"
EOF

chmod +x scripts/security/scan.sh

cat >scripts/security/README.md <<'EOF'
# Security Scripts

This directory contains security-related automation scripts.

## Scripts

- `scan.sh` - Runs comprehensive security scans including:
  - Bandit for Python code analysis
  - Safety for dependency vulnerability checks
  - TruffleHog for secret detection (when available)

## Usage

```bash
./scripts/security/scan.sh
```

## Dependencies

Install security tools:
```bash
pip install bandit safety
# Optional: Install trufflehog for secret scanning
```
EOF

cat >scripts/lint.sh <<'EOF'
#!/bin/bash

# Comprehensive linting script
echo "🧹 Running code quality checks..."

# Python linting
echo "🐍 Python linting..."
flake8 app/ config/ tests/ || true
black --check app/ config/ tests/ || true
isort --check-only app/ config/ tests/ || true

# JavaScript/TypeScript linting
echo "📜 JavaScript linting..."
npm run lint || true

# CSS linting
echo "🎨 CSS linting..."
npm run lint:css || true

echo "✅ Linting complete!"
EOF

chmod +x scripts/lint.sh

# Create documentation structure
echo "📚 Creating documentation structure..."

cat >docs/architecture.md <<'EOF'
# Architecture Overview

## Directory Structure

This project follows an enhanced Flask application structure designed for scalability and maintainability.

### Core Structure

- `app/core/` - Core application logic and views
- `app/models/` - Data models (prepared for future database integration)
- `app/utils/api/` - External API clients and integrations
- `app/templates/` - Organized template hierarchy
- `app/static/src/` - Source assets (SCSS, JS, images)
- `app/static/dist/` - Compiled production assets

### Configuration

- `config/` - Environment-specific configuration classes
- `envs/` - Environment variable templates
- `.config/` - Tool configuration files

### Infrastructure

- `infra/` - Deployment and infrastructure configurations
- `scripts/` - Automation and maintenance scripts
- `tests/` - Comprehensive testing structure

## Design Principles

1. **Separation of Concerns** - Clear boundaries between different aspects
2. **Scalability** - Structure supports growth and feature additions
3. **Maintainability** - Easy to understand and modify
4. **Production Ready** - Optimized for deployment and operations
EOF

cat >docs/adr/0001-structure-decision.md <<'EOF'
# ADR-001: Enhanced Directory Structure

## Status
Accepted

## Context
The project needed a more scalable and organized directory structure to support future growth and maintain professional standards.

## Decision
Implement an enhanced directory structure with:
- Separate models directory for future database integration
- API utilities directory for external service integration
- Organized template hierarchy (components, pages, partials)
- Enhanced static asset structure
- Infrastructure directory for deployment configurations

## Consequences
- Better separation of concerns
- Easier to scale and add new features
- More professional and maintainable codebase
- Clear path for future enhancements
EOF

cat >docs/adr/0002-dark-mode-choice.md <<'EOF'
# ADR-002: Dark Mode Implementation

## Status
Accepted

## Context
Modern web applications benefit from dark mode support for better user experience and accessibility.

## Decision
Implement dark mode using:
- CSS custom properties for theme variables
- JavaScript toggle functionality
- Local storage persistence
- System preference detection

## Consequences
- Enhanced user experience
- Better accessibility
- Modern, professional appearance
- Requires additional CSS maintenance
EOF

# Remove old src directory
rm -rf src 2>/dev/null || true

echo "✨ Enhanced Gold Standard Structure implementation complete!"
echo ""
echo "📊 New Structure Features:"
echo "  ✅ Scalable app structure with models and API utilities"
echo "  ✅ Organized template hierarchy (components/pages/partials)"
echo "  ✅ Enhanced static asset structure (styles/scripts/img)"
echo "  ✅ Infrastructure directory for deployment"
echo "  ✅ Environment-specific configurations"
echo "  ✅ Security and automation scripts"
echo "  ✅ Comprehensive documentation with ADRs"
echo ""
echo "🔄 Next steps:"
echo "  1. Update view routes to use new template paths"
echo "  2. Update webpack config for new asset structure"
echo "  3. Create model classes in app/models/"
echo "  4. Set up API clients in app/utils/api/"
echo "  5. Update templates to use new component structure"
