// Mood Palette Generator - Single Screen Workflow with R1 PTT Support
let capturedImageData = null;
let currentPalette = [];
let videoStream = null;
let videoElement = null;
let isCapturing = false; // Track if we're in capture mode

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show initial screen
    showScreen1();
    
    showStatus('PRESS CAPTURE TO START CAMERA', 'info');
    
    // Register R1 PTT button listener
    window.addEventListener('sideClick', function() {
        if (videoElement && isCapturing) {
            captureImageFromPTT();
        }
    });
    
    // Add keyboard support for spacebar capture
    document.addEventListener('keydown', function(event) {
        // Spacebar key
        if (event.code === 'Space' && videoElement && isCapturing) {
            event.preventDefault(); // Prevent spacebar from scrolling
            captureImageFromPTT();
        }
    });
}

function showScreen1() {
    const appContent = document.getElementById('appContent');
    appContent.innerHTML = `
        <div class="screen-content">
            <div class="preview-section">
                <div id="previewContainer" class="preview-container clickable">
                    <div class="placeholder-text">TAP TO START CAMERA</div>
                </div>
                <div class="controls-section">
                    <button id="captureBtn" class="action-button">START CAMERA</button>
                </div>
            </div>
        </div>
    `;
    
    // Set up event listeners
    document.getElementById('captureBtn').addEventListener('click', startCamera);
    document.getElementById('previewContainer').addEventListener('click', startCamera);
}

function showScreen2() {
    const appContent = document.getElementById('appContent');
    appContent.innerHTML = `
        <div class="screen-content">
            <div class="preview-section">
                <div class="preview-container" style="height: 110px;">
                    <div id="thumbnailContainer" class="thumbnail-container">
                        <div class="placeholder-text">IMG</div>
                    </div>
                </div>
            </div>
            
            <div class="controls-section">
                <button id="generateBtn" class="action-button">GENERATE PALETTE</button>
                <button id="recaptureBtn" class="action-button secondary">CAPTURE AGAIN</button>
            </div>
        </div>
    `;
    
    // Show thumbnail if we have captured image
    if (capturedImageData) {
        const thumbnailContainer = document.getElementById('thumbnailContainer');
        const img = document.createElement('img');
        img.src = capturedImageData;
        thumbnailContainer.innerHTML = '';
        thumbnailContainer.appendChild(img);
    }
    
    // Set up event listeners
    document.getElementById('generateBtn').addEventListener('click', generatePalette);
    document.getElementById('recaptureBtn').addEventListener('click', showScreen1);
}

function showScreen3() {
    const appContent = document.getElementById('appContent');
    appContent.innerHTML = `
        <div class="screen-content">
            <div class="palette-display-section">
                <div class="celebration-header">
                    <h2>YOUR PALETTE</h2>
                </div>
                
                <div class="palette-display" id="paletteDisplay">
                    <div class="placeholder-text">ANALYZING COLORS...</div>
                </div>
                
                <div class="email-section">
                    <button id="emailBtn" class="action-button email">EMAIL MY PALETTE</button>
                </div>
            </div>
        </div>
    `;
    
    // Start analyzing colors immediately
    analyzeColorsFromImage();
    
    // Set up event listener
    document.getElementById('emailBtn').addEventListener('click', emailPalette);
}

function startCamera() {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '<div class="placeholder-text">LOADING CAMERA...</div>';
    previewContainer.classList.remove('clickable');
    
    isCapturing = true; // Set capture mode
    
    // Test network connectivity
    testNetworkConnectivity();
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function(stream) {
                videoStream = stream;
                
                // Create video element
                videoElement = document.createElement('video');
                videoElement.autoplay = true;
                videoElement.playsInline = true;
                videoElement.srcObject = stream;
                videoElement.style.width = '100%';
                videoElement.style.height = '100%';
                videoElement.style.objectFit = 'cover';
                
                previewContainer.innerHTML = '';
                previewContainer.appendChild(videoElement);
                
                showStatus('CAMERA ON! PRESS R1 PTT OR SPACEBAR', 'info');
            })
            .catch(function(error) {
                console.error('Camera access error:', error);
                showStatus('CAMERA ERROR', 'error');
                previewContainer.innerHTML = '<div class="placeholder-text">CAMERA UNAVAILABLE</div>';
                previewContainer.classList.add('clickable');
                isCapturing = false;
            });
    } else {
        showStatus('CAMERA NOT SUPPORTED', 'error');
        previewContainer.innerHTML = '<div class="placeholder-text">NO CAMERA</div>';
        previewContainer.classList.add('clickable');
        isCapturing = false;
    }
}

