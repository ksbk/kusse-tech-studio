.PHONY: help install run test clean clean-pycache build deploy ci-setup frontend-build dev dev-build dev-down dev-logs dev-override dev-override-build dev-override-down dev-setup-overrides staging staging-down staging-logs prod prod-down prod-logs

# Default target
.DEFAULT_GOAL := help

# Variables
PYTHON := python3
PIP := pip3
FLASK_APP := run.py
NODE := node
NPM := npm

# Environment configuration
ENV_DIR := envs
DEV_ENV := $(ENV_DIR)/.env.development
STAGING_ENV := $(ENV_DIR)/.env.staging
PROD_ENV := $(ENV_DIR)/.env.production
LOCAL_ENV := $(ENV_DIR)/.env.development.local

# Help target
help:
	@echo "Available commands:"
	@echo ""
	@echo "Basic Development:"
	@echo "  install       - Install dependencies (Python + Node.js)"
	@echo "  run           - Run the development server"
	@echo "  test          - Run unit tests"
	@echo "  test-e2e      - Run Playwright end-to-end tests"
	@echo "  test-coverage - Run tests with coverage report"
	@echo "  clean         - Clean up temporary files"
	@echo "  clean-pycache - Clean Python cache files only"
	@echo "  lint          - Run code linting"
	@echo "  lint-all      - Run comprehensive linting with pre-commit"
	@echo "  format        - Format code"
	@echo "  check-env     - Verify environment file safety"
	@echo ""
	@echo "Docker Development (Recommended):"
	@echo "  dev           - Start development environment"
	@echo "  dev-build     - Start development environment with rebuild"
	@echo "  dev-down      - Stop development environment"
	@echo "  dev-logs      - View development logs"
	@echo "  logs-all      - Tail combined logs for all development services"
	@echo "  dev-override  - Start development with local overrides (if present)"
	@echo "  dev-override-build - Start development with overrides and rebuild"
	@echo "  dev-override-down  - Stop development with overrides"
	@echo "  dev-setup-overrides - Setup local development overrides template"
	@echo ""
	@echo "Docker Staging:"
	@echo "  staging       - Start staging environment"
	@echo "  staging-down  - Stop staging environment"
	@echo "  staging-logs  - View staging logs"
	@echo "  logs-all-staging - Tail combined logs for all staging services"
	@echo ""
	@echo "Docker Production:"
	@echo "  prod          - Start production environment"
	@echo "  prod-down     - Stop production environment"
	@echo "  prod-logs     - View production logs"
	@echo "  logs-all-prod - Tail combined logs for all production services"
	@echo ""
	@echo "Legacy Commands:"
	@echo "  build         - Build Docker image"
	@echo "  deploy        - Deploy with Docker Compose (deprecated)"
	@echo ""
	@echo "Docker Security & Hardening:"
	@echo "  docker-build        - Build hardened multi-stage Docker image"
	@echo "  docker-build-prod   - Build production-optimized image"
	@echo "  docker-verify       - Run Docker hardening verification"
	@echo "  docker-scan         - Run Trivy vulnerability scan"
	@echo "  docker-security-test - Test container security configuration"
	@echo "  docker-hardening-test - Complete Docker hardening validation"
	@echo "  docker-prod-up      - Start production Docker environment"
	@echo "  docker-clean        - Clean up Docker resources"
	@echo "  ci-setup      - Setup CI/CD environment"
	@echo "  frontend-build - Build frontend assets"
	@echo "  security-scan - Run security scans"
	@echo "  security-audit - Run dependency security audit"
	@echo ""
	@echo "Environment Management:"
	@echo "  run-dev       - Run with development environment"
	@echo "  run-staging   - Run with staging environment"
	@echo "  run-prod      - Run with production environment"
	@echo "  env-setup     - Setup environment files"
	@echo ""
	@echo "Database Management:"
	@echo "  migrate       - Run database migrations (development)"
	@echo "  migrate-staging - Run database migrations (staging)"
	@echo "  migrate-prod  - Run database migrations (production)"
	@echo "  migrate-create - Create new migration (MSG='description')"
	@echo "  migrate-init  - Initialize migration repository"

