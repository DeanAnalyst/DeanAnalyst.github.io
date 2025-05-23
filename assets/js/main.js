console.log("Dean's Portfolio JS Loaded!");

// Example: Smooth scroll for internal links (if you add them)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Example: Add 'active' class to current nav link (simple version)
window.addEventListener('DOMContentLoaded', () => {
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation || (currentLocation === '/' && link.getAttribute('href') === '/index.html')) {
            link.classList.add('active');
        }
    });
});