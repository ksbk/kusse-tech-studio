"""Application factory for the Flask app."""

from datetime import datetime

from flask import Flask, Response, request

from app.extensions import init_extensions
from config import get_config


def create_app(config_name=None):
    """Application factory pattern."""
    app = Flask(__name__)

    # Load configuration
    config_class = get_config() if config_name is None else config_name
    app.config.from_object(config_class)
    config_class.init_app(app)

    # Set startup time for health checks
    app.config["STARTUP_TIME"] = datetime.now().isoformat()

    # Initialize extensions
    init_extensions(app)

    # Register blueprints
    from app.core.views import main

    app.register_blueprint(main)

    # Add SEO routes
    @app.route("/robots.txt")
    def robots_txt():
        """Generate robots.txt."""
        return Response(
            f"""User-agent: *
Allow: /
Sitemap: {request.url_root.rstrip('/')}/sitemap.xml""",
            mimetype="text/plain",
        )

    @app.route("/sitemap.xml")
    def sitemap():
        """Generate sitemap.xml."""
        # In production, you might want to generate this dynamically
        return Response(
            f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>{request.url_root}</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>{request.url_root}about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>{request.url_root}services</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>{request.url_root}projects</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>{request.url_root}contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>""",
            mimetype="application/xml",
        )

    return app
