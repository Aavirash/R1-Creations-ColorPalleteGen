# R1 Mood Palette Generator

Capture images with your R1 device and generate color palettes using AI-powered analysis.

## About

The Mood Palette Generator is a specialized creation for the R1 device that transforms visual moments into color stories. Simply point your camera, capture an image, and instantly receive a harmonious color palette extracted from the scene.

## Features

- **Instant Camera Capture**: Use the R1's PTT button or on-screen controls to capture images
- **AI Color Analysis**: Extract dominant colors using client-side processing
- **Visual Palette Display**: See your colors as visual swatches with hex codes
- **Email Integration**: Send your palettes directly to your email via R1's LLM
- **Brutalist Design**: High-contrast yellow, red, and green aesthetic optimized for R1's 240x282px screen

## Quick Start

1. Open the Mood Palette Generator on your R1
2. Press "START CAMERA" to initialize the camera
3. Point at your subject and press the PTT button to capture
4. Tap "GENERATE PALETTE" to extract colors
5. Use "EMAIL MY PALETTE" to send results to your inbox

## Technical Details

### File Structure
```
/
├── index.html          # Main application
├── css/
│   └── styles.css      # Brutalist styling
├── js/
│   └── mood-palette.js # Application logic
└── images/
    └── icon.png        # App icon
```

### How It Works

1. **Capture**: Image captured via R1 camera using PTT button
2. **Process**: Client-side color extraction using HTML Canvas
3. **Display**: Colors shown as visual swatches with hex codes
4. **Share**: Send palettes via email using R1's LLM integration

### Design Philosophy

- **Brutalist Aesthetic**: Bold yellow (#ff0), red (#f00), and green (#0f0) color scheme
- **Optimized UI**: All elements fit within R1's tiny screen constraints
- **Intuitive Workflow**: Three-screen process that replaces content instead of scrolling
- **Hardware Integration**: Full support for R1's PTT button and hardware features

## Requirements

- R1 device with camera and PTT button
- Internet connection for email functionality
- Rabbit OS compatible browser

## Support

For issues or questions about the Mood Palette Generator, please check that:
- Camera permissions are enabled for the R1 browser
- Internet connectivity is available for email sending
- The PTT button is functioning properly