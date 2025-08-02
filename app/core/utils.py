import os
import json
from datetime import datetime
from flask import current_app


def get_current_year():
    """Get current year for copyright notices"""
    return datetime.now().year


def format_date(date_obj, format_str="%B %d, %Y"):
    """Format date object to string"""
    if date_obj:
        return date_obj.strftime(format_str)
    return ""


def get_file_extension(filename):
    """Get file extension from filename"""
    return os.path.splitext(filename)[1].lower()


def is_safe_url(target):
    """Check if URL is safe for redirects"""
    # Basic URL safety check - implement according to your needs
    return target and target.startswith("/")


def truncate_text(text, length=100, suffix="..."):
    """Truncate text to specified length"""
    if len(text) <= length:
        return text
    return text[:length].rsplit(" ", 1)[0] + suffix


def track_event(name: str, metadata: dict = None, distinct_id: str = "anonymous"):
    """
    Track user events with PostHog (disabled in debug mode).
    
    Args:
        name (str): Event name
        metadata (dict): Additional event properties
        distinct_id (str): User identifier (defaults to "anonymous")
    """
    if not current_app.debug:
        try:
            import posthog
            posthog.capture(
                distinct_id=distinct_id, 
                event=name, 
                properties=metadata or {}
            )
            current_app.logger.info(f"Event tracked: {name}")
        except Exception as e:
            current_app.logger.error(f"Event tracking failed: {e}")
    else:
        current_app.logger.debug(f"Event tracking (debug mode): {name} - {metadata}")


def track_route_event(event_name: str):
    """
    Decorator for tracking Flask route events.
    
    Args:
        event_name (str): Name of the event to track
        
    Usage:
        @projects_bp.route("/")
        @track_route_event("Viewed Projects Page")
        def index():
            return render_template("pages/projects.html")
    """
    from functools import wraps
    from flask import request
    
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Track the event with additional route metadata
            metadata = {
                'route': request.endpoint,
                'method': request.method,
                'user_agent': request.headers.get('User-Agent', ''),
                'remote_addr': request.remote_addr,
                'referrer': request.referrer
            }
            track_event(event_name, metadata)
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def get_vite_asset(filename):
    """
    Get the hashed filename from Vite manifest for asset loading
    
    Args:
        filename (str): The original filename (e.g., 'styles/main.css')
        
    Returns:
        str: The hashed filename from manifest or original filename as fallback
    """
    try:
        # Path to the Vite manifest file
        manifest_path = os.path.join(
            current_app.static_folder, 'dist', '.vite', 'manifest.json'
        )
        
        # Fallback manifest path (older Vite versions)
        if not os.path.exists(manifest_path):
            manifest_path = os.path.join(
                current_app.static_folder, 'dist', 'manifest.json'
            )
        
        if os.path.exists(manifest_path):
            with open(manifest_path, 'r') as f:
                manifest = json.load(f)
            
            # Look for the file in manifest
            if filename in manifest:
                return f"/static/dist/{manifest[filename]['file']}"
            
            # Try with different variations
            variations = [
                f"src/scripts/app/{filename}",
                f"src/styles/{filename}",
                f"frontend/src/scripts/app/{filename}",
                f"frontend/src/styles/{filename}",
            ]
            
            for variation in variations:
                if variation in manifest:
                    return f"/static/dist/{manifest[variation]['file']}"
        
        # Fallback to static file path
        return f"/static/dist/{filename}"
        
    except Exception as e:
        current_app.logger.warning(f"Error loading Vite manifest: {e}")
        return f"/static/dist/{filename}"
