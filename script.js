document.addEventListener('DOMContentLoaded', () => {
    const mainTitle = document.getElementById('main-title');

    // Fade in the main title after a short delay
    setTimeout(() => {
        mainTitle.style.opacity = '1';
    }, 500);
}); 