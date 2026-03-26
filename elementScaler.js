// Element Scaler Logic for Sub-rooms
// Re-uses the object-fit: cover math from imagemap.js to scale regular HTML divs

document.addEventListener('DOMContentLoaded', () => {
    const subRoomImg = document.getElementById('sub-room-img');
    const scalableElements = document.querySelectorAll('.scalable-element');
    
    // Relative bounding boxes for placeholders on the Architecture sub-room background
    // Format: [top, left, width, height] as percentages (0.0 to 1.0)
    // Values estimated visually from the user-provided layout
    const architecturePlaceholders = {
        'title-placeholder': [0.13, 0.08, 0.30, 0.10],
        'desc-placeholder': [0.25, 0.08, 0.30, 0.45],
        'portfolio-placeholder': [0.13, 0.46, 0.46, 0.57],
        'backward-placeholder': [0.60, 0.42, 0.02, 0.10], // Left of portfolio
        'forward-placeholder': [0.60, 0.44, 0.02, 0.10],  // Right of portfolio
        'back-placeholder': [0.80, 0.08, 0.30, 0.10]
    };

    window.resizeElements = function resizeElements() {
        if (!subRoomImg || !subRoomImg.naturalWidth || subRoomImg.clientWidth === 0) return;

        // 1. Get original image aspect ratio
        const imgNaturalWidth = subRoomImg.naturalWidth;
        const imgNaturalHeight = subRoomImg.naturalHeight;
        const imgAspectRatio = imgNaturalWidth / imgNaturalHeight;

        // 2. Get viewport / container dimensions
        const containerWidth = subRoomImg.clientWidth;
        const containerHeight = subRoomImg.clientHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        let renderedWidth, renderedHeight, offsetX, offsetY;

        // 3. Calculate exactly how "object-fit: cover" scales and crops the image
        if (containerAspectRatio > imgAspectRatio) {
            renderedWidth = containerWidth;
            renderedHeight = containerWidth / imgAspectRatio;
            offsetX = 0;
            offsetY = (containerHeight - renderedHeight) / 2;
        } else {
            renderedWidth = containerHeight * imgAspectRatio;
            renderedHeight = containerHeight;
            offsetX = (containerWidth - renderedWidth) / 2;
            offsetY = 0;
        }

        // 4. Apply calculated styles to each scalable element
        scalableElements.forEach(el => {
            const elId = el.id;
            // Currently only mapping architecture placeholders
            if (architecturePlaceholders[elId]) {
                const [relTop, relLeft, relWidth, relHeight] = architecturePlaceholders[elId];

                // Calculate absolute pixel values based on the rendered image dimensions
                // and add the offset caused by object-fit cropping
                const absoluteTop = (relTop * renderedHeight) + offsetY;
                const absoluteLeft = (relLeft * renderedWidth) + offsetX;
                const absoluteWidth = relWidth * renderedWidth;
                const absoluteHeight = relHeight * renderedHeight;

                // Apply styles directly
                el.style.top = `${absoluteTop}px`;
                el.style.left = `${absoluteLeft}px`;
                el.style.width = `${absoluteWidth}px`;
                el.style.height = `${absoluteHeight}px`;
            }
        });
    }

    // Call initially when image loads
    subRoomImg.addEventListener('load', resizeElements);
    
    // Call on window resize
    window.addEventListener('resize', resizeElements);
    
    // Fallback if image is already cached
    if (subRoomImg.complete) {
        resizeElements();
    }
});
