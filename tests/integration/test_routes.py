"""Integration tests for routes."""

import pytest

from app import create_app


@pytest.fixture
def client():
    """Create test client."""
    app = create_app("testing")
    with app.test_client() as client:
        with app.app_context():
            yield client


class TestRoutes:
    """Test application routes."""

    def test_homepage(self, client):
        """Test homepage route."""
        response = client.get("/")
        assert response.status_code == 200

    def test_about_page(self, client):
        """Test about page."""
        response = client.get("/about")
        assert response.status_code == 200

    def test_projects_page(self, client):
        """Test projects page."""
        response = client.get("/projects/")
        assert response.status_code == 200

    def test_contact_page(self, client):
        """Test contact page."""
        response = client.get("/contact")
        assert response.status_code == 200
