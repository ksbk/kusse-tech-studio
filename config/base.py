"""Base configuration settings."""

import os
from pathlib import Path


class HeroConfig:
    """Hero section configuration."""

    TITLE = os.getenv("HERO_TITLE", "Kusse Sukuta Bersha")
    SUBTITLE = os.getenv(
        "HERO_SUBTITLE", "Transforming quantum research into production AI"
    )
    TAGLINE = os.getenv(
        "HERO_TAGLINE",
        "Building impactful digital solutions that bridge research, technology, and real-world impact.",
    )
    STATUS_BADGE = os.getenv("HERO_STATUS_BADGE", "Available for New Projects")
    IMAGE_PATH = os.getenv("HERO_IMAGE_PATH", "images/hero/profile.webp")

    # Academic credentials
    EDUCATION_DEGREES = os.getenv(
        "HERO_EDUCATION_DEGREES", "PhD Chemistry • MSc Computer Science • BSc Physics"
    )
    EDUCATION_INSTITUTIONS = os.getenv(
        "HERO_EDUCATION_INSTITUTIONS",
        "University of Iceland • Erasmus Mundus • Mekelle University",
    )
    CITATIONS = os.getenv("HERO_CITATIONS", "15+ citations in Nature, Science & IEEE")

    # Trust indicators
    PROJECTS_COUNT = os.getenv("HERO_PROJECTS_COUNT", "50+")
    COUNTRIES_COUNT = os.getenv("HERO_COUNTRIES_COUNT", "5")

    # CTA buttons
    PRIMARY_CTA_TEXT = os.getenv("HERO_PRIMARY_CTA_TEXT", "View My Projects")
    PRIMARY_CTA_URL = os.getenv("HERO_PRIMARY_CTA_URL", "/projects/")
    SECONDARY_CTA_TEXT = os.getenv("HERO_SECONDARY_CTA_TEXT", "Learn More About Me")
    SECONDARY_CTA_URL = os.getenv("HERO_SECONDARY_CTA_URL", "/about/")


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
