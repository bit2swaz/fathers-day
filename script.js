document.addEventListener('DOMContentLoaded', () => {
    const mainTitle = document.getElementById('main-title');
    const heroSection = document.getElementById('hero-section');
    const theSeed = document.getElementById('the-seed');
    const bloomsSection = document.getElementById('blooms-section');
    const gratitudeBlooms = document.querySelectorAll('.gratitude-bloom');

    // Fade in the main title after a short delay
    setTimeout(() => {
        mainTitle.style.opacity = '1';
    }, 500);

    // Hero Section Interaction
    theSeed.addEventListener('click', () => {
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(-100px)';
        heroSection.style.pointerEvents = 'none';

        // Wait for fade out, then scroll
        setTimeout(() => {
            bloomsSection.style.display = 'flex'; // Ensure it's visible
            window.scrollTo({
                top: bloomsSection.offsetTop,
                behavior: 'smooth'
            });
        }, 500); // Match heroSection transition duration
    });

    // "Gratitude Bloom" Tap to Reveal Logic
    let currentlyOpenBloom = null;

    gratitudeBlooms.forEach(bloom => {
        bloom.addEventListener('click', () => {
            if (currentlyOpenBloom && currentlyOpenBloom !== bloom) {
                currentlyOpenBloom.classList.remove('open');
            }
            bloom.classList.toggle('open');
            currentlyOpenBloom = bloom.classList.contains('open') ? bloom : null;
        });
    });

    // Scroll-Triggered "Bloom" Appearance using Intersection Observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the item is visible
    };

    const bloomObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, observerOptions);

    gratitudeBlooms.forEach(bloom => {
        bloomObserver.observe(bloom);
    });

    // Dynamic Background Color Transition on Scroll
    const colors = [
        '#0d1117', // Dark background
        '#1f2e3f', // Slightly lighter blue-grey
        '#2a3b4c', // Medium blue-grey
        '#3b4c5d', // Darker blue-grey
        '#4c5d6e' // Even darker blue-grey
    ];

    // Throttle function for scroll event
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const bloomsSectionHeight = bloomsSection.offsetHeight;
        const bloomsSectionTop = bloomsSection.offsetTop;

        // Calculate scroll progress within the blooms section
        let scrollProgress = (scrollY - bloomsSectionTop) / bloomsSectionHeight;
        scrollProgress = Math.max(0, Math.min(1, scrollProgress)); // Clamp between 0 and 1

        // Map progress to color index
        const colorIndex = Math.floor(scrollProgress * (colors.length - 1));
        document.body.style.backgroundColor = colors[colorIndex];
    };

    window.addEventListener('scroll', throttle(handleScroll, 100)); // Throttle to 100ms

    // Initial call to set background color based on current scroll position
    handleScroll();
}); 