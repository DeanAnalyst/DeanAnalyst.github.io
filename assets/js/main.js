// console.log("Dean's Portfolio JS Loaded!");

document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Feature
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once visible for performance
                }
            });
        }, {
            root: null, // observing intersections with the viewport
            rootMargin: '0px',
            threshold: 0.1 // Element is considered intersecting when 10% is visible
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // Active Navigation Link Highlighting
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('header nav a'); // Target header nav links specifically

    // Function to normalize paths for comparison (handles trailing slashes and .html)
    const normalizePath = (path) => {
        if (path.endsWith('/index.html')) {
            return path.substring(0, path.length - 'index.html'.length);
        }
        if (path.length > 1 && path.endsWith('/')) {
            return path.substring(0, path.length - 1);
        }
        return path;
    };

    const normalizedCurrentLocation = normalizePath(currentLocation);

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            // Construct absolute URL for comparison if href is relative
            // For Jekyll, {{ '/about.html' | relative_url }} becomes '/about.html' or '/baseurl/about.html'
            // So we just need to normalize it.
            const normalizedLinkPath = normalizePath(href);

            if (normalizedLinkPath === normalizedCurrentLocation) {
                link.classList.add('active');
            }
            // Special case for homepage if the link is just "/"
            else if (normalizedLinkPath === '' && normalizedCurrentLocation === '') { // Handles baseurl being empty
                 link.classList.add('active');
            }
             else if (normalizedLinkPath === '/' && (normalizedCurrentLocation === '' || normalizedCurrentLocation === '/index.html')) {
                 link.classList.add('active');
             }

        }
    });
});