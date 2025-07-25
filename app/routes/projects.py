from flask import Blueprint, render_template

bp = Blueprint('projects', __name__)

# Enhanced project data with real-world examples
PROJECTS = [
    {
        'id': 1,
        'title': 'E-commerce Price Monitor',
        'description': 'Automated price tracking system that monitors products across major Icelandic retail websites, providing real-time alerts and comprehensive reporting for competitive analysis.',
        'technologies': ['Python', 'BeautifulSoup', 'Selenium', 'PostgreSQL', 'Flask', 'Celery'],
        'github_url': 'https://github.com/kussetechstudio/price-monitor',
        'demo_url': None,
        'image': 'price-monitor.jpg',
        'featured': True,
        'status': 'completed',
        'client': 'Icelandic Retail Chain',
        'date': '2024-12',
        'category': 'Data Automation'
    },
    {
        'id': 2,
        'title': 'Business Intelligence Dashboard',
        'description': 'Real-time analytics dashboard integrating data from multiple business systems to provide actionable insights for SMEs in Iceland.',
        'technologies': ['Python', 'Flask', 'PostgreSQL', 'Chart.js', 'Redis', 'Docker'],
        'github_url': 'https://github.com/kussetechstudio/bi-dashboard',
        'demo_url': 'https://demo.kussetechstudio.com/bi-dashboard',
        'image': 'bi-dashboard.jpg',
        'featured': True,
        'status': 'completed',
        'client': 'Icelandic SME Network',
        'date': '2024-11',
        'category': 'Business Intelligence'
    },
    {
        'id': 3,
        'title': 'Document Processing Automation',
        'description': 'OCR and NLP system for automated invoice and contract processing, supporting multiple languages including Icelandic.',
        'technologies': ['Python', 'Tesseract OCR', 'spaCy', 'FastAPI', 'MongoDB', 'React'],
        'github_url': None,  # Private repository
        'demo_url': 'https://demo.kussetechstudio.com/doc-processor',
        'image': 'doc-processing.jpg',
        'featured': True,
        'status': 'completed',
        'client': 'Legal Services Firm',
        'date': '2024-09',
        'category': 'Document Automation'
    },
    {
        'id': 4,
        'title': 'API Integration Hub',
        'description': 'Microservices platform for managing third-party API integrations with rate limiting, authentication, and comprehensive monitoring.',
        'technologies': ['Python', 'FastAPI', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes'],
        'github_url': 'https://github.com/kussetechstudio/api-hub',
        'demo_url': None,
        'image': 'api-hub.jpg',
        'featured': False,
        'status': 'in_progress',
        'client': 'Tech Startup',
        'date': '2024-12',
        'category': 'API Development'
    },
    {
        'id': 5,
        'title': 'IoT Data Collection System',
        'description': 'Real-time sensor data collection and analysis platform for industrial equipment monitoring and predictive maintenance.',
        'technologies': ['Python', 'MQTT', 'InfluxDB', 'Grafana', 'Docker', 'Raspberry Pi'],
        'github_url': 'https://github.com/kussetechstudio/iot-platform',
        'demo_url': None,
        'image': 'iot-system.jpg',
        'featured': False,
        'status': 'in_progress',
        'client': 'Manufacturing Company',
        'date': '2025-01',
        'category': 'IoT Development'
    }
]

@bp.route('/')
def projects_list():
    """Projects listing page"""
    return render_template('pages/projects/list.html', 
                         projects=PROJECTS, 
                         title='Projects - KusseTechStudio')

@bp.route('/<int:project_id>')
def project_detail(project_id):
    """Individual project detail page"""
    # Find project by ID
    project = next((p for p in PROJECTS if p['id'] == project_id), None)
    
    if not project:
        # Return 404 if project not found
        from flask import abort
        abort(404)
    
    return render_template('pages/projects/detail.html', 
                         project=project, 
                         title=f"{project['title']} - KusseTechStudio")
