# app/utils/logging.py
import logging
from logging.handlers import RotatingFileHandler

def setup_logging(app):
    handler = RotatingFileHandler('app.log', maxBytes=100000, backupCount=3)
    handler.setLevel(logging.DEBUG)
    app.logger.addHandler(handler)
    
    if app.config['FLASK_ENV'] == 'production':
        app.logger.setLevel(logging.WARNING)  # Reduce log verbosity in production
