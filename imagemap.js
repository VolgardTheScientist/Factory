// Bombproof Spatial Navigation Image Map Logic
// Responsive Image Map setup accounting for object-fit: cover

document.addEventListener('DOMContentLoaded', () => {
    const mainHallImg = document.getElementById('main-hall-img');
    const areas = document.querySelectorAll('area');

    // These relative coordinates define the polygons as percentages [0.0 to 1.0] 
    // mapped to the ORIGINAL image resolution. 
    // You must adjust these values to perfectly trace the glowing screens of your specific image.
    const relativeCoords = {
        'architecture': [0.15, 0.40, 0.30, 0.40, 0.30, 0.60, 0.15, 0.60], 
        'design':       [0.35, 0.40, 0.50, 0.40, 0.50, 0.60, 0.35, 0.60],
        'research':     [0.55, 0.40, 0.70, 0.40, 0.70, 0.60, 0.55, 0.60],
        'large-p':      [0.75, 0.40, 0.90, 0.40, 0.90, 0.60, 0.75, 0.60]
    };

    function resizeImageMap() {
        if (!mainHallImg || !mainHallImg.naturalWidth) return;
        
        // 1. Get original image aspect ratio
        const imgNaturalWidth = mainHallImg.naturalWidth;
        const imgNaturalHeight = mainHallImg.naturalHeight;
        const imgAspectRatio = imgNaturalWidth / imgNaturalHeight;

        // 2. Get viewport / container dimensions
        const containerWidth = mainHallImg.clientWidth;
        const containerHeight = mainHallImg.clientHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        let renderedWidth, renderedHeight, offsetX, offsetY;

        // 3. Calculate exactly how "object-fit: cover" scales and crops the image
        if (containerAspectRatio > imgAspectRatio) {
            // Container is wider than the image: Image scales to fit width, height gets cropped
            renderedWidth = containerWidth;
            renderedHeight = containerWidth / imgAspectRatio;
            offsetX = 0;
            // object-position: center crops equally top and bottom
            offsetY = (containerHeight - renderedHeight) / 2;
        } else {
            // Container is taller than the image: Image scales to fit height, width gets cropped
            renderedWidth = containerHeight * imgAspectRatio;
            renderedHeight = containerHeight;
            // object-position: center crops equally left and right
            offsetX = (containerWidth - renderedWidth) / 2;
            offsetY = 0;
        }

        // 4. Map the relative coordinates to the newly calculated scale and offset
        areas.forEach(area => {
            const roomType = area.getAttribute('data-room');
            if (relativeCoords[roomType]) {
                const coords = relativeCoords[roomType];
                
                const newCoords = coords.map((val, index) => {
                    // Even indices are X coordinates, odd are Y coordinates
                    if (index % 2 === 0) {
                        return Math.round((val * renderedWidth) + offsetX);
                    } else {
                        return Math.round((val * renderedHeight) + offsetY);
                    }
                });
                
                area.setAttribute('coords', newCoords.join(','));
            }
        });
    }

    // Call initially when image loads
    mainHallImg.addEventListener('load', resizeImageMap);
    
    // Call on window resize to dynamically update coordinates
    window.addEventListener('resize', resizeImageMap);
    
    // Fallback trigger in case image is already cached/loaded
    if (mainHallImg.complete) {
        resizeImageMap();
    }
});
