document.addEventListener('DOMContentLoaded', () => {
    console.log("Virtual Gallery Loaded");

    const views = document.querySelectorAll('.view');
    const mainHall = document.getElementById('main-hall');
    const subRoom = document.getElementById('sub-room');
    const fadeOverlay = document.getElementById('fade-overlay');
    const areas = document.querySelectorAll('area');
    const backBtn = document.getElementById('back-btn');
    const subRoomImg = document.getElementById('sub-room-img');
    const roomTitle = document.getElementById('room-title');

    // Preload Sub-room images
    const roomImages = {
        'architecture': 'assets/architecture.jpg',
        'design': 'assets/design.jpg',
        'research': 'assets/research.jpg',
        'large-p': 'assets/large_p.jpg'
    };

    const preloadedImages = {};
    for (const [key, src] of Object.entries(roomImages)) {
        const img = new Image();
        img.src = src;
        preloadedImages[key] = img;
    }

    // Function to handle fade transition
    function switchView(fromView, toView, newImageSrc = null, roomName = null) {
        fadeOverlay.classList.add('active'); // Fade out

        setTimeout(() => {
            fromView.classList.remove('active');
            toView.classList.add('active');

            if (newImageSrc) {
                subRoomImg.src = newImageSrc;
            }
            if (roomName) {
                roomTitle.textContent = roomName.toUpperCase();
            }

            fadeOverlay.classList.remove('active'); // Fade in
        }, 400); // Wait for CSS transition (0.4s)
    }

    // Click handler for navigation screens (Main Hall to Sub-room)
    areas.forEach(area => {
        area.addEventListener('click', (e) => {
            e.preventDefault();
            const roomType = area.getAttribute('data-room');
            const newSrc = preloadedImages[roomType].src;
            const roomName = area.getAttribute('title');

            if (roomType && newSrc) {
                switchView(mainHall, subRoom, newSrc, roomName);
            }
        });
    });

    // Click handler for returning to Main Hall
    backBtn.addEventListener('click', () => {
        switchView(subRoom, mainHall);
    });

    // Handle initial orientation prompt (Landscape Enforcement)
    const landscapePrompt = document.getElementById('landscape-prompt');

    function checkOrientation() {
        if (window.innerWidth < window.innerHeight && window.innerWidth <= 768) {
            landscapePrompt.classList.remove('hidden');
        } else {
            landscapePrompt.classList.add('hidden');
        }
    }

    // Initial check
    checkOrientation();

    // Re-check on resize/orientation change
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
});
