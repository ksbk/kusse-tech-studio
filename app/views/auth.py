"""Authentication-related routes."""

from flask import Blueprint

# Create blueprint
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

# Note: Authentication routes will be added in the future
# This blueprint is prepared for login, logout, registration, etc.
