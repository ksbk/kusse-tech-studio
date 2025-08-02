"""Error handlers for the application."""

from flask import Flask, render_template


def register_error_handlers(app: Flask) -> None:
    """Register error handlers with the Flask application."""

    @app.errorhandler(404)
    def not_found_error(error):
        """Handle 404 errors."""
        return render_template("errors/404.html"), 404

    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors."""
        return render_template("errors/500.html"), 500


def register_offline_route(app: Flask) -> None:
    """Register offline route for service worker."""

    @app.route("/offline.html")
    def offline():
        """Serve offline page for service worker."""
        return render_template("errors/offline.html")
