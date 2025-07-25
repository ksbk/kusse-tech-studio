from flask import Blueprint, render_template

bp = Blueprint('projects', __name__)

@bp.route('/')
def projects_list():
    """Projects listing page"""
    # Sample project data - in a real app, this would come from a database
    projects = [
        {
            'id': 1,
            'title': 'Icelandic Tourism Data Scraper',
            'description': 'Automated web scraping tool that collects and analyzes tourism data from Icelandic websites',
            'technologies': ['Python', 'BeautifulSoup', 'Pandas', 'SQLite'],
            'github_url': 'https://github.com/username/tourism-scraper',
            'image': 'project1.jpg',
            'featured': True
        },
        {
            'id': 2,
            'title': 'Business Process Automation',
            'description': 'Streamlined business workflows using Python automation tools',
            'technologies': ['Python', 'Selenium', 'Pandas', 'Email API'],
            'github_url': 'https://github.com/username/business-automation',
            'image': 'project2.jpg',
            'featured': True
        },
        {
            'id': 3,
            'title': 'Data Pipeline Dashboard',
            'description': 'Real-time data monitoring and visualization dashboard',
            'technologies': ['Python', 'Flask', 'Chart.js', 'PostgreSQL'],
            'github_url': 'https://github.com/username/data-dashboard',
            'image': 'project3.jpg',
            'featured': False
        }
    ]
    
    return render_template('pages/projects/list.html', 
                         projects=projects, 
                         title='Projects - KusseTechStudio')

@bp.route('/<int:project_id>')
def project_detail(project_id):
    """Individual project detail page"""
    # In a real app, fetch from database
    project = {
        'id': project_id,
        'title': 'Icelandic Tourism Data Scraper',
        'description': 'A comprehensive web scraping solution designed to collect and analyze tourism data from various Icelandic websites. This project helped local businesses understand market trends and optimize their offerings.',
        'long_description': '''
        This project involved building a robust web scraping infrastructure that could handle multiple tourism websites simultaneously. 
        The system includes data validation, cleaning pipelines, and automated reporting features.
        
        Key features:
        - Multi-threaded scraping for improved performance
        - Data validation and cleaning pipelines
        - Automated email reports with insights
        - RESTful API for data access
        - Real-time monitoring dashboard
        ''',
        'technologies': ['Python', 'BeautifulSoup', 'Scrapy', 'Pandas', 'SQLite', 'Flask'],
        'github_url': 'https://github.com/username/tourism-scraper',
        'live_url': 'https://demo.kussetechstudio.com/tourism-scraper',
        'images': ['project1-1.jpg', 'project1-2.jpg', 'project1-3.jpg'],
        'challenges': [
            'Handling dynamic content loaded by JavaScript',
            'Implementing respectful rate limiting',
            'Data normalization across different site structures'
        ],
        'results': [
            'Reduced manual data collection time by 95%',
            'Improved data accuracy and consistency',
            'Enabled real-time market insights for clients'
        ]
    }
    
    return render_template('pages/projects/detail.html', 
                         project=project, 
                         title=f'{project["title"]} - KusseTechStudio')
