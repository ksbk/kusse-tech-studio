"""Application factory for the Flask app."""

from datetime import datetime

from flask import Flask, Response, request

from app.extensions import init_extensions
from config import get_config


def create_app(config_name=None):
    """Application factory pattern."""
    app = Flask(__name__)

    # Load configuration
    if config_name is None:
        config_class = get_config()
    else:
        from config import config

        config_class = config.get(config_name, config["default"])
    app.config.from_object(config_class)
    config_class.init_app(app)

    # Set startup time for health checks
    app.config["STARTUP_TIME"] = datetime.now().isoformat()

    # Initialize extensions
    init_extensions(app)

    # Register Vite asset helper as Jinja context processor
    from app.core.utils import get_vite_asset

    @app.context_processor
    def inject_vite_assets():
        """Make vite_asset function available in templates."""
        return dict(vite_asset=get_vite_asset)

    # Register hero configuration as Jinja context processor
    from config.base import HeroConfig

    @app.context_processor
    def inject_hero_config():
        """Make hero configuration available in templates."""
        return dict(hero=HeroConfig)

    # Register blueprints using the new views package
    from app.views import register_blueprints

    register_blueprints(app)

    # Register error handlers
    from app.core.errors import register_error_handlers, register_offline_route

    register_error_handlers(app)
    register_offline_route(app)

    # Add SEO routes
    @app.route("/robots.txt")
    def robots_txt():
        """Generate robots.txt."""
        return Response(
            f"""User-agent: *
Allow: /
Sitemap: {request.url_root.rstrip("/")}/sitemap.xml""",
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