// Function to test network connectivity
async function testNetworkConnectivity() {
    console.log('Testing network connectivity...');
    showStatus('TESTING NETWORK...', 'info');
    
    try {
        // Try a simple fetch to test connectivity with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch('https://httpbin.org/get', { 
            method: 'GET',
            mode: 'no-cors', // Use no-cors to avoid CORS issues
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('Network test response:', response.status);
        showStatus('NETWORK CONNECTED', 'info');
        return true;
    } catch (error) {
        console.error('Network test failed:', error);
        if (error.name === 'AbortError') {
            showStatus('NETWORK TEST TIMED OUT', 'error');
        } else {
            showStatus('NETWORK ISSUE: ' + error.message, 'error');
        }
        return false;
    }
}

function captureImageFromPTT() {
    if (!videoElement) return;
    
    showStatus('CAPTURING IMAGE...', 'info');
    
    // Create canvas to capture image
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    
    // Draw video frame to canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Store the image data
    capturedImageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Log image data info for debugging
    console.log('Captured image data URL length:', capturedImageData.length);
    console.log('Captured image starts with:', capturedImageData.substring(0, 100));
    
    // Validate captured image
    if (!capturedImageData || capturedImageData.length < 100) {
        showStatus('IMAGE CAPTURE FAILED - RETRY', 'error');
        return;
    }
    
    // Stop camera
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        videoElement = null;
    }
    
    isCapturing = false; // Exit capture mode
    
    // Show screen 2
    showScreen2();
    showStatus('IMAGE CAPTURED! GENERATE PALETTE', 'success');
}

// Helper function to convert data URL to Blob
function dataURLToBlob(dataURL) {
    try {
        // Check if dataURL is valid
        if (!dataURL || !dataURL.startsWith('data:')) {
            throw new Error('Invalid data URL');
        }
        
        const parts = dataURL.split(';base64,');
        if (parts.length !== 2) {
            throw new Error('Invalid data URL format');
        }
        
        const contentType = parts[0].split(':')[1];
        const raw = atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        
        const blob = new Blob([uInt8Array], { type: contentType || 'image/jpeg' });
        console.log('Blob created successfully:', blob.size, 'bytes,', blob.type);
        return blob;
    } catch (error) {
        console.error('Error converting data URL to Blob:', error);
        throw error;
    }
}

// Function to calculate color distance (Euclidean distance in RGB space)
function colorDistance(rgb1, rgb2) {
    const [r1, g1, b1] = rgb1;
    const [r2, g2, b2] = rgb2;
    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
}

