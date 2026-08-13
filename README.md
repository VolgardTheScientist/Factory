# The Virtual Gallery

Welcome to the **Virtual Gallery**! This project provides an immersive, spatial web experience set within a moody, decaying industrial factory. Users navigate through physical "rooms" (Architecture, Design, Research, etc.) by interacting with glowing digital screens natively embedded within the background environment. 

This is a test project built solely using Jules - An Autonomous Coding Agent.

This repository contains the foundational structure, mechanics, and spatial navigation logic built with lightweight Vanilla HTML, CSS, and JS. 

## 📁 Project Structure & Graphic Files

The project follows a standard static web application structure:

```text
Factory/
├── index.html        # The main HTML structure (views, diegetic UI overlays)
├── styles.css        # Spatial layout, landscape-enforcement, fade transitions
├── script.js         # View switching logic, image preloading, event listeners
├── imagemap.js       # Dynamic, responsive <map> polygon coordinate recalculation
├── PROMPTS.md        # Detailed AI generation prompts for missing sub-room backgrounds
├── README.md         # This file
└── assets/           # ⚠️ ALL GRAPHIC FILES AND IMAGES GO HERE
    ├── main_hall.jpg      # The primary background image (Homepage)
    ├── architecture.jpg   # Background image for the Architecture sub-room
    ├── design.jpg         # Background image for the Design sub-room
    ├── research.jpg       # Background image for the Research sub-room
    └── large_p.jpg        # Background image for the Large 'P' sub-room
```

### Important Notes on Assets:
1. **The `assets/` Folder:** All visual assets, background images, and temporary references **must** be stored in the `/assets` directory. The application script explicitly looks for images in this location to handle the background preloading logic without stuttering. 
2. **Missing Files:** Initially, you will only have the Main Hall background image. You must generate the sub-room images (e.g., `architecture.jpg`, `design.jpg`) and place them in the `assets/` directory before clicking the navigation screens will work correctly.

## 🖼️ Generating Sub-Room Backgrounds

Because only the `Main Hall` image was provided by the client, the subsequent gallery room images must be generated using an AI image generation tool (like Midjourney, DALL-E 3, or Stable Diffusion). 

1. Open the included `PROMPTS.md` file.
2. Copy and paste the highly detailed prompts into your AI image generator of choice. These prompts are explicitly engineered to match the moody color grading, shadow depth, and spatial perspective of the Main Hall.
3. Once generated, save the files into the `assets/` folder with the precise filenames listed above (e.g., `design.jpg`).

## 🗺️ Updating Spatial Navigation Coordinates

The navigation relies on an invisible HTML `<map>` overlaid on top of the glowing screens in the `main_hall.jpg` image. The `imagemap.js` file dynamically recalculates the exact pixel coordinates of these polygons on window resize so the hitboxes always line up, regardless of screen aspect ratio.

If you ever replace `main_hall.jpg` with a new base image where the glowing screens have moved, you **must** update the relative coordinates in `imagemap.js`:

```javascript
// In imagemap.js
const relativeCoords = {
    // Format: [x1, y1, x2, y2, x3, y3, x4, y4] (Relative percentages from 0.0 to 1.0)
    'architecture': [0.15, 0.40, 0.30, 0.40, 0.30, 0.60, 0.15, 0.60], 
    // ...
};
```
*Tip: To find new relative coordinates, open your new image in an editor, find the pixel X/Y of the corners of the glowing screen, and divide by the total width/height of the image.*

## 📱 Mobile Landscape Enforcement

The experience is strictly designed for a spatial, wide-angle cinematic feel. If a user opens the gallery on a mobile device in portrait mode, the CSS and JS will automatically intercept the view and display an animated overlay prompting them to rotate their device.

---
*Built with Vanilla Web Technologies.*
