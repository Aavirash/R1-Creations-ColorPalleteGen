#!/bin/bash

echo "Verifying Mood Palette Generator setup..."

# Check if server is running
if curl -s http://localhost:8000 > /dev/null; then
    echo "✓ Web server is running"
else
    echo "✗ Web server is not running. Please start it with: python3 -m http.server 8000"
    exit 1
fi

# Check main files
FILES_TO_CHECK=(
    "/plugin-demo/mood-palette/index.html"
    "/plugin-demo/mood-palette/js/mood-palette.js"
    "/plugin-demo/mood-palette/icon.svg"
    "/qr/final/index_fixed.html"
    "/qr/final/js/app.js"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if curl -s --head http://localhost:8000$file | head -n 1 | grep "200" > /dev/null; then
        echo "✓ $file is accessible"
    else
        echo "✗ $file is not accessible"
    fi
done

# Test QR code generation
echo "Testing QR code generation..."
QR_URL="http://localhost:8000/qr/final/index_fixed.html?jsondata=eyJ0aXRsZSI6Ik1vb2QgUGFsZXR0ZSBHZW5lcmF0b3IiLCJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvcGx1Z2luLWRlbW8vbW9vZC1wYWxldHRlLyIsImRlc2NyaXB0aW9uIjoiQ2FwdHVyZSBpbWFnZXMgYW5kIGdlbmVyYXRlIEFJLXBvd2VyZWQgY29sb3IgcGFsZXR0ZXMgd2l0aCB0aGUgUjEgZGV2aWNlIiwiaWNvblVybCI6Imh0dHBzOi8vaWNvbnMudmVyeWljb24uY29tL3BuZy9vL21pc2NlbGxhbmVvdXMvZm9ybS1jb21wb25lbnQvcXItY29kZS0yMzYucG5nIiwidGhlbWVDb2xvciI6IiNGRTUwMDAifQo"

if curl -s --head "$QR_URL" | head -n 1 | grep "200" > /dev/null; then
    echo "✓ QR code URL is accessible"
else
    echo "✗ QR code URL is not accessible"
fi

echo "Verification complete!"