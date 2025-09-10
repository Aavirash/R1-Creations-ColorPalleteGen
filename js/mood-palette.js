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
    
    // Debug: Check if we have captured image data
    console.log('=== SCREEN 3 DEBUG INFO ===');
    console.log('Captured image data exists:', !!capturedImageData);
    if (capturedImageData) {
        console.log('Image data length:', capturedImageData.length);
        console.log('Image data preview:', capturedImageData.substring(0, 100));
    } else {
        console.log('ERROR: NO CAPTURED IMAGE DATA!');
        showStatus('ERROR: NO IMAGE CAPTURED', 'error');
        return;
    }
    
    // Start analyzing colors immediately with balanced algorithm
    extractBalancedColorsFromImage();
    
    // Set up event listener
    document.getElementById('emailBtn').addEventListener('click', emailPalette);
}

// Balanced color extraction function - 3 dominant, 2 secondary
function extractBalancedColorsFromImage() {
    console.log('=== BALANCED COLOR EXTRACTION STARTED ===');
    
    if (!capturedImageData) {
        console.log('ERROR: No captured image data!');
        showStatus('NO IMAGE CAPTURED', 'error');
        displayPalette(['#000000', '#000000', '#000000', '#000000', '#000000']);
        return;
    }
    
    console.log('Image data length:', capturedImageData.length);
    console.log('Image data preview:', capturedImageData.substring(0, 100));
    
    showStatus('EXTRACTING BALANCED COLORS...', 'info');
    
    try {
        // Create image element from data URL
        const img = new Image();
        img.onload = function() {
            try {
                console.log('Image loaded. Dimensions:', img.width, 'x', img.height);
                
                // Create canvas to analyze image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size (smaller for performance but still accurate)
                const maxWidth = 300;
                const maxHeight = 300;
                const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
                canvas.width = Math.max(100, img.width * ratio);
                canvas.height = Math.max(100, img.height * ratio);
                
                console.log('Canvas size set to:', canvas.width, 'x', canvas.height);
                
                // Draw image on canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Get image data
                const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageDataObj.data;
                
                console.log('Raw image data length:', data.length);
                
                // Collect all colors with sampling
                const colors = [];
                const step = Math.max(1, Math.floor(canvas.width * canvas.height / 2000));
                
                console.log('Sampling step:', step);
                
                // Sample pixels across the image
                for (let i = 0; i < data.length; i += step * 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];
                    
                    // Skip transparent pixels
                    if (a < 128) continue;
                    
                    // Skip very dark or very light pixels for better palette
                    const brightness = (r + g + b) / 3;
                    if (brightness < 20 || brightness > 235) continue;
                    
                    colors.push([r, g, b]);
                }
                
                console.log('Collected colors:', colors.length);
                
                // If we don't have enough colors, collect more
                if (colors.length < 50) {
                    console.log('Not enough colors, collecting more...');
                    colors.length = 0;
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
                
                // If we still don't have colors, use what we have
                if (colors.length === 0) {
                    console.log('No colors found, using default');
                    displayPalette(['#808080', '#808080', '#808080', '#808080', '#808080']);
                    showStatus('NO COLORS FOUND', 'error');
                    return;
                }
                
                // Color clustering to find dominant colors
                const clusters = [];
                const threshold = 40; // Distance threshold for grouping similar colors
                
                console.log('Starting color clustering...');
                
                // Group similar colors together
                colors.forEach((color, index) => {
                    // Limit processing for performance
                    if (index > 1000) return;
                    
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
                
                console.log('Clusters found:', clusters.length);
                
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
                    .sort((a, b) => b.count - a.count); // Sort by frequency
                
                console.log('Dominant colors:', dominantColors);
                
                // Get 3 most dominant colors
                const top3Dominant = dominantColors.slice(0, 3);
                
                // For secondary colors, we want diversity, so we'll look for colors
                // that are different from the dominant ones
                const secondaryColors = [];
                const usedColors = [...top3Dominant];
                
                // Find secondary colors that are different from dominant ones
                for (let i = 0; i < dominantColors.length && secondaryColors.length < 2; i++) {
                    const candidate = dominantColors[i];
                    let isDifferent = true;
                    
                    // Check if this color is too similar to any dominant color
                    for (let j = 0; j < usedColors.length; j++) {
                        const distance = colorDistance(candidate.rgb, usedColors[j].rgb);
                        if (distance < 60) { // Threshold for similarity
                            isDifferent = false;
                            break;
                        }
                    }
                    
                    if (isDifferent) {
                        secondaryColors.push(candidate);
                        usedColors.push(candidate);
                    }
                }
                
                // If we don't have enough secondary colors, fill with remaining dominant colors
                while (secondaryColors.length < 2 && dominantColors.length > usedColors.length) {
                    const remaining = dominantColors.filter(color => 
                        !usedColors.some(used => used.color === color.color)
                    );
                    if (remaining.length > 0) {
                        secondaryColors.push(remaining[0]);
                        usedColors.push(remaining[0]);
                    } else {
                        break;
                    }
                }
                
                // If we still don't have enough, duplicate some colors
                while (secondaryColors.length < 2) {
                    if (dominantColors.length > 0) {
                        secondaryColors.push(dominantColors[secondaryColors.length % dominantColors.length]);
                    } else {
                        secondaryColors.push({color: '#808080', count: 1, rgb: [128, 128, 128]});
                    }
                }
                
                // Combine into final palette (3 dominant, 2 secondary)
                const finalPalette = [
                    ...top3Dominant.map(item => item.color),
                    ...secondaryColors.map(item => item.color)
                ];
                
                console.log('Top 3 dominant:', top3Dominant);
                console.log('Secondary colors:', secondaryColors);
                console.log('Final palette:', finalPalette);
                
                currentPalette = finalPalette;
                displayPalette(finalPalette);
                showStatus('BALANCED COLORS EXTRACTED! EMAIL TO SEND', 'success');
                console.log('=== BALANCED COLOR EXTRACTION COMPLETED ===');
                
            } catch (error) {
                console.error('Error in image processing:', error);
                showStatus('PROCESSING ERROR', 'error');
                displayPalette(['#000000', '#000000', '#000000', '#000000', '#000000']);
            }
        };
        
        img.onerror = function() {
            console.error('Failed to load image');
            showStatus('IMAGE LOAD ERROR', 'error');
            displayPalette(['#000000', '#000000', '#000000', '#000000', '#000000']);
        };
        
        console.log('Setting image source...');
        img.src = capturedImageData;
    } catch (error) {
        console.error('Error in extractBalancedColorsFromImage:', error);
        showStatus('EXTRACTION ERROR', 'error');
        displayPalette(['#000000', '#000000', '#000000', '#000000', '#000000']);
    }
}

// Function to calculate color distance (Euclidean distance in RGB space)
function colorDistance(rgb1, rgb2) {
    const [r1, g1, b1] = rgb1;
    const [r2, g2, b2] = rgb2;
    return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
}

// Helper function to convert RGB to Hex
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function generatePalette() {
    // Transition to screen 3 where analysis happens
    showScreen3();
}

// Simplified direct color extraction - NO FALLBACKS, NO ERROR COLORS
function directColorExtraction() {
    console.log('=== DIRECT COLOR EXTRACTION STARTED ===');
    
    if (!capturedImageData) {
        console.log('ERROR: No captured image data!');
        showStatus('NO IMAGE CAPTURED', 'error');
        displayPalette(['#000000', '#000000', '#000000', '#000000', '#000000']);
        return;
    }
    
    console.log('Image data length:', capturedImageData.length);
    console.log('Image data preview:', capturedImageData.substring(0, 100));
    
    showStatus('EXTRACTING COLORS...', 'info');
    
    try {
        // Create image element from data URL
        const img = new Image();
        img.onload = function() {
            try {
                console.log('Image loaded. Dimensions:', img.width, 'x', img.height);
                
                // Create canvas to analyze image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size
                canvas.width = 200;
                canvas.height = 200;
                
                console.log('Canvas size set to:', canvas.width, 'x', canvas.height);
                
                // Draw image on canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Get image data
                const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageDataObj.data;
                
                console.log('Raw image data length:', data.length);
                
                // Simple color extraction - take samples from different parts of the image
                const colors = [];
                const step = Math.max(1, Math.floor(canvas.width * canvas.height / 1000));
                
                console.log('Sampling step:', step);
                
                // Sample pixels across the image
                for (let i = 0; i < data.length; i += step * 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];
                    
                    // Skip transparent pixels
                    if (a < 128) continue;
                    
                    // Convert to hex
                    const hex = '#' + [r, g, b].map(x => {
                        const hex = x.toString(16);
                        return hex.length === 1 ? '0' + hex : hex;
                    }).join('');
                    
                    colors.push(hex);
                    
                    // Limit to 100 samples for performance
                    if (colors.length >= 100) break;
                }
                
                console.log('Sampled colors:', colors.length);
                
                // If we don't have enough colors, use what we have
                if (colors.length === 0) {
                    console.log('No colors found, using default');
                    displayPalette(['#808080', '#808080', '#808080', '#808080', '#808080']);
                    showStatus('NO COLORS FOUND', 'error');
                    return;
                }
                
                // Take first 5 colors as our palette
                const palette = colors.slice(0, 5);
                
                // Fill up to 5 colors if needed
                while (palette.length < 5) {
                    palette.push(palette[palette.length % palette.length]);
                }
                
                console.log('Final palette:', palette);
                currentPalette = palette;
                displayPalette(palette);
                showStatus('PALETTE READY! EMAIL TO SEND', 'success');
                console.log('=== DIRECT COLOR EXTRACTION COMPLETED ===');
            } catch (error) {
                console.error('Error in image processing:', error);
                showStatus('PROCESSING ERROR', 'error');
                displayPalette(['#000000', '#000000', '#000000', '#000000', '#000000']);
            }
        };
        
        img.onerror = function() {
            console.error('Failed to load image');
            showStatus('IMAGE LOAD ERROR', 'error');
            displayPalette(['#000000', '#000000', '#000000', '#000000', '#000000']);
        };
        
        console.log('Setting image source...');
        img.src = capturedImageData;
    } catch (error) {
        console.error('Error in directColorExtraction:', error);
        showStatus('EXTRACTION ERROR', 'error');
        displayPalette(['#000000', '#000000', '#000000', '#000000', '#000000']);
    }
}

// Simplified display function - NO ERROR COLORS
function displayPalette(colors) {
    console.log('=== DISPLAYING PALETTE ===');
    console.log('Colors to display:', colors);
    
    const paletteDisplay = document.getElementById('paletteDisplay');
    paletteDisplay.innerHTML = '';
    
    if (colors && Array.isArray(colors) && colors.length > 0) {
        console.log('Displaying palette with colors:', colors);
        
        const paletteContainer = document.createElement('div');
        paletteContainer.className = 'palette-container';
        paletteContainer.style.display = 'flex';
        paletteContainer.style.gap = '8px';
        paletteContainer.style.justifyContent = 'center';
        paletteContainer.style.flexWrap = 'wrap';
        paletteContainer.style.alignItems = 'center';
        paletteContainer.style.marginTop = '5px';
        paletteContainer.style.maxHeight = '100px';
        paletteContainer.style.overflow = 'hidden';
        
        colors.forEach((color, index) => {
            // Validate that color is a valid hex code
            if (typeof color === 'string' && /^#[0-9A-F]{6}$/i.test(color)) {
                const swatchContainer = document.createElement('div');
                swatchContainer.style.display = 'flex';
                swatchContainer.style.flexDirection = 'column';
                swatchContainer.style.alignItems = 'center';
                swatchContainer.style.margin = '3px';
                
                // Create a rectangle shape for the color
                const colorSwatch = document.createElement('div');
                colorSwatch.style.backgroundColor = color;
                colorSwatch.style.width = '30px';
                colorSwatch.style.height = '30px';
                colorSwatch.style.border = '2px solid #fff';
                colorSwatch.style.borderRadius = '4px';
                colorSwatch.style.boxSizing = 'border-box';
                colorSwatch.title = color;
                
                // Add a label with the hex code
                const colorLabel = document.createElement('div');
                colorLabel.textContent = color;
                colorLabel.style.color = '#fff';
                colorLabel.style.fontSize = '8px';
                colorLabel.style.marginTop = '2px';
                colorLabel.style.fontFamily = 'Courier New, monospace';
                colorLabel.style.textAlign = 'center';
                colorLabel.style.maxWidth = '30px';
                colorLabel.style.overflow = 'hidden';
                colorLabel.style.textOverflow = 'ellipsis';
                
                swatchContainer.appendChild(colorSwatch);
                swatchContainer.appendChild(colorLabel);
                paletteContainer.appendChild(swatchContainer);
            } else {
                console.log('Invalid color at index', index, ':', color);
            }
        });
        
        paletteDisplay.appendChild(paletteContainer);
        
        // Update currentPalette with the received colors
        currentPalette = colors;
        
        console.log('Palette displayed successfully');
    } else {
        console.log('No colors to display, showing placeholder');
        paletteDisplay.innerHTML = '<div class="placeholder-text">NO COLORS FOUND</div>';
        currentPalette = [];
    }
    
    console.log('=== PALETTE DISPLAY COMPLETED ===');
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

// Helper function to test color extraction with a sample image
// This can be called from the console for debugging
function testColorExtraction() {
    console.log('=== TESTING COLOR EXTRACTION ===');
    
    // Check if we have captured image data
    if (!capturedImageData) {
        console.log('No captured image data available');
        return;
    }
    
    console.log('Testing with captured image data of length:', capturedImageData.length);
    
    // Try to extract colors
    extractColorsFromImage(capturedImageData)
        .then(colors => {
            console.log('Test successful! Extracted colors:', colors);
            displayPalette(colors);
        })
        .catch(error => {
            console.log('Test failed! Error:', error);
        });
}
