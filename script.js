document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling ---
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Check if it's an internal link
            if (href && href.startsWith('#')) {
                e.preventDefault(); // Prevent default jump
                const targetId = href.substring(1); // Remove '#'
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start' // Aligns the top of the target element to the top of the viewport
                    });

                    // Optional: Briefly highlight the target section
                    targetElement.style.transition = 'background-color 0.5s ease';
                    targetElement.style.backgroundColor = 'rgba(0, 123, 255, 0.1)'; // Light blue highlight
                    setTimeout(() => {
                        targetElement.style.backgroundColor = ''; // Remove highlight
                    }, 1500); // Highlight duration
                }
            }
            // Allow normal behavior for external links
        });
    });

    // --- Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('main section[id]'); // Target sections with IDs
    const navLinks = document.querySelectorAll('.sidebar a');

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px 0px -70% 0px', // Trigger when section is in the top 30% of the viewport
        threshold: 0.01 // Trigger as soon as a tiny bit is visible (was 0, 0.01 is often better)
    };

    const observerCallback = (entries, observer) => {
        let lastIntersectingEntry = null;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                lastIntersectingEntry = entry;
            }
        });

        navLinks.forEach(link => link.classList.remove('active'));

        if (lastIntersectingEntry) {
             const id = lastIntersectingEntry.target.getAttribute('id');
             const correspondingLink = document.querySelector(`.sidebar a[href="#${id}"]`);
             if (correspondingLink) {
                 correspondingLink.classList.add('active');
             }
        } else {
            // If nothing is intersecting based on the rootMargin (e.g., scrolled to the very top or bottom past all sections)
            // you might want to check the very first or last visible section without the negative rootMargin.
            // For simplicity, this version clears all active states if no section is "prominently" in view.
            // Alternatively, to always have one active, you could adjust logic or rootMargin.
        }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

});