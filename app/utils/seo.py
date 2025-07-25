from flask import Response, request

def generate_sitemap(app):
    """Generate sitemap.xml for SEO"""
    
    @app.route('/sitemap.xml')
    def sitemap():
        # Base URL
        base_url = request.url_root.rstrip('/')
        
        # Static pages
        pages = [
            {'url': '/', 'priority': '1.0', 'changefreq': 'weekly'},
            {'url': '/about', 'priority': '0.8', 'changefreq': 'monthly'},
            {'url': '/services', 'priority': '0.9', 'changefreq': 'monthly'},
            {'url': '/projects/', 'priority': '0.9', 'changefreq': 'weekly'},
            {'url': '/contact/', 'priority': '0.7', 'changefreq': 'monthly'},
        ]
        
        # Add individual project pages
        from app.routes.projects import PROJECTS
        for project in PROJECTS:
            pages.append({
                'url': f'/projects/{project["id"]}',
                'priority': '0.6',
                'changefreq': 'monthly'
            })
        
        # Generate XML
        xml = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'''
        
        for page in pages:
            xml += f'''
    <url>
        <loc>{base_url}{page['url']}</loc>
        <priority>{page['priority']}</priority>
        <changefreq>{page['changefreq']}</changefreq>
    </url>'''
        
        xml += '''
</urlset>'''
        
        return Response(xml, mimetype='application/xml')
    
    return sitemap
