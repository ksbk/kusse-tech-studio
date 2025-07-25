from datetime import datetime
import os

def get_current_year():
    """Get current year for copyright notices"""
    return datetime.now().year

def format_date(date_obj, format_str='%B %d, %Y'):
    """Format date object to string"""
    if date_obj:
        return date_obj.strftime(format_str)
    return ''

def get_file_extension(filename):
    """Get file extension from filename"""
    return os.path.splitext(filename)[1].lower()

def is_safe_url(target):
    """Check if URL is safe for redirects"""
    # Basic URL safety check - implement according to your needs
    return target and target.startswith('/')

def truncate_text(text, length=100, suffix='...'):
    """Truncate text to specified length"""
    if len(text) <= length:
        return text
    return text[:length].rsplit(' ', 1)[0] + suffix
