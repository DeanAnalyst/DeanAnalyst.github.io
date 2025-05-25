// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Feature ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    let moonIcon, sunIcon;
    if (themeToggleButton) {
        moonIcon = themeToggleButton.querySelector('.fa-moon');
        sunIcon = themeToggleButton.querySelector('.fa-sun');
    }

    const setButtonIcon = (theme) => {
        if (themeToggleButton && moonIcon && sunIcon) {
            if (theme === 'dark') {
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'inline-block';
            } else {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'inline-block';
            }
        }
    };

    // Apply the saved theme and icon on initial load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        setButtonIcon('dark');
    } else {
        document.body.classList.remove('dark-mode'); // Ensure light is default state
        setButtonIcon('light');
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let newTheme = 'light';
            if (document.body.classList.contains('dark-mode')) {
                newTheme = 'dark';
            }
            localStorage.setItem('theme', newTheme);
            setButtonIcon(newTheme);
        });
    }

    // --- Scroll Reveal Feature ---
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

    // --- Active Navigation Link Highlighting ---
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('header nav a');

    const normalizePath = (path) => {
        if (!path) return ""; // Handle null or undefined paths

        // Handle cases where Jekyll might produce full URLs for relative_url on root
        if (path.startsWith(window.location.origin)) {
            path = path.substring(window.location.origin.length);
        }

        // Remove 'index.html' from the end of the path
        if (path.endsWith('/index.html')) {
            path = path.substring(0, path.length - 'index.html'.length);
        }
        // Remove trailing slash if it's not the root path
        if (path.length > 1 && path.endsWith('/')) {
            path = path.substring(0, path.length - 1);
        }
        // Ensure root path is consistently "/"
        if (path === "" || path === "/index.html") {
            return "/";
        }
        return path;
    };

    const normalizedCurrentLocation = normalizePath(currentLocation);

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            // {{ '/' | relative_url }} becomes "" if baseurl is not set, or "/baseurl/"
            // This logic tries to make them comparable
            let linkPath = href;
            if (linkPath === "" && (currentLocation === "/" || currentLocation.endsWith("/index.html"))) { // Special case for home link being just ""
                linkPath = "/";
            } else if (linkPath.startsWith(".") && !linkPath.startsWith("..")) { // Relative like ./page.html
                 // This case is tricky without knowing the exact structure of every link.
                 // For now, we'll assume most links are absolute from root (e.g., /about.html)
            }


            const normalizedLinkPath = normalizePath(linkPath);

            if (normalizedLinkPath === normalizedCurrentLocation) {
                link.classList.add('active');
            }
        }
    });
});