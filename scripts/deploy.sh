#!/bin/bash

# KusseTechStudio Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment is provided
if [ -z "$1" ]; then
    log_error "Environment not specified. Usage: ./deploy.sh [staging|production]"
    exit 1
fi

ENVIRONMENT=$1

log_info "Starting deployment to $ENVIRONMENT environment..."

# Validate environment
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    log_error "Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

# Check if required files exist
if [ "$ENVIRONMENT" = "staging" ] && [ ! -f "docker-compose.staging.yml" ]; then
    log_error "docker-compose.staging.yml not found"
    exit 1
fi

if [ "$ENVIRONMENT" = "production" ] && [ ! -f "docker-compose.prod.yml" ]; then
    log_error "docker-compose.prod.yml not found"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    log_warn ".env file not found. Copying from .env.example"
    cp .env.example .env
    log_warn "Please update .env with your configuration before deploying"
    exit 1
fi

# Build frontend assets
log_info "Building frontend assets..."
npm run build

# Run tests before deployment
log_info "Running tests..."
make test

# Run security scan
log_info "Running security scan..."
make security-scan

# Build Docker image
log_info "Building Docker image..."
if [ "$ENVIRONMENT" = "production" ]; then
    docker build -t kussetechstudio/portfolio:latest .
else
    docker build -t kussetechstudio/portfolio:staging .
fi

# Deploy based on environment
if [ "$ENVIRONMENT" = "staging" ]; then
    log_info "Deploying to staging..."
    docker-compose -f docker-compose.staging.yml down
    docker-compose -f docker-compose.staging.yml up -d
    
    # Wait for services to start
    sleep 10
    
    # Health check
    log_info "Performing health check..."
    if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
        log_info "Staging deployment successful!"
    else
        log_error "Health check failed"
        exit 1
    fi
    
elif [ "$ENVIRONMENT" = "production" ]; then
    # Additional checks for production
    log_warn "Deploying to PRODUCTION. This action cannot be undone."
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Deployment cancelled"
        exit 1
    fi
    
    # Backup database if exists
    if [ -f "instance/kusse_tech_studio.db" ]; then
        log_info "Creating database backup..."
        make backup
    fi
    
    log_info "Deploying to production..."
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to start
    sleep 15
    
    # Health check
    log_info "Performing health check..."
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        log_info "Production deployment successful!"
        
        # Send notification (if Slack webhook is configured)
        if [ ! -z "$SLACK_WEBHOOK" ]; then
            curl -X POST -H 'Content-type: application/json' \
                --data '{"text":"✅ KusseTechStudio deployed to production successfully!"}' \
                "$SLACK_WEBHOOK"
        fi
    else
        log_error "Health check failed"
        exit 1
    fi
fi

log_info "Deployment completed successfully!"
log_info "You can monitor the logs with: make monitor"
