"""
Testing configuration for Flask application.
"""

import os

from .base import Config


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False
    SECRET_KEY = os.environ.get("SECRET_KEY") or "test-secret-key-change-in-prod"
    MAIL_SUPPRESS_SEND = True
    SERVER_NAME = "localhost.localdomain"