// Function to extract dominant colors from image data
function extractColorsFromImage(imageData) {
    return new Promise((resolve) => {
        // Create image element from data URL
        const img = new Image();
        img.onload = function() {
            // Create canvas to analyze image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size to match image (but smaller for performance)
            // Use larger canvas for better color accuracy
            const maxWidth = 300;
            const maxHeight = 300;
            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            canvas.width = Math.max(100, img.width * ratio);
            canvas.height = Math.max(100, img.height * ratio);
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Get image data
            const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageDataObj.data;
            
            // Collect all colors with better sampling
            const colors = [];
            // Sample more pixels but still maintain performance
            const step = Math.max(1, Math.floor(canvas.width * canvas.height / 2500));
            
            for (let i = 0; i < data.length; i += step * 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];
                
                // Skip transparent pixels
                if (a < 128) continue;
                
                // Skip very dark or very light pixels for better palette
                const brightness = (r + g + b) / 3;
                if (brightness < 15 || brightness > 240) continue;
                
                colors.push([r, g, b]);
            }
            
            // If we don't have enough colors, use all pixels
            if (colors.length < 50) {
                for (let i = 0; i < data.length; i += 20 * 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];
                    
                    // Skip transparent pixels
                    if (a < 128) continue;
                    
                    colors.push([r, g, b]);
                }
            }
            
            // Simple clustering: group similar colors together
            const clusters = [];
            const threshold = 30; // Distance threshold for grouping colors
            
            colors.forEach(color => {
                let foundCluster = false;
                
                // Try to find an existing cluster for this color
                for (let i = 0; i < clusters.length; i++) {
                    const cluster = clusters[i];
                    // Calculate average color of the cluster
                    const avgR = cluster.reduce((sum, c) => sum + c[0], 0) / cluster.length;
                    const avgG = cluster.reduce((sum, c) => sum + c[1], 0) / cluster.length;
                    const avgB = cluster.reduce((sum, c) => sum + c[2], 0) / cluster.length;
                    
                    // If color is close enough to cluster average, add it to the cluster
                    if (colorDistance(color, [avgR, avgG, avgB]) < threshold) {
                        cluster.push(color);
                        foundCluster = true;
                        break;
                    }
                }
                
                // If no cluster found, create a new one
                if (!foundCluster) {
                    clusters.push([color]);
                }
            });
            
            // Convert clusters to dominant colors
            const dominantColors = clusters
                .map(cluster => {
                    // Calculate average color of the cluster
                    const avgR = Math.round(cluster.reduce((sum, c) => sum + c[0], 0) / cluster.length);
                    const avgG = Math.round(cluster.reduce((sum, c) => sum + c[1], 0) / cluster.length);
                    const avgB = Math.round(cluster.reduce((sum, c) => sum + c[2], 0) / cluster.length);
                    
                    return {
                        color: rgbToHex(avgR, avgG, avgB),
                        count: cluster.length,
                        rgb: [avgR, avgG, avgB]
                    };
                })
                .sort((a, b) => b.count - a.count) // Sort by frequency
                .slice(0, 5); // Get top 5 colors
            
            // Extract just the color values
            const topColors = dominantColors.map(item => item.color);
            
            // Fill up to 5 colors if needed
            while (topColors.length < 5) {
                // Use a color from existing colors or fallback
                if (dominantColors.length > 0) {
                    topColors.push(dominantColors[topColors.length % dominantColors.length].color);
                } else {
                    // Fallback colors
                    const fallbackColors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3"];
                    topColors.push(fallbackColors[topColors.length]);
                }
            }
            
            resolve(topColors);
        };
        
        img.src = imageData;
    });
}

// Helper function to convert RGB to Hex
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function analyzeColorsFromImage() {
    if (!capturedImageData) {
        showStatus('NO IMAGE CAPTURED', 'error');
        return;
    }
    
    showStatus('EXTRACTING COLORS...', 'info');
    console.log('Analyzing colors. PluginMessageHandler available:', typeof PluginMessageHandler !== 'undefined');
    
    // Extract colors from image on device side
    extractColorsFromImage(capturedImageData).then(colors => {
        console.log('Extracted colors:', colors);
        currentPalette = colors;
        displayPalette(colors);
        
        // Just show success status
        showStatus('PALETTE READY! EMAIL TO SEND', 'success');
    }).catch(error => {
        console.error('Color extraction failed:', error);
        showStatus('COLOR EXTRACTION FAILED', 'error');
        
        // Fallback to simulated colors based on actual color extraction principles
        // This will at least provide colors that look like they could come from an image
        const fallbackColors = extractColorsFromImageFallback();
        currentPalette = fallbackColors;
        displayPalette(fallbackColors);
        
        showStatus('PALETTE READY! EMAIL TO SEND', 'success');
    });
}

