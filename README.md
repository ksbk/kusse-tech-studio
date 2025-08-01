# KusseTechStudio - Personal Portfolio

A professional portfolio website built with Flask, showcasing Python development and data automation expertise.

## 🚀 Quick Start

1. **Clone and Setup Environment**:

   ```bash
   git clone <repository-url>
   cd kusse-tech-studio

   # Setup development environment (creates .env symlink)
   bash scripts/env-setup.sh dev
   ```

2. **Run with Docker (Recommended)**:

   ```bash
   # Development with hot reload
   make dev

   # View logs
   make dev-logs
   ```

3. **Or run with Python directly**:
   ```bash
   python scripts/setup.py
   source venv/bin/activate
   python run.py
   ```

Visit `http://127.0.0.1:8000` (Docker) or `http://127.0.0.1:5000` (Python) to view the application.

## 🏗️ Gold Standard Architecture

This project follows a clean, production-ready directory structure optimized for maintainability and professional development workflows.

### Infrastructure Structure

```text
kusse-tech-studio/
├── README.md                     # Project documentation
├── .env.example                  # Environment template
├── .env                         # Symlink to envs/.env.development
├── requirements.txt             # Python dependencies
├── package.json                 # Node.js dependencies
├── run.py                       # Application entry point
├── Dockerfile                   # Container configuration
├── Makefile                     # Development automation
│
├── envs/                        # Environment configurations
│   ├── .env.development         # Development environment
│   ├── .env.staging            # Staging environment
│   └── .env.production         # Production environment
│
├── infra/                       # Docker infrastructure
│   ├── docker-compose.base.yml      # Base services
│   ├── docker-compose.development.yml # Development overrides
│   ├── docker-compose.staging.yml     # Staging overrides
│   ├── docker-compose.production.yml  # Production overrides
│   └── nginx/                        # Nginx configuration
│
├── scripts/                     # Automation scripts
│   ├── env-setup.sh            # Environment management
│   ├── build.sh               # Build automation
│   └── deploy.sh              # Deployment script
│
├── config/                      # Configuration management
│   ├── base.py                 # Base configuration
│   ├── development.py          # Development settings
│   ├── production.py           # Production settings
│   └── staging.py              # Staging settings
│
├── app/                     # Main application
│   ├── __init__.py         # Application factory
│   ├── extensions.py       # Flask extensions
│   ├── core/               # Core application logic
│   │   ├── views.py        # Route handlers
│   │   ├── utils.py        # Utility functions
│   │   ├── security.py     # Security utilities
│   │   └── analytics.py    # Analytics integration
│   ├── templates/          # Jinja2 templates
│   │   ├── base.html       # Base template
│   │   ├── index.html      # Homepage
│   │   ├── about.html      # About page
│   │   ├── projects.html   # Projects showcase
│   │   ├── contact.html    # Contact page
│   │   ├── partials/       # Reusable components
│   │   └── errors/         # Error pages
│   └── static/             # Compiled static assets
│       ├── css/           # Stylesheets
│       ├── js/            # JavaScript
│       └── images/        # Images
│
├── src/                     # Source assets
│   ├── scss/               # Sass stylesheets
│   ├── js/                 # JavaScript modules
│   └── images/             # Source images
│
├── tests/                   # Test suite
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
│
├── scripts/                 # Development scripts
├── docs/                    # Documentation
└── .github/workflows/       # CI/CD workflows
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd kusse-tech-studio
   ```

2. **Set up the environment**:

   ```bash
   python scripts/setup.py
   ```

3. **Activate virtual environment**:

   ```bash
   source venv/bin/activate
   ```

4. **Configure environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Build assets**:

   ```bash
   npm run build
   ```

6. **Start the application**:
   ```bash
   flask run
   ```

Visit `http://127.0.0.1:5000` to view the application.

## 🛠️ Development

### Building Assets

```bash
# Production build
npm run build

# Development with watch
npm run dev
```

### Running Tests

```bash
# All tests
pytest

# Specific test types
pytest tests/unit/
pytest tests/integration/
pytest tests/e2e/
```

### Code Quality

```bash
# Python linting
flake8 app/ tests/
black app/ tests/
isort app/ tests/

# JavaScript/CSS linting
npm run lint:js
npm run lint:css
npm run format
```

## 🐳 Docker Infrastructure

### Environment Management

This project uses a centralized environment file policy. See [docs/environment-policy.md](docs/environment-policy.md) for complete details.

**Quick Commands:**

```bash
# Setup development environment
bash scripts/env-setup.sh dev

# Check current environment status
bash scripts/env-setup.sh status

# Verify all environment files
bash scripts/env-setup.sh verify
```

### Docker Deployment

**Development:**

```bash
# Start development environment (with hot reload)
make dev

# Build and start development
make dev-build

# View development logs
make dev-logs

# Stop development environment
make dev-down
```

**Staging:**

```bash
# Start staging environment
make staging

# View staging logs
make staging-logs

# Stop staging environment
make staging-down
```

**Production:**

```bash
# Start production environment
make prod

# View production logs
make prod-logs

# Stop production environment
make prod-down
```

**Manual Docker Compose:**

```bash
# Development
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.development.yml up

# Staging
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.staging.yml up -d

# Production
cd infra && docker-compose -f docker-compose.base.yml -f docker-compose.production.yml up -d
```

## 📊 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Webpack asset pipeline, image optimization
- **SEO Ready**: Meta tags, sitemap, structured data
- **Analytics Integration**: Google Analytics support
- **Contact Form**: With email notifications
- **Project Showcase**: Interactive project gallery
- **Professional UI/UX**: Clean, modern design

## 🔧 Configuration

The application uses a modular configuration system:

- `config/development.py`: Development settings
- `config/staging.py`: Staging settings
- `config/production.py`: Production settings

Configure via environment variables in `.env` file.

## 📚 Documentation

- [Development Guide](docs/development.md)
- [Deployment Guide](docs/deployment.md)
- [Architecture Overview](docs/architecture.md)

## 🚀 Deployment

The application is configured for deployment on:

- **Heroku**: Via Dockerfile
- **DigitalOcean**: Via Docker Compose
- **AWS**: Via container services
- **Traditional VPS**: Via Docker or manual setup

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the test suite
6. Create a pull request

## 📧 Contact

For questions or support, please contact:

- Email: contact@kussetechstudio.com
- Website: https://kussetechstudio.com
