"""Base configuration settings."""

import os
from pathlib import Path


class Config:
    """Base configuration class."""

    # Flask settings
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key-change-in-production"
    DEBUG = False
    TESTING = False

    # Application settings
    APP_NAME = "Kusse Tech Studio"
    APP_VERSION = "2.0.0"

    # Paths
    BASE_DIR = Path(__file__).parent.parent
    STATIC_FOLDER = "static"
    TEMPLATE_FOLDER = "templates"

    # Security settings
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = None

    # Analytics
    GOOGLE_ANALYTICS_ID = os.environ.get("GOOGLE_ANALYTICS_ID")

    # Contact form
    CONTACT_EMAIL = os.environ.get("CONTACT_EMAIL", "contact@kussetech.com")

    # Performance
    SEND_FILE_MAX_AGE_DEFAULT = 31536000  # 1 year cache for static files

    @staticmethod
    def init_app(app):
        """Initialize application with this configuration."""
        pass
