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

    const bloomObserver = new IntersectionObserver((entries) => {
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

        // Apply subtle parallax to blooms
        gratitudeBlooms.forEach(bloom => {
            const rect = bloom.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const bloomCenter = rect.top + rect.height / 2;
            const distanceToCenter = viewportCenter - bloomCenter;
            
            // Adjust sensitivity for parallax (smaller multiplier = less movement)
            const parallaxOffset = distanceToCenter * 0.1; // Adjust this value for more/less parallax
            bloom.style.setProperty('--bloom-parallax-offset', `${parallaxOffset}px`);
        });
    };

    window.addEventListener('scroll', throttle(handleScroll, 100)); // Throttle to 100ms

    // Initial call to set background color based on current scroll position
    handleScroll();

    // Final Message Section Appearance using Intersection Observer
    const finalMessageSection = document.getElementById('final-message-section');
    if (finalMessageSection) { // Ensure the element exists
        const finalMessageObserverOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the item is visible
        };

        const finalMessageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, finalMessageObserverOptions);

        finalMessageObserver.observe(finalMessageSection);
    }

    // Custom Cursor Functionality
    const customCursor = document.getElementById('custom-cursor');

    // Detect touch devices
    const isTouchDevice = () => ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

    if (customCursor && !isTouchDevice()) {
        document.body.style.cursor = 'none'; // Hide default cursor

        window.addEventListener('mousemove', (e) => {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        });

        // Optional: Hide custom cursor when mouse leaves the document
        document.body.addEventListener('mouseleave', () => {
            customCursor.style.opacity = '0';
        });

        document.body.addEventListener('mouseenter', () => {
            customCursor.style.opacity = '1';
        });
    } else if (customCursor && isTouchDevice()) {
        customCursor.style.display = 'none'; // Hide custom cursor on touch devices
    }

    // Preloader functionality
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500); // Match transition duration
        });
    }

    // "Start Over" button logic
    const startOverBtn = document.getElementById('start-over-btn');
    if (startOverBtn) {
        startOverBtn.addEventListener('click', () => {
            window.location.reload(); // Reload the page
        });
    }

    // "Share" button logic
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'For My Dad - A Message of Gratitude',
                text: 'Discover a blooming message of gratitude for Dad!',
                url: window.location.href
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                    console.log('Content shared successfully');
                } else {
                    // Fallback for browsers that do not support Web Share API
                    alert('Sharing is not supported in this browser. You can copy the URL: ' + window.location.href);
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        console.log('Page URL copied to clipboard');
                    }).catch(err => {
                        console.error('Failed to copy: ', err);
                    });
                }
            } catch (err) {
                console.error('Error sharing:', err);
            }
        });
    }

    // "Heart of Gratitude" Section Visibility & Animation Trigger
    const heartSection = document.getElementById('heart-section');
    const heartTitle = document.getElementById('heart-title');
    const finalMessageBoxes = document.querySelectorAll('.final-message-box');
    const signatureFooter = document.getElementById('signature-footer');

    if (heartSection && heartTitle && finalMessageBoxes.length > 0 && signatureFooter) {
        const heartObserverOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.3 // Trigger when 30% of the section is visible
        };

        const heartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heartSection.style.opacity = '1';
                    // Trigger animations for children elements
                    heartTitle.style.opacity = '1';
                    heartTitle.style.transform = 'translateY(0)';

                    finalMessageBoxes.forEach((box, index) => {
                        // Add a slight delay for each box to make them appear sequentially
                        setTimeout(() => {
                            box.style.opacity = '1';
                            box.style.transform = 'translateY(0)';
                        }, 500 + (index * 300)); // 500ms initial delay + 300ms for each subsequent box
                    });

                    setTimeout(() => {
                        signatureFooter.style.opacity = '1';
                    }, 500 + (finalMessageBoxes.length * 300) + 300); // Delay after messages appear

                    // Trigger final background color
                    document.body.style.backgroundColor = '#2c0a3d'; // Deep, rich culmination color
                } else {
                    heartSection.style.opacity = '0';
                    // Reset animations if scrolling back up
                    heartTitle.style.opacity = '0';
                    heartTitle.style.transform = 'translateY(20px)';

                    finalMessageBoxes.forEach(box => {
                        box.style.opacity = '0';
                        box.style.transform = 'translateY(50px)';
                    });

                    signatureFooter.style.opacity = '0';

                    document.body.style.backgroundColor = colors[0]; // Revert to first color or handle based on scroll
                }
            });
        }, heartObserverOptions);

        heartObserver.observe(heartSection);
    }
}); 