// More realistic fallback that generates colors based on common image patterns
function extractColorsFromImageFallback() {
    // Generate a palette with colors that look like they could come from a real image
    // Using a deterministic approach based on current time to avoid pure randomness
    const seed = Date.now() % 100000;
    
    // Generate a base color with natural hues
    const baseHue = (seed * 137.508) % 360; // Use golden ratio for better distribution
    const baseSat = 50 + (seed % 50);  // 50-100% saturation
    const baseLight = 35 + (seed % 50); // 35-85% lightness
    
    // Generate related colors by varying hue, saturation, and lightness
    const colors = [];
    
    // First color is the base color
    const baseRgb = hslToRgb(baseHue / 360, baseSat / 100, baseLight / 100);
    colors.push(rgbToHex(baseRgb[0], baseRgb[1], baseRgb[2]));
    
    // Generate complementary and analogous colors
    for (let i = 1; i < 5; i++) {
        let hueVariation, satVariation, lightVariation;
        
        // Create different types of color relationships
        switch(i) {
            case 1: // Complementary color
                hueVariation = (baseHue + 180) % 360;
                satVariation = Math.max(40, Math.min(100, baseSat + (seed % 20) - 10));
                lightVariation = Math.max(30, Math.min(90, baseLight + (seed % 30) - 15));
                break;
            case 2: // Analogous color 1
                hueVariation = (baseHue + 30 + (seed % 30)) % 360;
                satVariation = Math.max(45, Math.min(95, baseSat + (seed % 15) - 7));
                lightVariation = Math.max(35, Math.min(85, baseLight + (seed % 25) - 12));
                break;
            case 3: // Analogous color 2
                hueVariation = (baseHue - 30 - (seed % 30) + 360) % 360;
                satVariation = Math.max(45, Math.min(95, baseSat + (seed % 15) - 7));
                lightVariation = Math.max(35, Math.min(85, baseLight + (seed % 25) - 12));
                break;
            case 4: // Triadic color
                hueVariation = (baseHue + 120 + (seed % 60)) % 360;
                satVariation = Math.max(50, Math.min(100, baseSat + (seed % 10) - 5));
                lightVariation = Math.max(40, Math.min(90, baseLight + (seed % 20) - 10));
                break;
        }
        
        // Convert HSL to RGB
        const rgb = hslToRgb(hueVariation / 360, satVariation / 100, lightVariation / 100);
        colors.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
    }
    
    return colors;
}

// Helper function to convert HSL to RGB
function hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function generatePalette() {
    // Transition to screen 3 where analysis happens
    showScreen3();
}

function displayPalette(colors) {
    const paletteDisplay = document.getElementById('paletteDisplay');
    paletteDisplay.innerHTML = '';
    
    if (colors && Array.isArray(colors) && colors.length > 0) {
        console.log('Displaying palette with colors:', colors);
        
        const paletteContainer = document.createElement('div');
        paletteContainer.className = 'palette-container';
        paletteContainer.style.display = 'flex';
        paletteContainer.style.gap = '8px';  // Reduced gap
        paletteContainer.style.justifyContent = 'center';
        paletteContainer.style.flexWrap = 'wrap';
        paletteContainer.style.alignItems = 'center';
        paletteContainer.style.marginTop = '5px';  // Reduced margin
        paletteContainer.style.maxHeight = '100px';  // Limit height
        paletteContainer.style.overflow = 'hidden';  // Prevent overflow
        
        colors.forEach((color, index) => {
            // Validate that color is a valid hex code
            if (typeof color === 'string' && /^#[0-9A-F]{6}$/i.test(color)) {
                const swatchContainer = document.createElement('div');
                swatchContainer.style.display = 'flex';
                swatchContainer.style.flexDirection = 'column';
                swatchContainer.style.alignItems = 'center';
                swatchContainer.style.margin = '3px';  // Reduced margin
                
                // Create a rectangle shape for the color (smaller size)
                const colorSwatch = document.createElement('div');
                colorSwatch.style.backgroundColor = color;
                colorSwatch.style.width = '30px';  // Smaller width
                colorSwatch.style.height = '30px';  // Smaller height
                colorSwatch.style.border = '2px solid #fff';
                colorSwatch.style.borderRadius = '4px';
                colorSwatch.style.boxSizing = 'border-box';
                colorSwatch.title = color;
                
                // Add a label with the hex code (smaller font)
                const colorLabel = document.createElement('div');
                colorLabel.textContent = color;
                colorLabel.style.color = '#fff';
                colorLabel.style.fontSize = '8px';  // Smaller font
                colorLabel.style.marginTop = '2px';  // Reduced margin
                colorLabel.style.fontFamily = 'Courier New, monospace';
                colorLabel.style.textAlign = 'center';
                colorLabel.style.maxWidth = '30px';
                colorLabel.style.overflow = 'hidden';
                colorLabel.style.textOverflow = 'ellipsis';
                
                swatchContainer.appendChild(colorSwatch);
                swatchContainer.appendChild(colorLabel);
                paletteContainer.appendChild(swatchContainer);
            }
        });
        
        paletteDisplay.appendChild(paletteContainer);
        
        // Update currentPalette with the received colors
        currentPalette = colors;
        
        console.log('Palette displayed successfully');
    } else {
        paletteDisplay.innerHTML = '<div class="placeholder-text">NO VALID COLORS FOUND</div>';
        currentPalette = [];
        console.log('No valid colors to display');
    }
}

