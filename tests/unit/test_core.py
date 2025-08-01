"""Unit tests for core functionality."""

from app import create_app


class TestCore:
    """Test core application functionality."""

    def test_app_creation(self):
        """Test application factory."""
        app = create_app("testing")
        assert app is not None
        assert app.config["TESTING"] is True

    def test_config_loading(self):
        """Test configuration loading."""
        app = create_app("development")
        assert app.config["DEBUG"] is True

        app = create_app("production")
        assert app.config["DEBUG"] is False
