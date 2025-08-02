"""Project-related routes."""

from flask import Blueprint, abort, render_template

from app.models.project import ProjectRepository
from app.core.utils import track_route_event, track_event

# Create blueprint
projects_bp = Blueprint("projects", __name__, url_prefix="/projects")

# Get repositories
project_repo = ProjectRepository()


@projects_bp.route("/")
@track_route_event("Viewed Projects Page")
def index():
    """Projects listing page."""
    projects_list = project_repo.get_all()
    
    # Track additional project listing metrics
    track_event("Projects Listed", {
        "project_count": len(projects_list),
        "page_type": "projects_index"
    })
    
    return render_template(
        "pages/projects.html",
        projects=projects_list,
        title="Projects - KusseTechStudio",
    )


@projects_bp.route("/<int:project_id>")
@track_route_event("Viewed Project Detail")
def detail(project_id):
    """Individual project detail page."""
    project = project_repo.get_by_id(project_id)

    if not project:
        # Track 404 events for projects
        track_event("Project Not Found", {
            "project_id": project_id,
            "error_type": "404"
        })
        abort(404)

    # Track successful project views
    track_event("Project Detail Viewed", {
        "project_id": project_id,
        "project_title": project.title,
        "project_type": getattr(project, 'type', 'unknown')
    })

    return render_template(
        "project_detail.html",
        project=project,
        title=f"{project.title} - KusseTechStudio",
    )