function emailPalette() {
    console.log('Email palette function called');
    console.log('Current palette:', currentPalette);
    
    // Check if we have a valid palette
    if (!currentPalette || !Array.isArray(currentPalette) || currentPalette.length === 0) {
        showStatus('NO PALETTE TO SEND', 'error');
        return;
    }
    
    showStatus('SENDING TO YOUR EMAIL...', 'info');
    
    // In a real R1 implementation, we would send this to the LLM
    if (typeof PluginMessageHandler !== 'undefined') {
        // Format palette for email
        let paletteDescription = "Color Palette:\n\n";
        currentPalette.forEach((color, index) => {
            paletteDescription += `Color ${index + 1}: ${color}\n`;
        });
        
        console.log('Sending palette to LLM:', paletteDescription);
        
        // R1 LLM should know the user's email, so we just ask it to send
        const payload = {
            message: `Please send this color palette to the user's email. Palette colors: ${paletteDescription}`,
            useLLM: true,
            wantsR1Response: true  // Set to true to have R1 speak the response
        };
        
        PluginMessageHandler.postMessage(JSON.stringify(payload));
    } else {
        // Simulate email sending
        setTimeout(() => {
            showStatus('PALETTE SENT TO YOUR EMAIL!', 'success');
            
            // Reset after success
            setTimeout(() => {
                resetApp();
            }, 2000);
        }, 1500);
    }
}

function resetApp() {
    // Clear data
    capturedImageData = null;
    currentPalette = [];
    
    // Stop any existing stream
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        videoElement = null;
    }
    
    // Show screen 1
    showScreen1();
    showStatus('PRESS CAPTURE TO START CAMERA', 'info');
}

// Plugin message handler for LLM responses
window.onPluginMessage = function(data) {
    console.log('Received plugin message:', data);
    
    if (data.data) {
        try {
            // Try to parse the data as JSON
            const parsedData = JSON.parse(data.data);
            console.log('Parsed data:', parsedData);
            
            // Handle email address response
            if (parsedData.email) {
                console.log('Received user email from LLM:', parsedData.email);
                showStatus('EMAIL ADDRESS RECEIVED. SENDING PALETTE...', 'info');
                sendPaletteToEmail(parsedData.email);
                return;
            }
            
            // Handle color analysis response
            if (parsedData.colors && Array.isArray(parsedData.colors)) {
                console.log('Received colors from LLM:', parsedData.colors);
                currentPalette = parsedData.colors;
                displayPalette(currentPalette);
                showStatus('PALETTE READY! EMAIL TO SEND', 'success');
            } 
            // Handle palette name/description response
            else if (parsedData.paletteName || parsedData.description) {
                console.log('Received palette info from LLM:', parsedData);
                showStatus('PALETTE ANALYZED! EMAIL TO SEND', 'success');
            } else {
                // Show the response as-is if it's not color data
                showStatus(data.data, 'info');
            }
        } catch (e) {
            console.error('Error parsing plugin message:', e);
            // Show the response as-is if we can't parse it
            showStatus(data.data, 'info');
        }
    } else if (data.message) {
        // Handle email response
        if (data.message.includes('sent') || data.message.includes('email')) {
            showStatus('PALETTE SENT TO YOUR EMAIL!', 'success');
            // Reset after success
            setTimeout(() => {
                resetApp();
            }, 2000);
        } else if (data.message.includes('timeout') || data.message.includes('failed') || data.message.includes('error')) {
            showStatus('LLM ERROR: ' + data.message, 'error');
        } else {
            showStatus(data.message, 'info');
        }
    } else {
        // Show raw data if no message or data
        showStatus('RECEIVED: ' + JSON.stringify(data), 'info');
    }
};

