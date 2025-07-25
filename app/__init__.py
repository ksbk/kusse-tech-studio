from flask import Flask, render_template
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Load configuration from environment variables
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
    app.config['DEBUG'] = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # Register blueprints
    from app.routes import main, home, portfolio, contact, projects, health
    
    app.register_blueprint(main.bp)
    app.register_blueprint(home.bp)
    app.register_blueprint(portfolio.bp, url_prefix='/portfolio')
    app.register_blueprint(projects.bp, url_prefix='/projects')
    app.register_blueprint(contact.bp, url_prefix='/contact')
    app.register_blueprint(health.bp, url_prefix='/api')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return render_template('errors/404.html'), 404
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
