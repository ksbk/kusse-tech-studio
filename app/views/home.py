"""Home and main page routes."""

from flask import Blueprint, render_template

from app.core.utils import track_event, track_route_event
from app.models.project import ProjectRepository

# Create blueprint
home_bp = Blueprint("home", __name__)

# Get repositories
project_repo = ProjectRepository()


@home_bp.route("/")
@track_route_event("Viewed Homepage")
def index():
    """Homepage route."""
    featured_projects = project_repo.get_featured()

    # Track homepage visit with featured project count
    track_event(
        "Homepage Loaded",
        {"featured_projects_count": len(featured_projects), "page_type": "homepage"},
    )

    return render_template(
        "pages/home.html",
        title="KusseTechStudio - Python Development & Data Solutions",
        featured_projects=featured_projects,
    )


@home_bp.route("/about")
@track_route_event("Viewed About Page")
def about():
    """About page route."""
    return render_template("pages/about.html", title="About - KusseTechStudio")


@home_bp.route("/services")
@track_route_event("Viewed Services Page")
def services():
    """Services page route."""
    from app.models.project import ServiceRepository

    service_repo = ServiceRepository()
    services_list = service_repo.get_all()

    # Track services page view
    track_event(
        "Services Page Loaded",
        {"services_count": len(services_list), "page_type": "services"},
    )

    return render_template(
        "pages/services.html",
        services=services_list,
        title="Services - KusseTechStudio",
    )


@home_bp.route("/contact", methods=["GET", "POST"])
@track_route_event("Viewed Contact Page")
def contact():
    """Contact form page."""
    from flask import current_app, flash, redirect, request, url_for

    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        # Track contact form submission attempt
        track_event(
            "Contact Form Submitted",
            {
                "has_name": bool(name),
                "has_email": bool(email),
                "has_message": bool(message),
                "message_length": len(message or ""),
            },
        )

        if not all([name, email, message]):
            track_event(
                "Contact Form Validation Failed",
                {
                    "missing_fields": [
                        field
                        for field, value in [
                            ("name", name),
                            ("email", email),
                            ("message", message),
                        ]
                        if not value
                    ]
                },
            )
            flash("All fields are required.", "error")
            return redirect(url_for("home.contact"))

        try:
            # In a production app, you would send email here
            # For now, just show success message
            track_event(
                "Contact Form Success",
                {"sender_domain": email.split("@")[1] if "@" in email else "unknown"},
            )
            flash(
                f"Thank you {name}! Your message has been received. "
                "I will get back to you within 24 hours.",
                "success",
            )

        except Exception as e:
            current_app.logger.error(f"Contact form error: {e!s}")
            track_event(
                "Contact Form Error",
                {"error_type": type(e).__name__, "error_message": str(e)},
            )
            flash(
                "Thank you for your message! There was a minor issue "
                "but your message has been recorded.",
                "warning",
            )

        return redirect(url_for("home.contact"))

    return render_template("pages/contact.html", title="Contact - Kusse Tech Studio")


@home_bp.route("/health")
def health():
    """Health check endpoint for Docker health checks."""
    from flask import current_app

    return {
        "status": "healthy",
        "timestamp": current_app.config.get("STARTUP_TIME", "unknown"),
        "version": "2.0.0",
    }, 200
