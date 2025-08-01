"""Configuration module for the Flask application."""

import os

from .development import DevelopmentConfig
from .production import ProductionConfig
from .staging import StagingConfig

# Configuration mapping
config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "staging": StagingConfig,
    "default": DevelopmentConfig,
}


def get_config():
    """Get configuration based on environment."""
    return config.get(os.environ.get("FLASK_ENV", "development"), DevelopmentConfig)
