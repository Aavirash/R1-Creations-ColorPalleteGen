# GitHub Pages Deployment Guide

## Prerequisites
1. A GitHub account
2. This deployment folder

## Deployment Steps

### 1. Create a GitHub Repository
1. Go to https://github.com and sign in
2. Click the "+" icon and select "New repository"
3. Name it `r1-mood-palette`
4. Set it to "Public"
5. **Don't** initialize with a README
6. Click "Create repository"

### 2. Upload Files Using GitHub Web Interface
1. On your new repository page, click "Add file" → "Upload files"
2. Drag all files from the `r1-mood-palette` folder into the upload area:
   - index.html
   - README.md
   - QR-INSTRUCTIONS.md
   - test-plan.md
   - generate-icon.html
   - icon.svg
   - images/ folder (with icon.png inside)
   - js/ folder (with mood-palette.js and create-icon.js inside)
3. Click "Commit changes"

### 3. Enable GitHub Pages
1. Go to your repository settings (click the gear icon)
2. Scroll down to the "Pages" section
3. Under "Source", select:
   - Branch: main
   - Folder: / (root)
4. Click "Save"
5. Wait 1-2 minutes for deployment

### 4. Get Your Public URL
After enabling GitHub Pages, you'll see a message like:
"Your site is ready to be published at https://yourusername.github.io/r1-mood-palette/"

This is your public URL for the Mood Palette Generator.

### 5. Update QR Code Configuration
Once deployed, update your `mood-palette-config.json` file with the public URL:

```json
{
  "title": "Mood Palette Generator",
  "url": "https://yourusername.github.io/r1-mood-palette/",
  "description": "Capture images and generate AI-powered color palettes with the R1 device",
  "iconUrl": "https://yourusername.github.io/r1-mood-palette/images/icon.png",
  "themeColor": "#FE5000"
}
```

Then regenerate your QR code:
```bash
./generate-qr.sh
```

### 6. Test Your Deployment
1. Visit your GitHub Pages URL in a browser
2. Make sure the Mood Palette Generator loads correctly
3. Test all functionality
4. Scan the QR code with your R1 device

## Troubleshooting

### Common Issues:
1. **404 Errors**: Make sure all files are in the root of the repository
2. **Files Not Updating**: GitHub Pages can take a few minutes to update
3. **Icon Not Showing**: Verify the icon.png file is in the images folder

### File Structure:
Make sure your repository has this structure:
```
r1-mood-palette/
├── index.html
├── README.md
├── QR-INSTRUCTIONS.md
├── test-plan.md
├── generate-icon.html
├── icon.svg
├── images/
│   └── icon.png
└── js/
    ├── mood-palette.js
    └── create-icon.js
```

## Next Steps
1. Follow the steps above to deploy to GitHub Pages
2. Update your QR code configuration with the public URL
3. Regenerate and test the QR code
4. Your Mood Palette Generator will now be accessible to the R1 device!