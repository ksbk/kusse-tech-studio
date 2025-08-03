"""Project model for portfolio data management."""

from dataclasses import dataclass


@dataclass
class Project:
    """Project data model."""

    id: int
    title: str
    description: str
    technologies: list[str]
    github_url: str | None
    demo_url: str | None
    image: str
    icon: str
    featured: bool
    status: str  # 'completed', 'in_progress', 'planned'
    client: str
    date: str
    category: str
    completion_rate: int
    duration: str
    impact: str

    @property
    def is_completed(self) -> bool:
        """Check if project is completed."""
        return self.status == "completed"

    @property
    def is_featured(self) -> bool:
        """Check if project is featured."""
        return self.featured

    @property
    def tech_stack(self) -> str:
        """Get formatted technology stack."""
        return ", ".join(self.technologies)

    @classmethod
    def from_dict(cls, data: dict) -> "Project":
        """Create Project instance from dictionary."""
        return cls(**data)


@dataclass
class Service:
    """Service offering data model."""

    title: str
    description: str
    icon: str
    features: list[str]

    @property
    def feature_list(self) -> str:
        """Get formatted feature list."""
        return ", ".join(self.features)

    @classmethod
    def from_dict(cls, data: dict) -> "Service":
        """Create Service instance from dictionary."""
        return cls(**data)


class ProjectRepository:
    """Repository for managing project data."""

    # Sample project data - in a real app, this would come from a database
    _projects_data = [
        {
            "id": 1,
            "title": "E-commerce Price Monitor",
            "description": (
                "Automated price tracking system that monitors products "
                "across major Icelandic retail websites, providing real-time "
                "alerts and comprehensive reporting for competitive analysis."
            ),
            "technologies": [
                "Python",
                "BeautifulSoup",
                "Selenium",
                "PostgreSQL",
                "Flask",
                "Celery",
            ],
            "github_url": "https://github.com/kussetechstudio/price-monitor",
            "demo_url": None,
            "image": "price-monitor.jpg",
            "icon": "chart-line",
            "featured": True,
            "status": "completed",
            "client": "Icelandic Retail Chain",
            "date": "2024-12",
            "category": "web-scraping",
            "completion_rate": 100,
            "duration": "6",
            "impact": (
                "Reduced manual price checking by 95%, saving 20 hours per week"
            ),
        },
        {
            "id": 2,
            "title": "Business Intelligence Dashboard",
            "description": (
                "Real-time analytics dashboard integrating data from "
                "multiple business systems to provide actionable insights "
                "for SMEs in Iceland."
            ),
            "technologies": [
                "Python",
                "Flask",
                "PostgreSQL",
                "Chart.js",
                "Redis",
                "Docker",
            ],
            "github_url": "https://github.com/kussetechstudio/bi-dashboard",
            "demo_url": "https://demo.kussetechstudio.com/bi-dashboard",
            "image": "bi-dashboard.jpg",
            "icon": "chart-bar",
            "featured": True,
            "status": "completed",
            "client": "Icelandic SME Network",
            "date": "2024-11",
            "category": "data-analysis",
            "completion_rate": 100,
            "duration": "8",
            "impact": "Improved decision-making speed by 60%, increased revenue by 15%",
        },
        {
            "id": 3,
            "title": "Document Processing Automation",
            "description": (
                "OCR and NLP system for automated invoice and contract "
                "processing, supporting multiple languages including Icelandic."
            ),
            "technologies": [
                "Python",
                "Tesseract OCR",
                "spaCy",
                "FastAPI",
                "MongoDB",
                "React",
            ],
            "github_url": None,
            "demo_url": "https://demo.kussetechstudio.com/doc-processor",
            "image": "doc-processing.jpg",
            "icon": "file-invoice",
            "featured": True,
            "status": "completed",
            "client": "Legal Services Firm",
            "date": "2024-09",
            "category": "automation",
            "completion_rate": 100,
            "duration": "10",
            "impact": "Reduced document processing time by 80%, improved accuracy to 99.2%",
        },
        {
            "id": 4,
            "title": "API Integration Hub",
            "description": (
                "Microservices platform for managing third-party API "
                "integrations with rate limiting, authentication, and "
                "comprehensive monitoring."
            ),
            "technologies": [
                "Python",
                "FastAPI",
                "Redis",
                "PostgreSQL",
                "Docker",
                "Kubernetes",
            ],
            "github_url": "https://github.com/kussetechstudio/api-hub",
            "demo_url": None,
            "image": "api-hub.jpg",
            "icon": "network-wired",
            "featured": False,
            "status": "in_progress",
            "client": "Tech Startup",
            "date": "2024-12",
            "category": "api",
            "completion_rate": 75,
            "duration": "4",
            "impact": "Streamlined API management, reduced integration time by 50%",
        },
        {
            "id": 5,
            "title": "IoT Data Collection System",
            "description": (
                "Real-time sensor data collection and analysis platform "
                "for industrial equipment monitoring and predictive maintenance."
            ),
            "technologies": [
                "Python",
                "MQTT",
                "InfluxDB",
                "Grafana",
                "Docker",
                "Raspberry Pi",
            ],
            "github_url": "https://github.com/kussetechstudio/iot-platform",
            "demo_url": None,
            "image": "iot-system.jpg",
            "icon": "microchip",
            "featured": False,
            "status": "in_progress",
            "client": "Manufacturing Company",
            "date": "2025-01",
            "category": "automation",
            "completion_rate": 60,
            "duration": "12",
            "impact": "Early detection of equipment issues, preventing 3 major failures",
        },
        {
            "id": 6,
            "title": "Social Media Analytics Engine",
            "description": (
                "Advanced sentiment analysis and engagement tracking "
                "across multiple social platforms for Icelandic businesses."
            ),
            "technologies": [
                "Python",
                "NLTK",
                "scikit-learn",
                "Apache Kafka",
                "Elasticsearch",
                "Kibana",
            ],
            "github_url": "https://github.com/kussetechstudio/social-analytics",
            "demo_url": "https://demo.kussetechstudio.com/social-analytics",
            "image": "social-analytics.jpg",
            "icon": "hashtag",
            "featured": False,
            "status": "completed",
            "client": "Digital Marketing Agency",
            "date": "2024-08",
            "category": "data-analysis",
            "completion_rate": 100,
            "duration": "6",
            "impact": "Increased client engagement rates by 40%, improved campaign ROI by 25%",
        },
    ]

    @classmethod
    def get_all(cls) -> list[Project]:
        """Get all projects."""
        return [Project.from_dict(data) for data in cls._projects_data]

    @classmethod
    def get_featured(cls) -> list[Project]:
        """Get featured projects."""
        return [project for project in cls.get_all() if project.is_featured]

    @classmethod
    def get_by_id(cls, project_id: int) -> Project | None:
        """Get project by ID."""
        projects = cls.get_all()
        return next((p for p in projects if p.id == project_id), None)

    @classmethod
    def get_by_category(cls, category: str) -> list[Project]:
        """Get projects by category."""
        return [project for project in cls.get_all() if project.category == category]


class ServiceRepository:
    """Repository for managing service data."""

    _services_data = [
        {
            "title": "Data Automation",
            "description": "Automate repetitive data tasks with custom Python solutions",
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

    @classmethod
    def get_all(cls) -> list[Service]:
        """Get all services."""
        return [Service.from_dict(data) for data in cls._services_data]
