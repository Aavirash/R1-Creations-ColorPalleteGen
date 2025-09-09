#!/bin/bash

# Script to generate QR code for the Mood Palette Generator plugin

# Check if jq is installed
if ! command -v jq &> /dev/null
then
    echo "jq could not be found, please install it first"
    exit 1
fi

# Read the configuration file
CONFIG_FILE="mood-palette-config.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Configuration file not found: $CONFIG_FILE"
    exit 1
fi

# Read configuration values
TITLE=$(jq -r '.title' "$CONFIG_FILE")
URL=$(jq -r '.url' "$CONFIG_FILE")
DESCRIPTION=$(jq -r '.description' "$CONFIG_FILE")
ICON_URL=$(jq -r '.iconUrl' "$CONFIG_FILE")
THEME_COLOR=$(jq -r '.themeColor' "$CONFIG_FILE")

# Create JSON data
JSON_DATA="{\"title\":\"$TITLE\",\"url\":\"$URL\",\"description\":\"$DESCRIPTION\",\"iconUrl\":\"$ICON_URL\",\"themeColor\":\"$THEME_COLOR\"}"

# Encode JSON data to base64 (URL-safe)
ENCODED_DATA=$(echo "$JSON_DATA" | base64 | tr -d '=' | tr '/+' '_-')

# Generate QR code URL (assuming you're using the local QR generator)
QR_URL="http://localhost:8000/qr/final/index_fixed.html?jsondata=$ENCODED_DATA"

echo "QR Code URL:"
echo "$QR_URL"

# If qrencode is installed, generate an actual QR code image
if command -v qrencode &> /dev/null
then
    qrencode -o mood-palette-qr.png "$QR_URL"
    echo "QR code saved to mood-palette-qr.png"
else
    echo "To generate an actual QR code image, please install qrencode:"
    echo "  brew install qrencode (on macOS)"
    echo "  sudo apt-get install qrencode (on Ubuntu/Debian)"
fi