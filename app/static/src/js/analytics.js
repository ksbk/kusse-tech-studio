        function trackProjectView(projectName) {
            gtag('event', 'view_project', { 
                project_name: projectName 
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Contact clicks
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', () => {
                gtag('event', 'contact_click', { 
                    method: 'email' 
                });
            });
        });

        // GitHub/External link clicks (example)
        document.querySelectorAll('a[href^="https://github.com"]').forEach(link => {
            link.addEventListener('click', () => {
                gtag('event', 'outbound_click', {
                    link_url: link.href
                });
            });
        });
