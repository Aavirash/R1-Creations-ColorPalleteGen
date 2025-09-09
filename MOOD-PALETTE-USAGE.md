# Mood Palette Generator - Usage Guide

## Prerequisites
1. The web server must be running (python3 -m http.server 8000)
2. A device with a camera (built-in or external)
3. A modern web browser

## Accessing the Mood Palette Generator

### Method 1: Through the Main Demo App (Recommended)
1. Start the web server: `python3 -m http.server 8000`
2. Open your browser and go to: http://localhost:8000/plugin-demo/
3. Click the menu button (☰) in the top left
4. Select "Mood Palette" from the menu

### Method 2: Direct Access
1. Start the web server: `python3 -m http.server 8000`
2. Open your browser and go to: http://localhost:8000/plugin-demo/mood-palette/

## Using the Mood Palette Generator

1. **Camera Access**: When you first load the app, it will request access to your camera. Click "Allow" to proceed.

2. **Capture Image**: 
   - Position your camera to frame the object or scene you want to analyze
   - Click the "Capture Image" button to take a snapshot

3. **Analyze Colors**:
   - After capturing the image, click the "Analyze Colors" button
   - The app will process the image and identify dominant colors

4. **Generate Palette**:
   - Click the "Generate Palette" button
   - A color palette will be displayed as swatches

5. **Email Palette**:
   - Enter your email address in the input field
   - Click the "Email Palette" button
   - The palette will be sent to your email (simulated in this demo)

6. **Save to Favorites**:
   - Click the "Save to Favorites" button to store the palette in secure storage
   - Click "View Favorites" to see your saved palettes

## Generating QR Codes for Sharing

To generate a QR code that others can scan to access the Mood Palette Generator:

1. Run the QR generation script:
   ```bash
   ./generate-qr.sh
   ```

2. The script will output a URL that looks like this:
   ```
   http://localhost:8000/qr/final/index_fixed.html?jsondata=...
   ```

3. Open this URL in your browser to view and scan the QR code

4. When scanned with an R1 device, it will load the Mood Palette Generator

## Troubleshooting

### Camera Not Working
- Ensure your browser has permission to access the camera
- Check that no other applications are using the camera
- Try refreshing the page

### QR Code Issues
- Make sure the web server is running
- Verify that all files are in their correct locations
- Try regenerating the QR code with the `./generate-qr.sh` script
- Ensure the icon URL points to a valid PNG image (QR codes work best with PNG icons)

### Storage Issues
- Secure storage only works when running as an actual R1 creation
- In browser mode, storage functionality is simulated

## Files Overview

- `plugin-demo/mood-palette/index.html` - Main interface
- `plugin-demo/mood-palette/js/mood-palette.js` - Core functionality
- `plugin-demo/mood-palette/images/icon.png` - App icon (PNG format for QR code compatibility)
- `mood-palette-config.json` - Configuration for QR code generation
- `generate-qr.sh` - Script to generate QR codes
- `verify-setup.sh` - Script to verify all components are working

## Testing

Run the verification script to ensure everything is set up correctly:
```bash
./verify-setup.sh
```

## Notes on QR Code Generation

The QR code generator works best with PNG icons rather than SVG. We've created a PNG version of the app icon to ensure compatibility with QR code scanning on R1 devices. The icon is located at `plugin-demo/mood-palette/images/icon.png` and is referenced in the configuration file.