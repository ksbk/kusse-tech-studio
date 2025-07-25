.PHONY: help install run test clean build deploy ci-setup frontend-build

# Variables
PYTHON := python3
PIP := pip3
FLASK_APP := run.py
NODE := node
NPM := npm

# Help target
help:
	@echo "Available commands:"
	@echo "  install       - Install dependencies (Python + Node.js)"
	@echo "  run           - Run the development server"
	@echo "  test          - Run tests"
	@echo "  clean         - Clean up temporary files"
	@echo "  build         - Build Docker image"
	@echo "  deploy        - Deploy with Docker Compose"
	@echo "  lint          - Run code linting"
	@echo "  format        - Format code"
	@echo "  ci-setup      - Setup CI/CD environment"
	@echo "  frontend-build - Build frontend assets"
	@echo "  security-scan - Run security scans"

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

# Run development server
run:
	export FLASK_APP=$(FLASK_APP) && \
	export FLASK_ENV=development && \
	flask run --host=0.0.0.0 --port=8000

# Run tests
test:
	$(PYTHON) -m pytest tests/ -v

# Clean up
clean:
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf .pytest_cache
	rm -rf build/
	rm -rf dist/

# Build Docker image
build:
	docker build -t kusse-tech-studio .

# Deploy with Docker Compose
deploy:
	docker-compose up -d

# Stop Docker services
stop:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Run linting
lint:
	flake8 app/ --max-line-length=88 --extend-ignore=E203,W503
	black --check app/

# Format code
format:
	black app/
	isort app/

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

# Run all CI checks locally
ci-local: lint test security-scan frontend-build
	@echo "All CI checks passed locally"

# Deploy to staging
deploy-staging:
	docker-compose -f docker-compose.staging.yml down
	docker-compose -f docker-compose.staging.yml pull
	docker-compose -f docker-compose.staging.yml up -d

# Deploy to production
deploy-production:
	docker-compose -f docker-compose.prod.yml down
	docker-compose -f docker-compose.prod.yml pull
	docker-compose -f docker-compose.prod.yml up -d

# Health check
health-check:
	curl -f http://localhost:5000/api/health || echo "Health check failed"

# Monitor logs
monitor:
	docker-compose logs -f web