# Install dependencies
install:
	$(PIP) install -r requirements.txt
	$(NPM) install

# Install Python dependencies only
install-python:
	$(PIP) install -r requirements.txt

# Install Node.js dependencies only
install-node:
	$(NPM) install

# Run development server (default - uses local env if available, fallback to development)
run:
	@if [ -f "$(LOCAL_ENV)" ]; then \
		echo "Using local development environment..."; \
		export $$(cat $(LOCAL_ENV) | grep -v '^#' | xargs) && flask run --host=0.0.0.0 --port=8000; \
	elif [ -f "$(DEV_ENV)" ]; then \
		echo "Using development environment..."; \
		export $$(cat $(DEV_ENV) | grep -v '^#' | xargs) && flask run --host=0.0.0.0 --port=8000; \
	else \
		echo "No environment file found, using defaults..."; \
		export FLASK_APP=$(FLASK_APP) && export FLASK_ENV=development && flask run --host=0.0.0.0 --port=8000; \
	fi

# Run with specific environments
run-dev:
	@if [ -f "$(DEV_ENV)" ]; then \
		echo "Running with development environment..."; \
		export $$(cat $(DEV_ENV) | grep -v '^#' | xargs) && flask run --host=0.0.0.0 --port=8000; \
	else \
		echo "Development environment file not found: $(DEV_ENV)"; \
		exit 1; \
	fi

run-staging:
	@if [ -f "$(STAGING_ENV)" ]; then \
		echo "Running with staging environment..."; \
		export $$(cat $(STAGING_ENV) | grep -v '^#' | xargs) && flask run --host=0.0.0.0 --port=8001; \
	else \
		echo "Staging environment file not found: $(STAGING_ENV)"; \
		exit 1; \
	fi

run-prod:
	@if [ -f "$(PROD_ENV)" ]; then \
		echo "Running with production environment..."; \
		export $$(cat $(PROD_ENV) | grep -v '^#' | xargs) && flask run --host=0.0.0.0 --port=8002; \
	else \
		echo "Production environment file not found: $(PROD_ENV)"; \
		exit 1; \
	fi

# Environment setup and management
env-setup:
	@echo "Setting up environment files..."
	@mkdir -p $(ENV_DIR)
	@if [ ! -f "$(ENV_DIR)/.env.example" ]; then \
		echo "Creating example environment file..."; \
		cp envs/.env.example $(ENV_DIR)/.env.example 2>/dev/null || echo "No example file to copy"; \
	fi
	@if [ ! -f "$(DEV_ENV)" ]; then \
		echo "Creating development environment from example..."; \
		cp $(ENV_DIR)/.env.example $(DEV_ENV) 2>/dev/null || echo "Could not create development env"; \
	fi
	@echo "Environment files ready in $(ENV_DIR)/"
	@echo "Edit $(DEV_ENV) for local development settings"

# Environment safety checks
check-env:
	@echo "Checking environment file safety..."
	@if git ls-files --error-unmatch .env >/dev/null 2>&1; then \
		echo "❌ ERROR: .env should not be committed. Move to envs/"; \
		exit 1; \
	else \
		echo "✅ No raw .env files in repo."; \
	fi
	@if git ls-files --error-unmatch envs/.env.development.local >/dev/null 2>&1; then \
		echo "❌ ERROR: .env.development.local should not be committed (contains secrets)"; \
		exit 1; \
	else \
		echo "✅ Local development overrides properly gitignored."; \
	fi
	@echo "✅ Environment file safety check passed!"

# Run tests
test:
	$(PYTHON) -m pytest tests/ -v

# Run Playwright end-to-end tests
test-e2e:
	@echo "Running Playwright end-to-end tests..."
	@if command -v npx >/dev/null 2>&1; then \
		npx playwright test; \
	else \
		echo "❌ Playwright not installed. Run: npm install"; \
		exit 1; \
	fi

# Install Playwright browsers
test-e2e-install:
	@echo "Installing Playwright browsers..."
	npx playwright install

