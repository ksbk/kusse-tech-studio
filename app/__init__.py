import os

from dotenv import load_dotenv
from flask import Flask, Response, render_template, request
from flask_mail import Mail

# Load environment variables
load_dotenv()

# Initialize extensions
mail = Mail()


def create_app():
    """Application factory pattern"""
    app = Flask(__name__)

    # Configuration
    app.config["SECRET_KEY"] = os.environ.get(
        "SECRET_KEY", "dev-secret-key-change-in-production"
    )
    app.config["DEBUG"] = os.environ.get("FLASK_ENV") == "development"

    # Email configuration
    app.config["MAIL_SERVER"] = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    app.config["MAIL_PORT"] = int(os.environ.get("MAIL_PORT", 587))
    app.config["MAIL_USE_TLS"] = (
        os.environ.get("MAIL_USE_TLS", "True").lower() == "true"
    )
    app.config["MAIL_USERNAME"] = os.environ.get("MAIL_USERNAME")
    app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASSWORD")
    app.config["MAIL_DEFAULT_SENDER"] = os.environ.get("MAIL_USERNAME")

    # Initialize extensions with app
    mail.init_app(app)

    # Register blueprints
    from app.routes import blog, contact, health, home, main, portfolio, projects

    app.register_blueprint(main.bp)
    app.register_blueprint(home.bp)
    app.register_blueprint(blog.bp, url_prefix="/blog")
    app.register_blueprint(portfolio.bp, url_prefix="/portfolio")
    app.register_blueprint(contact.bp, url_prefix="/contact")
    app.register_blueprint(projects.bp, url_prefix="/projects")
    app.register_blueprint(health.bp, url_prefix="/api")

    # Register SEO routes
    from app.utils.seo import generate_sitemap

    generate_sitemap(app)

    # Add robots.txt
    @app.route("/robots.txt")
    def robots_txt():
        return Response(
            """User-agent: *
Allow: /
Sitemap: {}/sitemap.xml""".format(
                request.url_root.rstrip("/")
            ),
            mimetype="text/plain",
        )

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return render_template("errors/404.html"), 404

    @app.errorhandler(500)
    def internal_error(error):
        return render_template("errors/500.html"), 500

    return app