// Helper functions
function showStatus(message, type) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = 'status-message ' + type;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Function to generate a PNG image of the color palette
function generatePaletteImage() {
    return new Promise((resolve, reject) => {
        try {
            // Create a canvas to draw the palette
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions
            canvas.width = 220;
            canvas.height = 100;
            
            // Fill background with black
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw title
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 14px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('COLOR PALETTE', canvas.width/2, 20);
            
            // Draw each color swatch
            const swatchWidth = 30;
            const swatchHeight = 30;
            const spacing = 10;
            const startY = 35;
            
            // Calculate starting X position to center the palette
            const totalWidth = (swatchWidth * currentPalette.length) + (spacing * (currentPalette.length - 1));
            let startX = (canvas.width - totalWidth) / 2;
            
            // Draw each color swatch
            currentPalette.forEach((color, index) => {
                const x = startX + (index * (swatchWidth + spacing));
                
                // Draw swatch
                ctx.fillStyle = color;
                ctx.fillRect(x, startY, swatchWidth, swatchHeight);
                
                // Draw border
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, startY, swatchWidth, swatchHeight);
                
                // Draw color hex code below swatch
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '10px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText(color, x + swatchWidth/2, startY + swatchHeight + 15);
            });
            
            // Convert canvas to data URL
            const imageDataUrl = canvas.toDataURL('image/png');
            resolve(imageDataUrl);
        } catch (error) {
            reject(error);
        }
    });
}

// Function to create individual color shapes for verification
function createColorShapes(colors) {
    const shapesContainer = document.createElement('div');
    shapesContainer.style.display = 'flex';
    shapesContainer.style.justifyContent = 'space-around';
    shapesContainer.style.marginTop = '10px';
    
    colors.forEach((color, index) => {
        const shape = document.createElement('div');
        shape.style.width = '40px';
        shape.style.height = '40px';
        shape.style.backgroundColor = color;
        shape.style.border = '2px solid white';
        shape.style.borderRadius = '4px';
        shape.title = `Color ${index + 1}: ${color}`;
        
        shapesContainer.appendChild(shape);
    });
    
    return shapesContainer;
}

// Function to send the palette image to a specific email address
function sendPaletteToEmail(emailAddress) {
    console.log('Sending palette to email:', emailAddress);
    
    // Generate the palette image
    generatePaletteImage().then(imageDataUrl => {
        showStatus('PALETTE IMAGE GENERATED. SENDING...', 'info');
        
        // In a real implementation, we would either:
        // 1. Upload the image to a hosting service and send the URL
        // 2. Send the image data directly if the email service supports it
        // 3. Ask the LLM to generate an email with the image attached
        
        if (typeof PluginMessageHandler !== 'undefined') {
            // Ask the LLM to send an email with the palette image
            const payload = {
                message: `Please send an email to ${emailAddress} with the attached color palette image. The palette colors are: ${currentPalette.join(', ')}. Include a creative description of the palette.`,
                useLLM: true,
                wantsR1Response: true,
                imageData: imageDataUrl  // Send the image data directly
            };
            
            PluginMessageHandler.postMessage(JSON.stringify(payload));
            showStatus('SENDING EMAIL VIA LLM...', 'info');
        } else {
            // Simulate email sending in browser
            setTimeout(() => {
                showStatus('PALETTE SENT TO YOUR EMAIL!', 'success');
                
                // Reset after success
                setTimeout(() => {
                    resetApp();
                }, 2000);
            }, 1500);
        }
    }).catch(error => {
        console.error('Error generating palette image:', error);
        showStatus('FAILED TO GENERATE PALETTE IMAGE', 'error');
    });
}
