from flask import Blueprint, render_template

bp = Blueprint("main", __name__)


@bp.route("/services")
def services():
    """Services page route"""
    services = [
        {
            "title": "Data Automation",
            "description": "Automate repetitive data tasks with custom "
            "Python solutions",
            "icon": "fas fa-robot",
            "features": [
                "Web Scraping",
                "Data Processing",
                "Report Generation",
                "API Integration",
            ],
        },
        {
            "title": "Web Development",
            "description": "Modern web applications built with Python and Flask",
            "icon": "fas fa-code",
            "features": [
                "Flask Applications",
                "REST APIs",
                "Database Design",
                "Responsive UI",
            ],
        },
        {
            "title": "Business Intelligence",
            "description": "Transform your data into actionable business insights",
            "icon": "fas fa-chart-line",
            "features": [
                "Data Visualization",
                "Dashboard Creation",
                "Analytics",
                "Reporting",
            ],
        },
    ]

    return render_template(
        "pages/services.html", services=services, title="Services - KusseTechStudio"
    )


@bp.route("/about")
def about():
    """About page route"""
    return render_template("pages/about.html", title="About - KusseTechStudio")
