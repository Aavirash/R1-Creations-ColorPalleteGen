# R1 Paint - Comprehensive Development Plan

## Overview
R1 Paint is a creative drawing application designed specifically for the R1 device that leverages its unique hardware features to provide an unconventional and engaging drawing experience. Unlike traditional precision-based drawing apps, this app focuses on creative expression through experimental interactions.

## Core Concept
The app will transform the R1 into a creative tool where:
- Drawing is not about precision but about expression
- Hardware features enable unique creative interactions
- The small screen becomes an advantage for focused creation
- LLM integration provides creative prompts and sharing capabilities

## Hardware Integration Plan

### 1. PTT Button Usage
**Primary Functions:**
- **Single Press**: Start/stop drawing mode
- **Long Press**: Activate special effects or alternative tools
- **Double Press**: Quick action (context dependent - e.g., undo last stroke)

**Implementation Details:**
```javascript
// Event listeners for PTT button
window.addEventListener("sideClick", handlePTTClick);
window.addEventListener("longPressStart", handlePTTLongPressStart);
window.addEventListener("longPressEnd", handlePTTLongPressEnd);
```

### 2. Scroll Wheel Usage
**Primary Functions:**
- **Scroll Up**: Increase brush size or cycle forward through tools
- **Scroll Down**: Decrease brush size or cycle backward through tools

**Implementation Details:**
```javascript
// Event listeners for scroll wheel
window.addEventListener("scrollUp", handleScrollUp);
window.addEventListener("scrollDown", handleScrollDown);
```

### 3. Accelerometer Integration
**Primary Functions:**
- **Tilt Effects**: Change brush dynamics based on device tilt
- **Shake Detection**: Clear canvas or trigger special effects
- **Orientation Changes**: Modify drawing behavior

**Implementation Details:**
```javascript
// Accelerometer access
const isAvailable = await window.creationSensors.accelerometer.isAvailable();
window.creationSensors.accelerometer.start(handleAccelerometerData, { frequency: 30 });
```

## Canvas Drawing Features

### 1. Brush System
**Brush Types:**
- **Standard Brush**: Basic drawing tool
- **Spray Brush**: Particle-based spray effect
- **Trail Brush**: Creates trailing effects as you draw
- **Pressure Brush**: Size varies based on "pressure" (simulated)
- **Dotted Brush**: Creates dotted line patterns
- **Eraser**: Removes parts of the drawing

**Brush Properties:**
- Size (1px to 50px)
- Opacity (10% to 100%)
- Color
- Dynamics (affected by tilt/accelerometer)

### 2. Color System
**Color Selection Methods:**
- Predefined creative palettes
- Random color generator
- Color picker from existing canvas
- LLM-suggested color combinations

**Palette Ideas:**
- Emotional palettes (Happy, Sad, Energetic, Calm)
- Nature-inspired (Ocean, Forest, Sunset, Desert)
- Retro/vintage color schemes
- High-contrast brutalist combinations

### 3. Special Effects
**Dynamic Effects:**
- Particle trails that follow the brush
- Gravity-affected elements
- Tilt-responsive brush behavior
- Time-based color shifts

**Static Effects:**
- Texture overlays
- Blend modes
- Pattern fills

### 4. Canvas Management
- Multiple layers (limited due to memory constraints)
- Canvas size optimized for 240x282px
- Efficient rendering for R1's limited hardware
- Undo/redo functionality (limited history for performance)

## User Interface Design

### Screen Layout
1. **Drawing Canvas**: Main drawing area (maximized for creative space)
2. **Tool Selector**: Minimal toolbar with active tool indicator
3. **Brush Controls**: Size indicator and quick adjustments
4. **Color Palette**: Current color and quick color selections
5. **Status Bar**: Real-time feedback and instructions

### Interaction Model
- **Modal-free design**: All controls accessible without switching screens
- **Context-sensitive actions**: PTT and scroll wheel functions change based on mode
- **Visual feedback**: Immediate response to all interactions
- **Gestures**: Tap, drag, and special combinations for advanced features

## LLM Integration Features

### 1. Creative Prompts
- "Draw something that represents joy"
- "Create an abstract representation of sound"
- "Sketch a futuristic cityscape"

### 2. Art Analysis
- Describe the current drawing
- Suggest improvements or additions
- Generate creative names for artworks

### 3. Sharing Features
- Email artwork with LLM-generated description
- Social media optimized sharing
- Artwork archiving with metadata

## Technical Implementation Plan

### Phase 1: Core Drawing Functionality
1. Basic HTML5 Canvas implementation
2. Standard brush tool with size/opacity controls
3. Color selection system
4. Basic UI framework
5. Save/load functionality using local storage

### Phase 2: Hardware Integration
1. PTT button integration for drawing control
2. Scroll wheel for tool/size adjustment
3. Accelerometer for tilt effects
4. Performance optimization for R1 hardware

### Phase 3: Advanced Features
1. Special brush types and effects
2. Particle systems for dynamic visuals
3. Layer system (if performance allows)
4. Advanced color management

### Phase 4: LLM Integration
1. Prompt system for creative inspiration
2. Artwork analysis and naming
3. Email sharing with descriptions
4. Social features

## Performance Considerations

### Memory Management
- Limit canvas history to prevent memory issues
- Efficient particle system implementation
- Optimized rendering loops
- Smart cleanup of unused resources

### Rendering Optimization
- Use hardware-accelerated CSS properties
- Minimize DOM operations
- Efficient canvas redraw strategies
- Frame rate management for smooth interaction

### Battery Life
- Adaptive performance based on battery level
- Efficient sensor usage
- Smart redraw only when necessary

## Unique Features for R1

### 1. Expressive Drawing Over Precision
- Embrace the small screen as a creative constraint
- Focus on gestural drawing rather than detailed work
- Use hardware features to enable unique interactions

### 2. Hardware-Centric Interactions
- PTT button as primary drawing trigger
- Scroll wheel for intuitive parameter adjustment
- Accelerometer for dynamic brush behavior
- No reliance on touch precision

### 3. Creative Constraints
- Limited color palette encourages creative choices
- Fixed canvas size focuses attention
- Special effects replace complex tools

## File Structure
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

## Development Timeline

### Week 1: Foundation
- Basic canvas implementation
- Standard brush tool
- Simple UI framework
- Core event handling

### Week 2: Hardware Integration
- PTT button functionality
- Scroll wheel controls
- Basic accelerometer integration
- Performance optimization

### Week 3: Advanced Drawing Features
- Multiple brush types
- Color system implementation
- Special effects development
- Particle system basics

### Week 4: LLM Integration & Polish
- Prompt system
- Email sharing
- Final UI refinements
- Testing and optimization

## Success Metrics
- Smooth performance on R1 device
- Intuitive hardware integration
- Creative engagement (measured through usage patterns)
- Positive user feedback on uniqueness
- Successful artwork sharing via email

## Risk Mitigation
- Performance issues: Simplify features if needed
- Hardware limitations: Design within constraints from start
- User adoption: Focus on unique value proposition
- LLM integration: Have fallback functionality without LLM