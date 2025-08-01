"""Staging configuration."""

from .production import ProductionConfig


class StagingConfig(ProductionConfig):
    """Staging configuration class."""

    DEVELOPMENT = True
    DEBUG = True
    TESTING = True

    # Staging-specific settings
    SQLALCHEMY_DATABASE_URI = "sqlite:///staging.db"

    @staticmethod
    def init_app(app):
        """Initialize staging-specific settings."""
        ProductionConfig.init_app(app)

        # Staging-specific initialization
        import logging

        logging.basicConfig(level=logging.INFO)
