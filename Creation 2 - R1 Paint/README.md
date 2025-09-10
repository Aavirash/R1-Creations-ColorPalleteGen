# R1 Paint - Creative Drawing App for R1 Device

A unique drawing application designed specifically for the R1 device that leverages its hardware features to create an engaging and creative drawing experience.

## Concept

Unlike traditional precision-based drawing apps, R1 Paint focuses on creative expression through unconventional interaction methods using the R1's hardware features:
- PTT button for brush actions and canvas manipulation
- Scroll wheel for tool selection and brush size adjustment
- Accelerometer for tilt-based effects
- LLM integration for creative suggestions and sharing

## Features

### Core Drawing Features
- Canvas-based drawing with HTML5 Canvas
- Multiple brush types and effects
- Color palette with creative color selection
- Layer system for complex compositions
- Save/share functionality via email

### Hardware Integration
- **PTT Button**: 
  - Single press: Start/stop drawing
  - Long press: Activate special effects or tools
- **Scroll Wheel**:
  - Scroll up: Increase brush size or cycle forward through tools
  - Scroll down: Decrease brush size or cycle backward through tools
- **Accelerometer**:
  - Tilt effects for brush dynamics
  - Shake to clear canvas
- **LLM Integration**:
  - Creative prompts and suggestions
  - Automatic naming of artworks
  - Email sharing with descriptions

## Technical Specifications

### Screen Dimensions
- 240x282px portrait orientation
- Optimized UI for small screen
- High contrast brutalist design aesthetic

### File Structure
```
/
├── index.html          # Main application
├── css/
│   └── styles.css      # Brutalist styling
├── js/
│   └── r1-paint.js     # Application logic
└── images/
    └── icon.png        # App icon
```

## Design Philosophy

- **Creative Focus**: Prioritize creative expression over precision
- **Hardware-First**: Design around R1's unique hardware features
- **Brutalist Aesthetic**: Bold, high-contrast interface
- **Minimal UI**: Simple interface that doesn't obstruct the canvas
- **Performance**: Optimized for R1's limited hardware