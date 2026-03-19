// Bombproof Spatial Navigation Image Map Logic
// Responsive Image Map setup accounting for object-fit: cover

document.addEventListener('DOMContentLoaded', () => {
    const mainHallImg = document.getElementById('main-hall-img');
    const areas = document.querySelectorAll('area');

    // These relative coordinates define the polygons as percentages [0.0 to 1.0] 
    // mapped to the ORIGINAL image resolution. 
    // Calculated directly from the 3164x1344 main_hall.jpg
    const relativeCoords = {
        // [top-left-x, top-left-y, top-right-x, top-right-y, bottom-right-x, bottom-right-y, bottom-left-x, bottom-left-y]
        'architecture': [0.418, 0.475, 0.4688, 0.475, 0.4688, 0.713, 0.418, 0.713],
        'design':       [0.486, 0.504, 0.513, 0.504, 0.513, 0.680, 0.486, 0.680],
        'large-p':      [0.515, 0.438, 0.581, 0.438, 0.581, 0.721, 0.515, 0.721],
        'research':     [0.631, 0.476, 0.681, 0.476, 0.681, 0.698, 0.631, 0.698]
    };

    // Expose resizeImageMap globally so script.js can call it when navigating back
    window.resizeImageMap = function resizeImageMap() {
        // If main hall is hidden (e.g. user loaded directly into a subpage via URL), 
        // clientWidth is 0, so we skip calculation until it becomes visible.
        if (!mainHallImg || !mainHallImg.naturalWidth || mainHallImg.clientWidth === 0) return;
        
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
