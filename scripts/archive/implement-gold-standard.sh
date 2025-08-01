#!/bin/bash

# Gold Standard Directory Structure Implementation
# Personal Portfolio Website - Flask Framework
# This script transforms the current structure into a professional, production-ready layout

set -e

echo "🚀 Implementing Gold Standard Directory Structure..."

# Create base directories
echo "📁 Creating base directory structure..."
mkdir -p config/{__pycache__}
mkdir -p app/core/{__pycache__}
mkdir -p app/templates/{partials,errors}
mkdir -p app/static/{css,js,images/{hero,projects,icons},fonts}
mkdir -p src/{scss/{abstracts,base,components,layout,pages},js/{components,utils},images/{hero,projects,about,icons}}
mkdir -p tests/{unit,integration,e2e/playwright}
mkdir -p scripts
mkdir -p .github/workflows

echo "⚙️ Creating configuration module..."

# Create config/__init__.py
cat >config/__init__.py <<'EOF'
"""Configuration module for the Flask application."""

import os
from .base import Config
from .development import DevelopmentConfig
from .production import ProductionConfig
from .staging import StagingConfig

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'staging': StagingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Get configuration based on environment."""
    return config.get(os.environ.get('FLASK_ENV', 'development'), DevelopmentConfig)
EOF

# Create config/base.py
cat >config/base.py <<'EOF'
"""Base configuration settings."""

import os
from pathlib import Path

class Config:
    """Base configuration class."""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = False
    TESTING = False
    
    # Application settings
    APP_NAME = 'Kusse Tech Studio'
    APP_VERSION = '2.0.0'
    
    # Paths
    BASE_DIR = Path(__file__).parent.parent
    STATIC_FOLDER = 'static'
    TEMPLATE_FOLDER = 'templates'
    
    # Security settings
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = None
    
    # Analytics
    GOOGLE_ANALYTICS_ID = os.environ.get('GOOGLE_ANALYTICS_ID')
    
    # Contact form
    CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'contact@kussetech.com')
    
    # Performance
    SEND_FILE_MAX_AGE_DEFAULT = 31536000  # 1 year cache for static files
    
    @staticmethod
    def init_app(app):
        """Initialize application with this configuration."""
        pass
EOF

# Create config/development.py
cat >config/development.py <<'EOF'
"""Development configuration."""

from .base import Config

class DevelopmentConfig(Config):
    """Development configuration class."""
    
    DEBUG = True
    DEVELOPMENT = True
    
    # Database (if needed)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dev.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Disable CSRF for development
    WTF_CSRF_ENABLED = False
    
    # Email settings (development)
    MAIL_SERVER = 'localhost'
    MAIL_PORT = 1025  # MailHog
    MAIL_USE_TLS = False
    MAIL_USE_SSL = False
    
    @staticmethod
    def init_app(app):
        """Initialize development-specific settings."""
        Config.init_app(app)
        
        # Development-specific initialization
        import logging
        logging.basicConfig(level=logging.DEBUG)
EOF

# Create config/production.py
cat >config/production.py <<'EOF'
"""Production configuration."""

import os
from .base import Config

class ProductionConfig(Config):
    """Production configuration class."""
    
    DEBUG = False
    TESTING = False
    
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    # Database (if needed)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///prod.db'
    
    # Email settings
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    
    # SSL redirect
    PREFERRED_URL_SCHEME = 'https'
    
    @staticmethod
    def init_app(app):
        """Initialize production-specific settings."""
        Config.init_app(app)
        
        # Production logging
        import logging
        from logging.handlers import RotatingFileHandler
        
        if not app.debug:
            file_handler = RotatingFileHandler(
                'logs/app.log', maxBytes=10240, backupCount=10
            )
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
            ))
            file_handler.setLevel(logging.INFO)
            app.logger.addHandler(file_handler)
            app.logger.setLevel(logging.INFO)
            app.logger.info('Application startup')
EOF

# Create config/staging.py
cat >config/staging.py <<'EOF'
"""Staging configuration."""

from .production import ProductionConfig

class StagingConfig(ProductionConfig):
    """Staging configuration class."""
    
    DEVELOPMENT = True
    DEBUG = True
    TESTING = True
    
    # Staging-specific settings
    SQLALCHEMY_DATABASE_URI = 'sqlite:///staging.db'
    
    @staticmethod
    def init_app(app):
        """Initialize staging-specific settings."""
        ProductionConfig.init_app(app)
        
        # Staging-specific initialization
        import logging
        logging.basicConfig(level=logging.INFO)
EOF

echo "🔧 Creating core application modules..."

# Create app/core/__init__.py
cat >app/core/__init__.py <<'EOF'
"""Core application modules."""
EOF

# Create app/extensions.py
cat >app/extensions.py <<'EOF'
"""Flask extensions initialization."""

# Import extensions here as they're added
# from flask_sqlalchemy import SQLAlchemy
# from flask_mail import Mail
# from flask_wtf.csrf import CSRFProtect

# Initialize extensions
# db = SQLAlchemy()
# mail = Mail()
# csrf = CSRFProtect()

def init_extensions(app):
    """Initialize Flask extensions."""
    # db.init_app(app)
    # mail.init_app(app)
    # csrf.init_app(app)
    pass
EOF

echo "📝 Creating test structure..."

# Create tests/unit/test_core.py
cat >tests/unit/test_core.py <<'EOF'
"""Unit tests for core functionality."""

import pytest
from app import create_app

class TestCore:
    """Test core application functionality."""
    
    def test_app_creation(self):
        """Test application factory."""
        app = create_app('testing')
        assert app is not None
        assert app.config['TESTING'] is True
    
    def test_config_loading(self):
        """Test configuration loading."""
        app = create_app('development')
        assert app.config['DEBUG'] is True
        
        app = create_app('production')
        assert app.config['DEBUG'] is False
EOF

# Create tests/integration/test_routes.py
cat >tests/integration/test_routes.py <<'EOF'
"""Integration tests for routes."""

import pytest
from app import create_app

@pytest.fixture
def client():
    """Create test client."""
    app = create_app('testing')
    with app.test_client() as client:
        with app.app_context():
            yield client

class TestRoutes:
    """Test application routes."""
    
    def test_homepage(self, client):
        """Test homepage route."""
        response = client.get('/')
        assert response.status_code == 200
    
    def test_about_page(self, client):
        """Test about page."""
        response = client.get('/about')
        assert response.status_code == 200
    
    def test_projects_page(self, client):
        """Test projects page."""
        response = client.get('/projects')
        assert response.status_code == 200
    
    def test_contact_page(self, client):
        """Test contact page."""
        response = client.get('/contact')
        assert response.status_code == 200
EOF

echo "🛠️ Creating build and deployment scripts..."

# Create scripts/build.sh
cat >scripts/build.sh <<'EOF'
#!/bin/bash

# Build script for static assets

echo "🔨 Building static assets..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build CSS from SCSS
echo "🎨 Compiling SCSS..."
npx sass src/scss/main.scss app/static/css/main.css --style compressed

# Build JavaScript
echo "📜 Building JavaScript..."
npx webpack --mode production

# Optimize images
echo "🖼️ Optimizing images..."
# Add image optimization commands here

echo "✅ Build complete!"
EOF

chmod +x scripts/build.sh

# Create scripts/setup.py
cat >scripts/setup.py <<'EOF'
#!/usr/bin/env python3

"""Development environment setup script."""

import subprocess
import sys
from pathlib import Path

def run_command(command):
    """Run shell command."""
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        sys.exit(1)
    return result.stdout

def main():
    """Set up development environment."""
    print("🚀 Setting up development environment...")
    
    # Create virtual environment
    print("🐍 Creating Python virtual environment...")
    run_command("python -m venv venv")
    
    # Install Python dependencies
    print("📦 Installing Python dependencies...")
    run_command("./venv/bin/pip install -r requirements.txt")
    
    # Install Node dependencies
    print("📦 Installing Node.js dependencies...")
    run_command("npm install")
    
    # Build assets
    print("🔨 Building initial assets...")
    run_command("./scripts/build.sh")
    
    # Create .env file if it doesn't exist
    env_file = Path(".env")
    if not env_file.exists():
        print("⚙️ Creating .env file...")
        env_file.write_text("""