# Run tests with coverage
test-coverage:
	$(PYTHON) -m pytest tests/ -v --cov=app --cov-report=html --cov-report=term

# Clean up
clean:
	@echo "🧹 Cleaning up temporary files..."
	@python scripts/clean-pycaches.py
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	rm -rf .pytest_cache
	rm -rf build/
	rm -rf dist/
	@echo "✅ Cleanup complete!"

# Clean Python cache files only
clean-pycache:
	@python scripts/clean-pycaches.py

# Build Docker image
build:
	docker build -t kusse-tech-studio .

# Deploy with Docker Compose (deprecated - use specific environment targets)
deploy:
	@echo "⚠️  This command is deprecated. Use environment-specific targets:"
	@echo "   make dev      - Development environment"
	@echo "   make staging  - Staging environment" 
	@echo "   make prod     - Production environment"
	@echo ""
	@echo "Falling back to development environment..."
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml up -d

# Stop Docker services (deprecated - use specific environment targets)
stop:
	@echo "⚠️  This command is deprecated. Use environment-specific targets:"
	@echo "   make dev-down      - Stop development environment"
	@echo "   make staging-down  - Stop staging environment"
	@echo "   make prod-down     - Stop production environment"
	@echo ""
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml down

# View logs (deprecated - use specific environment targets)
logs:
	@echo "⚠️  This command is deprecated. Use environment-specific targets:"
	@echo "   make dev-logs      - Development logs"
	@echo "   make staging-logs  - Staging logs"
	@echo "   make prod-logs     - Production logs"
	@echo ""
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml logs -f

# Developer-friendly Docker commands
dev:
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml up

dev-build:
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml up --build

dev-down:
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml down

# Development with local overrides (uses docker-compose.override.yml if present)
dev-override:
	@if [ -f "infra/docker-compose.override.yml" ]; then \
		echo "🔧 Starting development with local overrides..."; \
		cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml -f docker-compose.override.yml up; \
	else \
		echo "ℹ️  No local overrides found. Copy infra/docker-compose.override.yml.template to infra/docker-compose.override.yml to customize."; \
		echo "Falling back to standard development environment..."; \
		cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml up; \
	fi

dev-override-build:
	@if [ -f "infra/docker-compose.override.yml" ]; then \
		echo "🔧 Building development with local overrides..."; \
		cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml -f docker-compose.override.yml up --build; \
	else \
		echo "ℹ️  No local overrides found. Using standard development build..."; \
		cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml up --build; \
	fi

dev-override-down:
	@if [ -f "infra/docker-compose.override.yml" ]; then \
		echo "🔧 Stopping development with local overrides..."; \
		cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml -f docker-compose.override.yml down; \
	else \
		cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml down; \
	fi

# Setup local development overrides
dev-setup-overrides:
	@if [ ! -f "infra/docker-compose.override.yml" ]; then \
		echo "📝 Setting up local development overrides..."; \
		cp infra/docker-compose.override.yml.template infra/docker-compose.override.yml; \
		echo "✅ Created infra/docker-compose.override.yml from template."; \
		echo "Edit this file to customize your local development environment."; \
		echo "Use 'make dev-override' to run with your customizations."; \
	else \
		echo "ℹ️  Local overrides already exist at infra/docker-compose.override.yml"; \
	fi

# Deploy to staging (unified deployment command)
staging:
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml down
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml pull
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml up -d

staging-down:
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml down

# Deploy to production (unified deployment command)
prod:
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml down
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml pull
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml up -d

prod-down:
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml down

# View logs for specific environments
dev-logs:
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml logs -f

staging-logs:
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml logs -f

prod-logs:
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml logs -f

# Enhanced logging - tail combined logs for all services
logs-all:
	@echo "Tailing logs for all development services..."
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml logs -f

logs-all-staging:
	@echo "Tailing logs for all staging services..."
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml logs -f

logs-all-prod:
	@echo "Tailing logs for all production services..."
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml logs -f

# Run linting
lint:
	flake8 app/ --max-line-length=88 --extend-ignore=E203,W503
	black --check app/

