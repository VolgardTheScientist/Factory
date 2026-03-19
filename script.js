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
    // Note: Paths MUST be absolute (start with /) so they resolve correctly 
    // when a user refreshes inside a physical SEO subdirectory (e.g. /architecture/)
    const roomImages = {
        'architecture': '/assets/architecture.jpg',
        'design': '/assets/design.jpg',
        'research': '/assets/research.jpg',
        'large-p': '/assets/large_p.jpg'
    };

    const preloadedImages = {};
    for (const [key, src] of Object.entries(roomImages)) {
        const img = new Image();
        img.src = src;
        preloadedImages[key] = img;
    }

    // Map URL paths to room identifiers
    const routeMapping = {
        'architecture': 'architecture',
        'design': 'design',
        'about-piotr-piotrowski': 'large-p', // SEO URL mapping
        'research': 'research'
    };
    
    // Reverse map for generating URLs
    const reverseRouteMapping = {
        'architecture': 'architecture',
        'design': 'design',
        'large-p': 'about-piotr-piotrowski',
        'research': 'research'
    };

    // Function to handle fade transition
    function switchView(fromView, toView, newImageSrc = null, roomName = null, pushHistory = true, roomType = null) {
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

            // Toggle architecture placeholders
            const archElements = document.querySelectorAll('.architecture-element');
            if (toView === subRoom && roomType === 'architecture') {
                archElements.forEach(el => el.classList.remove('hidden'));
                if (typeof window.resizeElements === 'function') {
                    // Slight delay to ensure image has loaded and dimensions are correct
                    setTimeout(window.resizeElements, 50);
                }
            } else {
                archElements.forEach(el => el.classList.add('hidden'));
            }

            // Handle History API for SEO / Routing
            if (pushHistory) {
                if (toView === mainHall) {
                    history.pushState({ view: 'main' }, '', '/');
                } else if (roomType) {
                    const urlPath = reverseRouteMapping[roomType] || roomType;
                    history.pushState({ view: 'sub', room: roomType, name: roomName }, '', `/${urlPath}`);
                }
            }
            
            // Re-trigger resize map calculations just in case main-hall was hidden
            if (toView === mainHall && typeof window.resizeImageMap === 'function') {
                window.resizeImageMap();
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
                switchView(mainHall, subRoom, newSrc, roomName, true, roomType);
            }
        });
    });

    // Click handler for returning to Main Hall
    backBtn.addEventListener('click', () => {
        switchView(subRoom, mainHall, null, null, true);
    });

    // Handle Browser Back/Forward buttons
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.view === 'sub') {
            const roomType = e.state.room;
            const newSrc = preloadedImages[roomType].src;
            switchView(mainHall, subRoom, newSrc, e.state.name, false);
        } else {
            switchView(subRoom, mainHall, null, null, false);
        }
    });

    // Initialize SPA state on direct load
    function initSPA() {
        const path = window.location.pathname.replace(/^\/|\/$/g, ''); // Strip leading/trailing slashes
        
        // If loading from a subdirectory for SEO (e.g. /architecture/), handle asset path adjustments
        const isSubDir = path.includes('/');
        
        let targetRoom = null;
        let roomTypeKey = null;

        // Extract root path
        const rootPath = path.split('/')[0];
        
        if (routeMapping[rootPath]) {
            roomTypeKey = routeMapping[rootPath];
            targetRoom = document.querySelector(`area[data-room="${roomTypeKey}"]`);
        }

        if (targetRoom) {
            // Immediately show subroom without fade
            mainHall.classList.remove('active');
            subRoom.classList.add('active');
            
            const roomName = targetRoom.getAttribute('title');
            
            // Adjust image path if loaded from a physical subdirectory
            let imgSrc = preloadedImages[roomTypeKey].src;
            if (isSubDir || path !== "") { 
                // In physical deployment, if we are in /architecture/index.html, assets are at ../assets
                // But JS image preloader resolves absolutely. We just use the preloader's absolute src.
            }
            
            subRoomImg.src = imgSrc;
            roomTitle.textContent = roomName.toUpperCase();
            
            // Toggle architecture placeholders if directly loading into architecture
            if (roomTypeKey === 'architecture') {
                document.querySelectorAll('.architecture-element').forEach(el => el.classList.remove('hidden'));
                if (typeof window.resizeElements === 'function') {
                    // Short timeout to ensure image dimensions are populated
                    setTimeout(window.resizeElements, 100);
                }
            }
            
            // Replace initial history state so 'back' works
            history.replaceState({ view: 'sub', room: roomTypeKey, name: roomName }, '', `/${path}`);
        } else {
            // Default to main hall
            history.replaceState({ view: 'main' }, '', '/');
        }
    }

    // Run initialization
    initSPA();

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
