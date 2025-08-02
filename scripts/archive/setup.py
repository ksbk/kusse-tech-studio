#!/usr/bin/env python3

"""Development environment setup script."""

import subprocess
import sys
from pathlib import Path


def run_command(command):
    """Run shell command."""
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        sys.exit(1)
    return result.stdout


def main():
    """Set up development environment."""
    print("🚀 Setting up development environment...")

    # Create virtual environment
    print("🐍 Creating Python virtual environment...")
    run_command("python -m venv venv")

    # Install Python dependencies
    print("📦 Installing Python dependencies...")
    run_command("./venv/bin/pip install -r requirements.txt")

    # Install Node dependencies
    print("📦 Installing Node.js dependencies...")
    run_command("npm install")

    # Build assets
    print("🔨 Building initial assets...")
    run_command("./scripts/build.sh")

    # Create .env file if it doesn't exist
    env_file = Path(".env")
    if not env_file.exists():
        print("⚙️ Creating .env file...")
        env_file.write_text(
            """
FLASK_ENV=development
FLASK_APP=run.py
SECRET_KEY=dev-secret-key-change-in-production
GOOGLE_ANALYTICS_ID=
CONTACT_EMAIL=contact@kussetech.com
        """.strip()
        )

    print("✅ Development environment setup complete!")
    print("\nTo start the application:")
    print("1. Activate virtual environment: source venv/bin/activate")
    print("2. Run the application: flask run")


if __name__ == "__main__":
    main()
