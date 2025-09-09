# Mood Palette Generator - QR Code Instructions

This document explains how to generate and use a QR code for the Mood Palette Generator plugin.

## Prerequisites

1. Ensure you have the R1 Creations SDK installed and running
2. Make sure the web server is running (e.g., using `python3 -m http.server 8000`)
3. Have the QR code generator accessible (at `/qr/final/index_fixed.html`)

## Generating the QR Code

1. Update the `mood-palette-config.json` file with your actual deployment URL:
   ```json
   {
     "title": "Mood Palette Generator",
     "url": "https://your-actual-domain.com/plugin-demo/mood-palette/",
     "description": "Capture images and generate AI-powered color palettes with the R1 device",
     "iconUrl": "https://your-actual-domain.com/plugin-demo/mood-palette/icon.png",
     "themeColor": "#FE5000"
   }
   ```

2. Run the QR generation script:
   ```bash
   ./generate-qr.sh
   ```

3. The script will output a URL that can be used to generate the QR code. It will look something like:
   ```
   http://localhost:8000/qr/final/index_fixed.html?jsondata=eyJ0aXRsZSI6Ik1vb2QgUGFsZXR0ZSBHZW5lcmF0b3IiLCJ1cmwiOiJodHRwczovL3lvdXItYWN0dWFsLWRvbWFpbi5jb20vcGx1Z2luLWRlbW8vbW9vZC1wYWxldHRlLyIsImRlc2NyaXB0aW9uIjoiQ2FwdHVyZSBpbWFnZXMgYW5kIGdlbmVyYXRlIEFJLXBvd2VyZWQgY29sb3IgcGFsZXR0ZXMgd2l0aCB0aGUgUjEgZGV2aWNlIiwiaWNvblVybCI6Imh0dHBzOi8veW91ci1hY3R1YWwtZG9tYWluLmNvbS9wbHVnaW4tZGVtby9tb29kLXBhbGV0dGUvaWNvbi5wbmciLCJ0aGVtZUNvbG9yIjoiI0ZFNzAwMCJ9
   ```

4. Open this URL in your browser to generate the QR code.

5. If you have `qrencode` installed, the script will also generate a PNG image of the QR code.

## Using the QR Code

1. Scan the QR code with your R1 device
2. The device will load the Mood Palette Generator plugin
3. Follow the on-screen instructions to capture images and generate color palettes

## Customization

You can customize the QR code by modifying the `mood-palette-config.json` file:

- `title`: The name that will appear when scanning the QR code
- `url`: The URL where your plugin is hosted
- `description`: A brief description of what the plugin does
- `iconUrl`: URL to an icon image for the plugin
- `themeColor`: The primary color for the QR code styling

## Troubleshooting

- If the QR code doesn't work, make sure the URL in the configuration is correct and accessible
- Ensure your web server is running and the plugin files are in the correct location
- Check that the R1 device has network access to your server