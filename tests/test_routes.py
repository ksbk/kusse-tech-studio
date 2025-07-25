import pytest
from flask import url_for


class TestRoutes:
    """Test all route endpoints."""
    
    def test_home_page(self, client):
        """Test home page loads correctly."""
        response = client.get('/')
        assert response.status_code == 200
        assert b'KusseTechStudio' in response.data
    
    def test_health_endpoint(self, client):
        """Test health check endpoint."""
        response = client.get('/api/health')
        assert response.status_code == 200
        json_data = response.get_json()
        assert json_data['status'] == 'ok'
        assert json_data['service'] == 'kusse-tech-studio'
    
    def test_projects_page(self, client):
        """Test projects listing page."""
        response = client.get('/projects/')
        assert response.status_code == 200
        assert b'Projects' in response.data
    
    def test_project_detail(self, client):
        """Test individual project detail page."""
        response = client.get('/projects/1')
        assert response.status_code == 200
    
    def test_contact_page_get(self, client):
        """Test contact page loads correctly."""
        response = client.get('/contact/')
        assert response.status_code == 200
        assert b'contact' in response.data.lower()
    
    def test_contact_page_post(self, client):
        """Test contact form submission."""
        response = client.post('/contact/', data={
            'name': 'Test User',
            'email': 'test@example.com',
            'message': 'Test message'
        })
        assert response.status_code == 302  # Redirect after successful submission
    
    def test_services_page(self, client):
        """Test services page."""
        response = client.get('/services')
        assert response.status_code == 200
        assert b'services' in response.data.lower()
    
    def test_404_error(self, client):
        """Test 404 error handling."""
        response = client.get('/nonexistent-page')
        assert response.status_code == 404
