// Spatial Navigation Image Map Logic
// Responsive Image Map setup

document.addEventListener('DOMContentLoaded', () => {
    // ... (previous logic, moving image map logic out for clarity, or appending)
    
    // We need to write logic to recalculate image map coordinates based on natural width/height
    // compared to current width/height.
    
    // We will use a library-like approach for responsive image maps to ensure precise clicks
    const mainHallImg = document.getElementById('main-hall-img');
    const hallMap = document.getElementById('hall-map');
    const areas = document.querySelectorAll('area');

    // Store original coordinates on load based on a specific reference resolution
    // Let's assume the reference image resolution is 1920x1080
    const REF_WIDTH = 1920;
    const REF_HEIGHT = 1080;

    // These coordinates need to be mapped to the glowing screens in Gemini_Generated_Image.png / Museum.png
    // We don't have the exact image right now to measure, so we will use estimated relative coordinates [0-1]
    // for standard positions and convert them to actual pixels on resize.
    
    const relativeCoords = {
        'architecture': [0.15, 0.40, 0.30, 0.40, 0.30, 0.60, 0.15, 0.60], // x1,y1, x2,y2, x3,y3, x4,y4
        'design': [0.35, 0.40, 0.50, 0.40, 0.50, 0.60, 0.35, 0.60],
        'research': [0.55, 0.40, 0.70, 0.40, 0.70, 0.60, 0.55, 0.60],
        'large-p': [0.75, 0.40, 0.90, 0.40, 0.90, 0.60, 0.75, 0.60]
    };

    function resizeImageMap() {
        if (!mainHallImg) return;
        
        // Use getBoundingClientRect for actual rendered dimensions
        const rect = mainHallImg.getBoundingClientRect();
        const currentWidth = rect.width;
        const currentHeight = rect.height;

        areas.forEach(area => {
            const roomType = area.getAttribute('data-room');
            if (relativeCoords[roomType]) {
                const coords = relativeCoords[roomType];
                const newCoords = coords.map((val, index) => {
                    // Even indices are X, odd are Y
                    return index % 2 === 0 ? Math.round(val * currentWidth) : Math.round(val * currentHeight);
                });
                area.setAttribute('coords', newCoords.join(','));
            }
        });
    }

    // Call initially and on resize
    mainHallImg.addEventListener('load', resizeImageMap);
    window.addEventListener('resize', resizeImageMap);
    
    // Fallback if image is already loaded from cache
    if (mainHallImg.complete) {
        resizeImageMap();
    }
});
