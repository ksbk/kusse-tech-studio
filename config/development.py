"""Development configuration."""

from .base import Config


class DevelopmentConfig(Config):
    """Development configuration class."""

    DEBUG = True
    DEVELOPMENT = True

    # Database (if needed)
    SQLALCHEMY_DATABASE_URI = "sqlite:///dev.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Disable CSRF for development
    WTF_CSRF_ENABLED = False

    # Email settings (development)
    MAIL_SERVER = "localhost"
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
