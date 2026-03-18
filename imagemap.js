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
        'architecture': [0.457, 0.472, 0.490, 0.473, 0.489, 0.718, 0.455, 0.713],
        'design':       [0.510, 0.498, 0.536, 0.499, 0.536, 0.685, 0.510, 0.683],
        'large-p':      [0.538, 0.432, 0.590, 0.432, 0.590, 0.727, 0.538, 0.727],
        'research':     [0.627, 0.470, 0.666, 0.470, 0.666, 0.712, 0.628, 0.712]
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

        // Ensure any existing debug outlines are cleared on resize
        document.querySelectorAll('.debug-outline').forEach(el => el.remove());

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

                // --- VISUAL DEBUGGING OVERLAYS ---
                // We will draw an absolute positioned polygon to match the image map coords
                // so we can see *exactly* what the math is targeting visually.
                const debugDiv = document.createElement('div');
                debugDiv.className = 'debug-outline';
                debugDiv.style.position = 'absolute';
                debugDiv.style.top = '0';
                debugDiv.style.left = '0';
                debugDiv.style.width = '100%';
                debugDiv.style.height = '100%';
                debugDiv.style.pointerEvents = 'none'; // so it doesn't block clicks
                debugDiv.style.zIndex = '999';
                
                // Convert coordinates array to clip-path polygon
                const clipPathCoords = [];
                for (let i = 0; i < newCoords.length; i += 2) {
                    clipPathCoords.push(`${newCoords[i]}px ${newCoords[i+1]}px`);
                }
                
                debugDiv.style.clipPath = `polygon(${clipPathCoords.join(', ')})`;
                debugDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.4)'; // Red semi-transparent box
                debugDiv.style.border = '2px solid red'; // Note: borders don't show well on clip-path, using bg instead
                
                // Add title for visual clarity
                const label = document.createElement('div');
                label.textContent = roomType;
                label.style.position = 'absolute';
                label.style.left = `${newCoords[0]}px`;
                label.style.top = `${newCoords[1] - 20}px`;
                label.style.color = 'red';
                label.style.fontSize = '12px';
                label.style.fontWeight = 'bold';
                label.style.backgroundColor = 'black';
                
                const container = mainHallImg.parentElement;
                debugDiv.appendChild(label);
                container.appendChild(debugDiv);
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
