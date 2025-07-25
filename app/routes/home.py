from flask import Blueprint, render_template

bp = Blueprint("home", __name__)


@bp.route("/")
def index():
    """Home page route"""
    return render_template(
        "pages/home.html", title="KusseTechStudio - Python Development & Data Solutions"
    )


@bp.route("/about")
def about():
    """About page route"""
    return render_template("pages/about.html", title="About - KusseTechStudio")
