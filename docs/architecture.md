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
