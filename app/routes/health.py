from flask import Blueprint, jsonify

bp = Blueprint('health', __name__)

@bp.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "service": "kusse-tech-studio"})
