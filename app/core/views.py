"""Main application views and routes."""

from flask import (
    Blueprint,
    abort,
    current_app,
    flash,
    redirect,
    render_template,
    request,
    url_for,
)

from app.models.project import ProjectRepository, ServiceRepository

# Create main blueprint
main = Blueprint("main", __name__)

# Get repositories
project_repo = ProjectRepository()
service_repo = ServiceRepository()


@main.route("/")
def index():
    """Homepage route."""
    featured_projects = project_repo.get_featured()
    return render_template(
        "pages/home.html",
        title="KusseTechStudio - Python Development & Data Solutions",
        featured_projects=featured_projects,
    )


@main.route("/about")
def about():
    """About page route."""
    return render_template("pages/about.html", title="About - KusseTechStudio")


@main.route("/services")
def services():
    """Services page route."""
    services_list = service_repo.get_all()
    return render_template(
        "pages/services.html",
        services=services_list,
        title="Services - KusseTechStudio",
    )


@main.route("/projects")
def projects():
    """Projects listing page."""
    projects_list = project_repo.get_all()
    return render_template(
        "pages/projects.html",
        projects=projects_list,
        title="Projects - KusseTechStudio",
    )


@main.route("/projects/<int:project_id>")
def project_detail(project_id):
    """Individual project detail page."""
    project = project_repo.get_by_id(project_id)

    if not project:
        abort(404)

    return render_template(
        "project_detail.html",
        project=project,
        title=f"{project.title} - KusseTechStudio",
    )


@main.route("/blog")
def blog():
    """Blog page route."""
    # Placeholder for future blog functionality
    return render_template("pages/blog.html", title="Blog - KusseTechStudio")


@main.route("/contact", methods=["GET", "POST"])
def contact():
    """Contact form page."""
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        if not all([name, email, message]):
            flash("All fields are required.", "error")
            return redirect(url_for("main.contact"))

        try:
            # In a production app, you would send email here
            # For now, just show success message
            flash(
                f"Thank you {name}! Your message has been received. "
                "I will get back to you within 24 hours.",
                "success",
            )

        except Exception as e:
            current_app.logger.error(f"Contact form error: {str(e)}")
            flash(
                "Thank you for your message! There was a minor issue "
                "but your message has been recorded.",
                "warning",
            )

        return redirect(url_for("main.contact"))

    return render_template("pages/contact.html", title="Contact - Kusse Tech Studio")


@main.route("/health")
def health():
    """Health check endpoint for Docker health checks."""
    return {
        "status": "healthy",
        "timestamp": current_app.config.get("STARTUP_TIME", "unknown"),
        "version": "2.0.0",
    }, 200


# Error handlers
@main.app_errorhandler(404)
def not_found_error(error):
    """Handle 404 errors."""
    return render_template("errors/404.html"), 404


@main.app_errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return render_template("errors/500.html"), 500
