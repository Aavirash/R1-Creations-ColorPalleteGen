# Deployment Guide for Mood Palette Generator

## Why Localhost Doesn't Work with R1

When you run `python3 -m http.server 8000`, your server is only accessible on your local network at `localhost:8000` or `127.0.0.1:8000`. The R1 device cannot access this because:

1. `localhost` refers to the R1 device itself, not your computer
2. Your computer's firewall likely blocks external access
3. Even on the same network, devices need the actual IP address, not localhost

## Solution: Deploy to a Public Hosting Service

### Option 1: GitHub Pages (Recommended for Beginners)

#### Step 1: Prepare Your Files
1. Create a new folder called `r1-mood-palette-deploy`
2. Copy the essential files:

```bash
mkdir r1-mood-palette-deploy
cp -r plugin-demo/mood-palette/* r1-mood-palette-deploy/
```

#### Step 2: Create GitHub Repository
1. Go to github.com and sign up/sign in
2. Click "New repository"
3. Name it `r1-mood-palette`
4. Don't initialize with README
5. Click "Create repository"

#### Step 3: Upload Files
```bash
# If you have git installed
cd r1-mood-palette-deploy
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/r1-mood-palette.git
git push -u origin main

# Or simply drag and drop files in GitHub web interface
```

#### Step 4: Enable GitHub Pages
1. Go to your repository settings
2. Scroll down to "Pages" section
3. Under "Source", select "Deploy from a branch"
4. Select "main" branch and "/ (root)" folder
5. Click "Save"
6. Wait a minute for deployment
7. Your site will be available at `https://yourusername.github.io/r1-mood-palette/`

### Option 2: Netlify (Easiest)

#### Step 1: Prepare Files
Same as above - create the `r1-mood-palette-deploy` folder with your files.

#### Step 2: Deploy
1. Go to https://app.netlify.com/drop
2. Drag and drop the `r1-mood-palette-deploy` folder
3. Wait for deployment to complete
4. You'll get a URL like `random-words.netlify.app`

### Option 3: Vercel

#### Step 1: Prepare Files
Same folder structure as above.

#### Step 2: Deploy
1. Go to https://vercel.com/
2. Sign up/sign in
3. Click "New Project"
4. Import the folder or connect GitHub repository
5. Follow deployment steps
6. Get your deployment URL

## Updating Your QR Code

Once deployed, update your configuration file with the public URL:

```json
{
  "title": "Mood Palette Generator",
  "url": "https://your-deployment-url.com",
  "description": "Capture images and generate AI-powered color palettes with the R1 device",
  "iconUrl": "https://your-deployment-url.com/images/icon.png",
  "themeColor": "#FE5000"
}
```

Then regenerate your QR code:
```bash
./generate-qr.sh
```

## Testing Your Deployment

1. Open your deployment URL in a browser
2. Make sure all functionality works
3. Test the QR code with a regular QR scanner (not just R1)
4. Then test with R1 device

## Troubleshooting

### Common Issues:
1. **404 Errors**: Check file paths - they should be relative, not absolute
2. **CORS Issues**: Some hosting services require special headers for API calls
3. **File Permissions**: Make sure all files are publicly readable

### File Path Fixes:
Make sure all references in your HTML/JS files are relative:
- ❌ `/plugin-demo/mood-palette/images/icon.png`
- ✅ `images/icon.png` or `./images/icon.png`

## Next Steps

1. Deploy your Mood Palette Generator using one of the methods above
2. Update the configuration with your public URL
3. Regenerate the QR code
4. Test with R1 device

This should resolve the issue with the upside-down Android icon and make your app accessible to the R1 device!