# 🚀 Developer Guide

Welcome to KusseTechStudio! This guide will help you get up and running quickly and understand the project structure.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Development Workflow](#-development-workflow)
- [Testing](#-testing)
- [Docker & Infrastructure](#-docker--infrastructure)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Code Quality](#-code-quality)
- [Security](#-security)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

## 🏃 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- **Python 3.11+** (for local development)
- **Node.js 18+** (for frontend build tools)
- **Make** (for convenient commands)

### Get Running in 2 Minutes

```bash
# 1. Clone the repository
git clone https://github.com/ksbk/kusse-tech-studio.git
cd kusse-tech-studio

# 2. Start development environment
make dev

# 3. Open in browser
open http://localhost:5000
```

That's it! The application should be running with hot reload enabled.

## 📁 Project Structure

```text
kusse-tech-studio/
├── 🐍 Backend (Flask)
│   ├── app/                    # Main application package
│   │   ├── core/              # Core utilities, errors, security
│   │   ├── models/            # Database models
│   │   ├── views/             # Route handlers (blueprints)
│   │   ├── templates/         # Jinja2 templates
│   │   └── static/            # Static assets (built frontend)
│   ├── config/                # Configuration classes
│   └── run.py                 # Application entry point
│
├── 🎨 Frontend (Vite + Tailwind)
│   ├── frontend/src/          # Frontend source code
│   │   ├── scripts/           # JavaScript modules
│   │   └── styles/            # SCSS stylesheets
│   ├── vite.config.js         # Vite build configuration
│   └── tailwind.config.js     # Tailwind CSS configuration
│
├── 🐳 Infrastructure
│   ├── infra/                 # Docker Compose configurations
│   │   ├── docker-compose.base.yml        # Base services
│   │   ├── docker-compose.development.yml # Development overrides
│   │   ├── docker-compose.staging.yml     # Staging overrides
│   │   └── docker-compose.production.yml  # Production overrides
│   ├── Dockerfile             # Multi-stage container build
│   └── Makefile              # Development commands
│
├── 🔧 Configuration
│   ├── envs/                  # Environment-specific config files
│   ├── .github/workflows/     # CI/CD pipeline definitions
│   └── scripts/              # Utility scripts
│
├── 📚 Documentation
│   ├── docs/                  # Project documentation
│   └── tests/                 # Test suites
│
└── 🔒 Security & Quality
    ├── .editorconfig          # Cross-editor consistency
    ├── .gitignore            # Git ignore patterns
    └── requirements.txt       # Python dependencies
```

## 🛠 Development Workflow

### Local Development Setup

#### Option 1: Docker (Recommended)

```bash
# Start development environment
make dev

# View logs
make dev-logs

# Rebuild after changes
make dev-build

# Stop environment
make dev-down
```

````

#### Option 2: Local Python Environment

```bash

### Frontend Development

```bash
# Install Node.js dependencies
npm install

# Start Vite development server (with hot reload)
npm run dev

# Build for production
npm run build

# Watch mode for development
npm run watch
````

### Common Development Commands

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `make dev`           | Start development environment |
| `make dev-build`     | Rebuild and start development |
| `make lint`          | Run code linting              |
| `make format`        | Auto-format code              |
| `make security-scan` | Run security scans            |
| `make clean-cache`   | Clean Python cache files      |
| `make test`          | Run test suite                |

## 🧪 Testing

### Running Tests

```bash
# Run all tests
make test

# Run specific test types
make test-unit           # Unit tests
make test-integration    # Integration tests
make test-e2e           # End-to-end tests

# Run tests with coverage
make test-coverage

# Run tests in watch mode
make test-watch
```

### Test Structure

```text
tests/
├── unit/               # Fast, isolated unit tests
├── integration/        # Integration tests with database
└── e2e/               # End-to-end browser tests
    └── playwright/     # Playwright test specs
```

### Writing Tests

```python
# Unit test example
def test_user_creation():
    user = User(email="test@example.com")
    assert user.email == "test@example.com"

# Integration test example
def test_login_endpoint(client, db):
    response = client.post('/auth/login', data={
        'email': 'test@example.com',
        'password': 'password123'
    })
    assert response.status_code == 200
```

## 🐳 Docker & Infrastructure

### Environment Management

The project uses a multi-environment Docker setup:

- **Development**: Hot reload, debugging tools, MailHog
- **Staging**: Production-like with some debugging enabled
- **Production**: Optimized, secure, with monitoring

### Docker Commands

```bash
# Development
make dev                 # Start development environment
make dev-override        # Start with local overrides

# Staging
make staging            # Deploy to staging
make staging-logs       # View staging logs

# Production
make prod               # Deploy to production
make prod-logs          # View production logs

# Utilities
make docker-verify      # Verify Docker configurations
make docker-clean       # Clean up Docker resources
```

### Local Customization

Create `infra/docker-compose.override.yml` for local-specific settings:

```yaml
version: "3.9"
services:
  web:
    volumes:
      - ../local-data:/app/local-data
    environment:
      - DEBUG_LEVEL=verbose
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

| Workflow     | Trigger          | Purpose                          |
| ------------ | ---------------- | -------------------------------- |
| **CI**       | Push, PR         | Linting, testing, security scans |
| **Frontend** | Frontend changes | Build and test frontend assets   |
| **Security** | Schedule, Push   | Security vulnerability scans     |

### Pipeline Stages

1. **Code Quality**

   - Linting (flake8, eslint)
   - Formatting (black, prettier)
   - Type checking (mypy)

2. **Testing**

   - Unit tests
   - Integration tests
   - End-to-end tests

3. **Security**

   - Dependency scanning
   - SAST analysis
   - Container scanning

4. **Build**

   - Docker image building
   - Frontend asset compilation
   - Artifact generation

5. **Deploy**
   - Staging deployment
   - Production deployment (manual approval)

### Branch Protection

- **main**: Requires PR review, passing CI
- **develop**: Automatic testing, staging deployment
- **feature/\***: Full CI pipeline

## ✨ Code Quality

### Code Standards

- **Python**: PEP 8, Black formatting, type hints
- **JavaScript**: ESLint, Prettier formatting
- **HTML/CSS**: Semantic markup, responsive design
- **Documentation**: Clear docstrings, README updates

### Pre-commit Hooks

```bash
# Install pre-commit hook
ln -sf ../../scripts/security/pre-commit.sh .git/hooks/pre-commit

# The hook automatically runs:
# - Code linting
# - Security scans
# - Cache cleanup
```

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Security considerations addressed
- [ ] Performance implications considered

## 🔒 Security

### Security Practices

- **Environment Variables**: Never commit secrets
- **Dependencies**: Regular security scanning
- **Input Validation**: Sanitize all user inputs
- **Authentication**: Secure session management
- **HTTPS**: SSL/TLS in production

### Security Tools

```bash
# Run security scan
make security-scan

# Check for known vulnerabilities
pip-audit

# Scan Docker images
make docker-security-scan
```

### Security Checklist

- [ ] Secrets stored in environment variables
- [ ] Dependencies regularly updated
- [ ] Input validation implemented
- [ ] CSRF protection enabled
- [ ] HTTPS configured in production

## 🚀 Deployment

### Deployment Environments

| Environment     | URL                      | Purpose                |
| --------------- | ------------------------ | ---------------------- |
| **Development** | localhost:5000           | Local development      |
| **Staging**     | staging.kussetech.studio | Pre-production testing |
| **Production**  | kussetech.studio         | Live application       |

### Deployment Process

1. **Feature Development**

   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

2. **Create Pull Request**

   - CI pipeline runs automatically
   - Code review required
   - Merge to main after approval

3. **Staging Deployment**

   - Automatic deployment to staging
   - Run integration tests
   - Stakeholder review

4. **Production Deployment**
   - Manual approval required
   - Zero-downtime deployment
   - Monitoring and rollback ready

### Environment Configuration

Each environment uses specific configuration:

```bash
# Development
FLASK_ENV=development
FLASK_DEBUG=True

# Staging
FLASK_ENV=staging
FLASK_DEBUG=False

# Production
FLASK_ENV=production
FLASK_DEBUG=False
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=5001 make dev
```

#### Docker Issues

```bash
# Reset Docker environment
make docker-clean
make dev

# Check Docker logs
make dev-logs

# Rebuild from scratch
make dev-build
```

#### Frontend Build Issues

```bash
# Clear Node.js cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild frontend
npm run build
```

#### Database Issues

```bash
# Reset development database
make db-reset

# Run migrations
make db-migrate

# Check database connection
make db-check
```

### Getting Help

1. **Check Documentation**: Start with this guide and `infra/README.md`
2. **Review Issues**: Check GitHub issues for similar problems
3. **Run Diagnostics**: Use `make doctor` to check system health
4. **Ask for Help**: Create an issue with detailed error information

### Debug Mode

```bash
# Enable debug logging
DEBUG=true make dev

# Run with verbose output
VERBOSE=true make dev

# Access container shell
make dev-shell
```

## 📞 Support

- **Documentation**: Check `docs/` directory
- **Issues**: GitHub Issues for bugs and features
- **Discussions**: GitHub Discussions for questions
- **Security**: Email <security@kussetech.studio> for security issues

---

## Happy coding! 🎉

> This guide is living documentation. Please update it as you discover new patterns or solutions.
