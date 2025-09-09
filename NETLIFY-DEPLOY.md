# Deploying to Netlify - Quick Guide

## Why Netlify?

Netlify is one of the easiest ways to deploy static websites:
- No configuration required
- Drag and drop deployment
- Free tier available
- Automatic SSL
- Custom domain support

## Step-by-Step Deployment

### 1. Prepare Your Files
Make sure you have the deployment package ready:
- Run `./deploy.sh` to create the package
- You should have `r1-mood-palette-deploy.zip` file

### 2. Deploy to Netlify

1. **Go to Netlify**
   - Visit https://app.netlify.com/drop
   - You may need to sign up for a free account

2. **Drag and Drop**
   - Unzip `r1-mood-palette-deploy.zip` 
   - Drag the `r1-mood-palette-deploy` folder onto the Netlify drop area
   - Wait for deployment to complete (usually 1-2 minutes)

3. **Get Your URL**
   - Netlify will give you a random subdomain like `wonderful-einstein-123456.netlify.app`
   - This is your public URL for the Mood Palette Generator

### 3. Test Your Deployment

1. **Visit Your Site**
   - Open the Netlify URL in your browser
   - Make sure the Mood Palette Generator loads correctly

2. **Test Functionality**
   - Try accessing the camera
   - Test the color analysis
   - Verify all buttons work

### 4. Update QR Code Configuration

1. **Edit Configuration**
   Update `mood-palette-config.json` with your Netlify URL:
   ```json
   {
     "title": "Mood Palette Generator",
     "url": "https://your-netlify-url.netlify.app",
     "description": "Capture images and generate AI-powered color palettes with the R1 device",
     "iconUrl": "https://your-netlify-url.netlify.app/images/icon.png",
     "themeColor": "#FE5000"
   }
   ```

2. **Regenerate QR Code**
   ```bash
   ./generate-qr.sh
   ```

3. **Test QR Code**
   - Open the generated QR code URL in your browser
   - Scan with a regular QR scanner to verify it works
   - Test with your R1 device

### 5. Custom Domain (Optional)

If you want a custom domain:

1. In Netlify dashboard, go to your site settings
2. Click "Domain management"
3. Add a custom domain
4. Follow Netlify's instructions for DNS configuration

## Troubleshooting

### Common Issues:

1. **Site Not Loading**
   - Make sure `index.html` is in the root of your deployed folder
   - Check browser console for errors

2. **Images Not Loading**
   - Verify image paths are relative (e.g., `images/icon.png`)
   - Not absolute (e.g., `/images/icon.png`)

3. **QR Code Issues**
   - Ensure all URLs in the configuration are public URLs
   - Not localhost or local IP addresses

### File Path Fixes:

In your HTML and JavaScript files, make sure all paths are relative:
- ❌ `/plugin-demo/mood-palette/images/icon.png`
- ✅ `images/icon.png` or `./images/icon.png`

## Next Steps

1. Deploy your Mood Palette Generator to Netlify
2. Update the configuration with your public URL
3. Regenerate the QR code
4. Test with R1 device

This should resolve the issue with the upside-down Android icon and make your app accessible to the R1 device!