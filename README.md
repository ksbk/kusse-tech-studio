# Kusse Tech Studio

A modern portfolio website showcasing innovative digital solutions and technical expertise.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Modern Architecture**: Flask-based backend with organized structure
- **Portfolio Showcase**: Dynamic project displays with detailed views
- **Contact System**: Interactive contact form with validation
- **Docker Ready**: Containerized deployment with Docker Compose
- **Development Tools**: Makefile for common tasks

## 🛠️ Tech Stack

- **Backend**: Python 3.11, Flask 2.3.3
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Styling**: SCSS preprocessing
- **Deployment**: Docker, Docker Compose, Gunicorn
- **Development**: Make, Git

## 📁 Project Structure

```
kusse-tech-studio/
├── app/                    # Main application
│   ├── routes/            # Route handlers
│   ├── templates/         # Jinja2 templates
│   ├── static/           # Static assets
│   │   ├── src/          # Source files (SCSS, JS, images)
│   │   └── dist/         # Compiled assets
│   └── utils/            # Utility functions
├── docker-compose.yml    # Docker services
├── Dockerfile           # Container configuration
├── Makefile            # Development commands
├── requirements.txt    # Python dependencies
└── run.py             # Application entry point
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Docker & Docker Compose (optional)
- Node.js (for asset compilation)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kusse-tech-studio
   ```

2. **Set up virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   make install
   # or
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the application**
   ```bash
   make run
   # or
   python run.py
   ```

6. **Visit the site**
   Open http://localhost:5000 in your browser

## 🐳 Docker Deployment

### Development
```bash
make build
make deploy
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Available Commands

```bash
make help          # Show all available commands
make install       # Install dependencies
make run           # Run development server
make test          # Run tests
make build         # Build Docker image
make deploy        # Deploy with Docker Compose
make clean         # Clean temporary files
make lint          # Run code linting
make format        # Format code
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
DEBUG=True
```

### Static Assets

- Source files: `app/static/src/`
- Compiled files: `app/static/dist/`
- Images: `app/static/src/img/`
- Styles: `app/static/src/scss/`
- Scripts: `app/static/src/js/`

## 📱 Pages

- **Home** (`/`) - Landing page with hero section and service preview
- **About** (`/about`) - Company information and team details
- **Portfolio** (`/portfolio`) - Project showcase with detailed views
- **Services** (`/services`) - Service offerings and capabilities
- **Contact** (`/contact`) - Contact form and business information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

- **Website**: [kussetechstudio.com](https://kussetechstudio.com)
- **Email**: hello@kussetechstudio.com
- **Location**: San Francisco, CA

---

Built with ❤️ by Kusse Tech Studio
