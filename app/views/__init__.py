"""Views package for organizing Flask blueprints."""

from flask import Flask

from .auth import auth_bp
from .blog import blog_bp
from .home import home_bp
from .projects import projects_bp


def register_blueprints(app: Flask) -> None:
    """Register all blueprints with the Flask application."""
    app.register_blueprint(home_bp)
    app.register_blueprint(projects_bp)
    app.register_blueprint(blog_bp)
    app.register_blueprint(auth_bp)