# Format code
format:
	black app/
	isort app/

# Enhanced linting with pre-commit integration
lint-all: lint format security-scan check-env
	@echo "Running pre-commit hooks on all files..."
	@if command -v pre-commit >/dev/null 2>&1; then \
		pre-commit run --all-files || echo "Pre-commit hooks completed with warnings"; \
	else \
		echo "⚠️  pre-commit not installed. Install with: pip install pre-commit"; \
	fi
	@echo "✅ All linting and security checks completed!"

# Setup development environment
setup-dev: install
	pre-commit install

# Backup database (if using SQLite)
backup:
	@if [ -f instance/kusse_tech_studio.db ]; then \
		cp instance/kusse_tech_studio.db backups/kusse_tech_studio_$(shell date +%Y%m%d_%H%M%S).db; \
		echo "Database backed up"; \
	else \
		echo "No database found"; \
	fi

# CI/CD Setup
ci-setup:
	$(PIP) install pytest pytest-cov flake8 black isort safety bandit
	$(NPM) install
	@echo "CI/CD environment setup complete"

# Frontend build
frontend-build:
	$(NPM) run build

# Frontend development
frontend-dev:
	$(NPM) run dev

# Security scan
security-scan:
	safety check -r requirements.txt
	bandit -r app/ -f json -o security-report.json || true
	@echo "Security scan complete. Check security-report.json for results."

# Dependency security audit
security-audit:
	@echo "Running dependency security audit..."
	@mkdir -p docs/security
	pip-audit --format=json --output=docs/security/pip-audit-report.json || true
	@echo "Dependency audit complete. Check docs/security/pip-audit-report.json for results."

# Run all CI checks locally
ci-local: lint test security-scan frontend-build
	@echo "All CI checks passed locally"

# Health check
health-check:
	curl -f http://localhost:5000/health || echo "Health check failed"

# Monitor logs  
monitor:
	docker-compose logs -f web

# Database Migration Support (Flask-Migrate/Alembic)
migrate:
	@echo "Running database migrations..."
	@if [ -d "migrations" ]; then \
		cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml exec web flask db upgrade; \
	else \
		echo "⚠️  No migrations directory found. Initialize with: flask db init"; \
	fi

migrate-staging:
	@echo "Running database migrations in staging..."
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml exec web flask db upgrade

migrate-prod:
	@echo "Running database migrations in production..."
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml exec web flask db upgrade

# Create new migration
migrate-create:
	@echo "Creating new migration..."
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml exec web flask db migrate -m "$(MSG)"

# Initialize migration repository
migrate-init:
	@echo "Initializing migration repository..."
	cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml exec web flask db init

# =========================================
# Docker & Security Hardening
# =========================================

# Build hardened multi-stage Docker image
docker-build:
	@echo "Building hardened multi-stage Docker image..."
	docker build -t kussestudio:latest .

# Build production-optimized image
docker-build-prod:
	@echo "Building production-optimized Docker image..."
	docker build -t kussestudio:production --target runtime .

# Run security verification
docker-verify:
	@echo "Running Docker hardening verification..."
	./scripts/docker-verify.sh

# Run Trivy vulnerability scan locally
docker-scan:
	@echo "Running Trivy vulnerability scan..."
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
		-v $(PWD):/tmp/.cache/ aquasecurity/trivy:latest \
		image --exit-code 0 --severity HIGH,CRITICAL kussestudio:latest

# Test container security
docker-security-test:
	@echo "Testing container security..."
	@echo "Checking if container runs as non-root user:"
	docker run --rm kussestudio:latest id
	@echo "Checking exposed ports:"
	docker inspect kussestudio:latest | grep -A 10 "ExposedPorts"
	@echo "Checking environment variables:"
	docker inspect kussestudio:latest | grep -A 20 "Env"

# Build and test complete hardened image
docker-hardening-test: docker-build docker-verify docker-scan docker-security-test
	@echo "Complete Docker hardening test passed!"

# Clean up Docker resources
docker-clean:
	docker system prune -f
	docker image prune -f
