# CI/CD Setup Guide for KusseTechStudio

This document explains the complete CI/CD pipeline setup for the KusseTechStudio portfolio website.

## 🏗️ Pipeline Overview

The CI/CD pipeline consists of:

1. **Continuous Integration (CI)**

   - Code linting and formatting
   - Unit and integration tests
   - Security scans
   - Frontend asset building
   - Docker image building

2. **Continuous Deployment (CD)**
   - Staging deployment (develop branch)
   - Production deployment (main branch)
   - Health checks
   - Notifications

## 📁 CI/CD Files Structure

```
.github/
├── workflows/
│   ├── ci-cd.yml          # Main CI/CD pipeline
│   ├── frontend.yml       # Frontend-specific builds
│   └── security.yml       # Security audits
├── ISSUE_TEMPLATE/        # Issue templates
└── PULL_REQUEST_TEMPLATE/ # PR templates

scripts/
├── deploy.sh             # Local deployment script
└── setup.sh             # Environment setup script

# Configuration files
.flake8                   # Python linting config
.eslintrc.json           # JavaScript linting config
.stylelintrc.json        # CSS/SCSS linting config
pytest.ini               # Test configuration
pyproject.toml           # Python project config
package.json             # Node.js dependencies
webpack.config.js        # Frontend build config
```

## 🔧 Setup Instructions

### 1. GitHub Repository Setup

1. **Create repository secrets** in GitHub Settings → Secrets and variables → Actions:

```bash
# Docker Hub credentials
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password

# Staging server credentials
STAGING_HOST=staging.example.com
STAGING_USER=deploy
STAGING_SSH_KEY=your-staging-private-key

# Production server credentials
PRODUCTION_HOST=example.com
PRODUCTION_USER=deploy
PRODUCTION_SSH_KEY=your-production-private-key
PRODUCTION_URL=https://example.com

# Notifications
SLACK_WEBHOOK=your-slack-webhook-url

# Environment variables
SECRET_KEY=your-production-secret-key
DATABASE_URL=your-production-database-url
```

2. **Enable GitHub Actions** in repository settings
3. **Set up branch protection rules** for main branch

### 2. Local Development Setup

```bash
# Install dependencies
make install

# Setup CI environment locally
make ci-setup

# Copy environment template
cp .env.example .env
# Edit .env with your configuration

# Run all CI checks locally
make ci-local
```

### 3. Server Setup

#### Staging Server Setup

```bash
# Create user and directories
sudo useradd -m -s /bin/bash deploy
sudo mkdir -p /var/www/kusse-tech-studio-staging
sudo chown deploy:deploy /var/www/kusse-tech-studio-staging

# Install Docker and Docker Compose
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker deploy

# Clone repository
cd /var/www/kusse-tech-studio-staging
git clone https://github.com/username/kusse-tech-studio.git .
git checkout develop

# Setup environment
cp .env.example .env
# Edit .env for staging configuration
```

#### Production Server Setup

```bash
# Similar to staging but with main branch
cd /var/www/kusse-tech-studio
git clone https://github.com/username/kusse-tech-studio.git .
git checkout main

# Setup production environment
cp .env.example .env
# Edit .env for production configuration
```

## 🚀 Pipeline Workflows

### Main CI/CD Pipeline (`ci-cd.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main`

**Jobs:**

1. **Test Suite**

   - Python linting (flake8, black, isort)
   - Frontend linting (ESLint, Stylelint)
   - Unit tests with coverage
   - Integration tests

2. **Security Scan**

   - Python dependency vulnerability check (safety)
   - Static code analysis (bandit)
   - SAST scanning (semgrep)

3. **Build**

   - Multi-platform Docker image build
   - Push to Docker Hub (on main/develop)

4. **Deploy Staging** (develop branch only)

   - SSH deployment to staging server
   - Health check verification

5. **Deploy Production** (main branch only)
   - SSH deployment to production server
   - Health check verification
   - Slack notification

### Frontend Pipeline (`frontend.yml`)

**Triggers:**

- Changes to `app/static/src/**`
- Changes to `package.json`

**Jobs:**

- SCSS/CSS linting
- JavaScript linting
- Asset compilation
- Image optimization
- Bundle size analysis

### Security Pipeline (`security.yml`)

**Triggers:**

- Weekly scheduled runs
- Manual dispatch

**Jobs:**

- Automated security scans
- Dependency vulnerability checks
- Create issues for found vulnerabilities

## 🛠️ Available Make Commands

```bash
# Development
make install          # Install all dependencies
make run             # Run development server
make frontend-dev    # Run frontend in watch mode

# Testing & Quality
make test            # Run all tests
make lint            # Run all linters
make format          # Format all code
make security-scan   # Run security scans
make ci-local        # Run all CI checks locally

# Building & Deployment
make frontend-build  # Build frontend assets
make build          # Build Docker image
make deploy-staging # Deploy to staging
make deploy-production # Deploy to production

# Monitoring
make health-check   # Check application health
make monitor        # Monitor application logs
make backup         # Backup database
```

## 📊 Monitoring & Notifications

### Health Checks

- Automated health checks after deployment
- Endpoint: `/api/health`
- Returns service status and version

### Notifications

- Slack notifications for deployment status
- GitHub commit status updates
- Email notifications for failed builds

### Monitoring

- Application logs via Docker Compose
- Prometheus metrics (production)
- Performance monitoring

## 🔒 Security Features

1. **Automated Security Scans**

   - Dependency vulnerability scanning
   - Static code analysis
   - Container image scanning

2. **Secrets Management**

   - GitHub Secrets for sensitive data
   - Environment variable injection
   - SSH key management

3. **Access Control**
   - Branch protection rules
   - Required reviews for production
   - Deployment environments

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**

   ```bash
   # Check logs
   make monitor

   # Run tests locally
   make ci-local
   ```

2. **Deployment Issues**

   ```bash
   # Check deployment status
   make health-check

   # Manual deployment
   ./scripts/deploy.sh staging
   ```

3. **Frontend Build Issues**
   ```bash
   # Clean and rebuild
   npm run clean
   make frontend-build
   ```

### Debug Commands

```bash
# Check Docker containers
docker ps
docker logs kusse-tech-studio_web_1

# Check application logs
tail -f logs/app.log

# Test database connection
python -c "from app import create_app; app = create_app(); print('App created successfully')"
```

## 📈 Performance Optimization

1. **Docker Image Optimization**

   - Multi-stage builds
   - Minimal base images
   - Layer caching

2. **Frontend Optimization**

   - Asset minification
   - Image optimization
   - Bundle splitting

3. **Deployment Optimization**
   - Rolling deployments
   - Health check timeouts
   - Resource limits

## 🔄 Branching Strategy

- `main` → Production deployments
- `develop` → Staging deployments
- `feature/*` → Feature development
- `hotfix/*` → Emergency fixes

## 📝 Contributing

1. Create feature branch from `develop`
2. Make changes and commit
3. Run `make ci-local` to verify
4. Create pull request to `develop`
5. After review, merge to `develop`
6. Staging deployment happens automatically
7. Create PR from `develop` to `main` for production
