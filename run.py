"""Main application entry point."""

import os

from dotenv import load_dotenv

from app import create_app

# Load environment variables
load_dotenv()

# Create application instance
app = create_app()

if __name__ == "__main__":
    # Development server settings
    debug = os.environ.get("FLASK_ENV") == "development"
    host = os.environ.get("FLASK_HOST", "127.0.0.1")
    port = int(os.environ.get("FLASK_PORT", 5000))

    app.run(debug=debug, host=host, port=port)
