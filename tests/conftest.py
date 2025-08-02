import os
import sys

import pytest

# Add the project root directory to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    from app import create_app

    app = create_app()
    app.config["TESTING"] = True
    app.config["SECRET_KEY"] = (
        os.environ.get("SECRET_KEY") or "test-secret-key-change-in-prod"
    )

    with app.app_context():
        yield app


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()