FLASK_ENV=development
FLASK_APP=run.py
SECRET_KEY=dev-secret-key-change-in-production
GOOGLE_ANALYTICS_ID=
CONTACT_EMAIL=contact@kussetech.com
        """.strip())
    
    print("✅ Development environment setup complete!")
    print("\nTo start the application:")
    print("1. Activate virtual environment: source venv/bin/activate")
    print("2. Run the application: flask run")

if __name__ == "__main__":
    main()
EOF

chmod +x scripts/setup.py

echo "🔄 Creating GitHub workflows..."

# Create .github/workflows/ci.yml
cat >.github/workflows/ci.yml <<'EOF'
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        python-version: [3.9, 3.10, 3.11]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v3
      with:
        python-version: ${{ matrix.python-version }}
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Lint with flake8
      run: |
        pip install flake8
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
        flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
    
    - name: Test with pytest
      run: |
        pip install pytest pytest-cov
        pytest --cov=app --cov-report=xml
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
        flags: unittests
        name: codecov-umbrella
        fail_ci_if_error: true

  build:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install Node dependencies
      run: npm install
    
    - name: Build assets
      run: npm run build
    
    - name: Build Docker image
      run: docker build -t portfolio .
EOF

echo "📋 Creating updated .env.example..."

cat >.env.example <<'EOF'
# Flask Configuration
FLASK_ENV=development
FLASK_APP=run.py
SECRET_KEY=your-secret-key-here

# Application Settings
CONTACT_EMAIL=contact@kussetech.com
GOOGLE_ANALYTICS_ID=

# Database (if using)
DATABASE_URL=

# Email Configuration (production)
MAIL_SERVER=
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=
MAIL_PASSWORD=

# Security
WTF_CSRF_ENABLED=True
EOF

echo "📚 Creating updated documentation..."

cat >docs/development.md <<'EOF'
# Development Guide

## Quick Start

1. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd kusse-tech-studio
   python scripts/setup.py
   ```

2. **Activate Environment**:
   ```bash
   source venv/bin/activate
   ```

3. **Run Application**:
   ```bash
   flask run
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

## Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

## Adding New Features

1. Create feature branch
2. Add tests first (TDD)
3. Implement feature
4. Update documentation
5. Create pull request
EOF

echo "🎯 Final cleanup and organization..."

# Move current route files to temporary backup
mkdir -p temp_backup
if [[ -d "app/routes" ]]; then
	mv app/routes/* temp_backup/ 2>/dev/null || true
fi

echo "✨ Gold Standard Directory Structure implementation complete!"
echo ""
echo "📋 Summary of changes:"
echo "  ✅ Created professional configuration module (config/)"
echo "  ✅ Established clean core application structure (app/core/)"
echo "  ✅ Set up organized static asset pipeline (src/ → app/static/)"
echo "  ✅ Created comprehensive test structure"
echo "  ✅ Added development and deployment scripts"
echo "  ✅ Configured GitHub workflows for CI/CD"
echo "  ✅ Updated documentation and guides"
echo ""
echo "🔄 Next steps:"
echo "  1. Review and migrate existing routes to app/core/views.py"
echo "  2. Move existing templates to new structure"
echo "  3. Reorganize static assets"
echo "  4. Update imports in run.py and app/__init__.py"
echo "  5. Test the new structure"
echo ""
echo "💡 Your original route files are backed up in temp_backup/"
