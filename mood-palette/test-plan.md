# Mood Palette Generator - Test Plan

This document outlines the testing procedures for the Mood Palette Generator plugin.

## Prerequisites

- R1 Creations SDK installed
- Web server running (e.g., `python3 -m http.server 8000`)
- Access to a camera (built-in or external)
- Network connectivity for AI integration

## Test Cases

### 1. Camera Access
- [ ] Navigate to the Mood Palette Generator
- [ ] Verify that camera access is requested
- [ ] Confirm video feed is displayed

### 2. Image Capture
- [ ] Click "Capture Image" button
- [ ] Verify that image is captured and displayed
- [ ] Confirm "Analyze Colors" button is enabled

### 3. Color Analysis
- [ ] Click "Analyze Colors" button
- [ ] Verify that color analysis is performed
- [ ] Confirm "Generate Palette" button is enabled

### 4. Palette Generation
- [ ] Click "Generate Palette" button
- [ ] Verify that color palette is displayed
- [ ] Confirm color swatches are shown
- [ ] Confirm "Email Palette" and "Save to Favorites" buttons are enabled

### 5. Email Functionality
- [ ] Enter valid email address
- [ ] Click "Email Palette" button
- [ ] Verify that email is sent (check console logs for simulation)

### 6. Secure Storage
- [ ] Click "Save to Favorites" button
- [ ] Verify that palette is saved to secure storage
- [ ] Click "View Favorites" button
- [ ] Confirm that saved palettes are retrieved

### 7. QR Code Generation
- [ ] Run `./generate-qr.sh` script
- [ ] Verify that QR code URL is generated
- [ ] Open URL in browser and confirm QR code is displayed

## Expected Results

All test cases should pass without errors. The plugin should handle edge cases gracefully:

- Camera access denied
- Invalid email addresses
- Storage errors
- Network connectivity issues

## Troubleshooting

If any test fails:

1. Check browser console for error messages
2. Verify all files are in the correct locations
3. Ensure web server is running
4. Confirm R1 device has network access
5. Check that all dependencies are properly loaded