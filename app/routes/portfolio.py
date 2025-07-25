from flask import Blueprint, render_template

bp = Blueprint('portfolio', __name__)

@bp.route('/')
def portfolio():
    """Portfolio overview page"""
    projects = [
        {
            'id': 1,
            'title': 'E-commerce Platform',
            'description': 'Modern e-commerce solution built with Flask and React',
            'technologies': ['Flask', 'React', 'PostgreSQL', 'Docker'],
            'image': 'project1.jpg'
        },
        {
            'id': 2,
            'title': 'Data Analytics Dashboard',
            'description': 'Real-time analytics dashboard for business intelligence',
            'technologies': ['Python', 'Plotly', 'Pandas', 'FastAPI'],
            'image': 'project2.jpg'
        }
    ]
    return render_template('portfolio/index.html', projects=projects, title='Portfolio - Kusse Tech Studio')

@bp.route('/project/<int:project_id>')
def project_detail(project_id):
    """Individual project detail page"""
    # In a real app, you'd fetch this from a database
    project = {
        'id': project_id,
        'title': 'Sample Project',
        'description': 'Detailed project description goes here...',
        'technologies': ['Python', 'Flask', 'JavaScript'],
        'github_url': 'https://github.com/username/project',
        'live_url': 'https://project-demo.com'
    }
    return render_template('portfolio/detail.html', project=project, title=f'Project {project_id} - Kusse Tech Studio')
