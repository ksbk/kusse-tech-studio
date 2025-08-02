"""Blog-related routes."""

from flask import Blueprint, render_template

# Create blueprint
blog_bp = Blueprint("blog", __name__, url_prefix="/blog")


@blog_bp.route("/")
def index():
    """Blog page route."""
    # Placeholder for future blog functionality
    return render_template("pages/blog.html", title="Blog - KusseTechStudio")
