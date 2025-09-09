# Mood Palette Generator

A creative tool for the R1 device that captures images, analyzes their colors, and generates harmonious color palettes using AI.

## Features

- **Camera Integration**: Use the R1's camera to capture images
- **AI Color Analysis**: Leverage the LLM to analyze and interpret colors
- **Palette Generation**: Create beautiful color palettes from captured images
- **Email Sharing**: Send your favorite palettes directly to your email
- **Secure Storage**: Save favorite palettes to the device's secure storage
- **QR Code Sharing**: Generate QR codes for easy sharing of your palettes

## How to Use

1. Navigate to the "Mood Palette" section in the R1 Creations SDK demo
2. Point the camera at an object or scene that inspires you
3. Click "Capture Image" to take a snapshot
4. Click "Analyze Colors" to process the image
5. Click "Generate Palette" to create a color palette
6. Enter your email and click "Email Palette" to send it to yourself
7. Click "Save to Favorites" to store the palette in secure storage

## Technical Details

This plugin demonstrates several key capabilities of the R1 platform:

- Camera access using WebRTC APIs
- Image processing and color extraction
- AI integration through the PluginMessageHandler
- Secure data storage using creationStorage.secure
- Email functionality through LLM integration

## Future Enhancements

- More sophisticated color analysis algorithms
- Palette naming using AI
- Social sharing features
- Export to design tools
- Advanced palette manipulation tools