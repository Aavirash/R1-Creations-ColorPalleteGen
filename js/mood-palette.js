// Mood Palette Generator - Single Screen Workflow with R1 PTT Support
let capturedImageData = null;
let currentPalette = [];
let videoStream = null;
let videoElement = null;

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
        if (videoElement) {
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
            </div>
            
            <div class="controls-section">
                <button id="captureBtn" class="action-button">START CAMERA</button>
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
                <div class="preview-container" style="height: 120px;">
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
                
                showStatus('CAMERA ON! PRESS R1 PTT TO CAPTURE', 'info');
            })
            .catch(function(error) {
                console.error('Camera access error:', error);
                showStatus('CAMERA ERROR', 'error');
                previewContainer.innerHTML = '<div class="placeholder-text">CAMERA UNAVAILABLE</div>';
                previewContainer.classList.add('clickable');
            });
    } else {
        showStatus('CAMERA NOT SUPPORTED', 'error');
        previewContainer.innerHTML = '<div class="placeholder-text">NO CAMERA</div>';
        previewContainer.classList.add('clickable');
    }
}

function captureImageFromPTT() {
    if (!videoElement) return;
    
    // Create canvas to capture image
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    
    // Draw video frame to canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Store the image data
    capturedImageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Stop camera
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        videoElement = null;
    }
    
    // Show screen 2
    showScreen2();
    showStatus('IMAGE CAPTURED! GENERATE PALETTE', 'success');
}

// Function to upload image to catbox.moe
async function uploadToCatbox(imageData) {
    try {
        // Convert data URL to Blob
        const blob = dataURLToBlob(imageData);
        
        // Create FormData
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', blob, 'image.jpg');
        
        // Upload to catbox
        const response = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const url = await response.text();
            return url;
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Catbox upload error:', error);
        return null;
    }
}

// Helper function to convert data URL to Blob
function dataURLToBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
}

function analyzeColorsFromImage() {
    if (!capturedImageData) {
        showStatus('NO IMAGE CAPTURED', 'error');
        return;
    }
    
    showStatus('ANALYZING IMAGE COLORS...', 'info');
    
    // In a real R1 implementation, we would send this to the LLM
    if (typeof PluginMessageHandler !== 'undefined') {
        // Use catbox immediately for R1 testing since the LLM seems to expect a URL
        fallbackToCatboxAnalysis();
    } else {
        // Simulate analysis for browser testing with more realistic colors
        setTimeout(() => {
            // Generate colors based on actual image analysis simulation
            currentPalette = generateRealisticPalette();
            displayPalette(currentPalette);
            showStatus('PALETTE READY! EMAIL TO SEND', 'success');
        }, 3000);
    }
}

function generatePalette() {
    // This now just transitions to screen 3 where analysis happens
    showScreen3();
}

function generateRealisticPalette() {
    // More realistic color palettes based on common image colors
    const palettes = [
        ["#8B4513", "#D2691E", "#CD853F", "#DEB887", "#F5DEB3"], // Browns/Tans
        ["#006400", "#228B22", "#32CD32", "#90EE90", "#98FB98"], // Greens
        ["#8B0000", "#DC143C", "#FF6347", "#FF7F50", "#FFA07A"], // Reds/Oranges
        ["#00008B", "#0000CD", "#4169E1", "#87CEEB", "#B0E0E6"], // Blues
        ["#4B0082", "#8A2BE2", "#9370DB", "#BA55D3", "#DA70D6"]  // Purples
    ];
    
    // Return a random palette
    return palettes[Math.floor(Math.random() * palettes.length)];
}

function displayPalette(colors) {
    const paletteDisplay = document.getElementById('paletteDisplay');
    paletteDisplay.innerHTML = '';
    
    if (colors && colors.length > 0) {
        const paletteContainer = document.createElement('div');
        paletteContainer.className = 'palette-container';
        
        colors.forEach(color => {
            const swatchContainer = document.createElement('div');
            swatchContainer.className = 'swatch-container';
            
            const colorSwatch = document.createElement('div');
            colorSwatch.className = 'color-swatch';
            colorSwatch.style.backgroundColor = color;
            colorSwatch.title = color;
            
            const colorLabel = document.createElement('div');
            colorLabel.className = 'color-label';
            colorLabel.textContent = color;
            colorLabel.style.color = '#fff';
            colorLabel.style.fontSize = '10px';
            colorLabel.style.marginTop = '4px';
            
            swatchContainer.appendChild(colorSwatch);
            swatchContainer.appendChild(colorLabel);
            paletteContainer.appendChild(swatchContainer);
        });
        
        paletteDisplay.appendChild(paletteContainer);
        
        // Update currentPalette with the received colors
        currentPalette = colors;
    } else {
        paletteDisplay.innerHTML = '<div class="placeholder-text">NO COLORS FOUND</div>';
        currentPalette = [];
    }
}

function emailPalette() {
    if (currentPalette.length === 0) {
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
        
        // Also generate a visual representation of the palette
        generatePaletteImage().then(imageDataUrl => {
            // R1 LLM should know the user's email, so we just ask it to send
            const payload = {
                message: `Please send this color palette to the user's email. Palette colors: ${paletteDescription}`,
                useLLM: true,
                wantsR1Response: true,
                paletteImage: imageDataUrl // Send the visual palette as well
            };
            
            PluginMessageHandler.postMessage(JSON.stringify(payload));
        }).catch(error => {
            console.error('Error generating palette image:', error);
            // Fallback to text-only if image generation fails
            const payload = {
                message: `Please send this color palette to the user's email. Palette colors: ${paletteDescription}`,
                useLLM: true,
                wantsR1Response: true
            };
            
            PluginMessageHandler.postMessage(JSON.stringify(payload));
        });
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
            const parsedData = JSON.parse(data.data);
            
            // Handle color analysis response
            if (parsedData.colors) {
                currentPalette = parsedData.colors;
                displayPalette(currentPalette);
                showStatus('PALETTE READY! EMAIL TO SEND', 'success');
            }
        } catch (e) {
            console.error('Error parsing plugin message:', e);
            showStatus('RECEIVED AI RESPONSE', 'info');
        }
    } else if (data.message) {
        showStatus(data.message, 'info');
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

// Fallback function to use catbox for image hosting and analysis
async function fallbackToCatboxAnalysis() {
    showStatus('UPLOADING IMAGE FOR ANALYSIS...', 'info');
    
    try {
        // Upload image to catbox
        const imageUrl = await uploadToCatbox(capturedImageData);
        
        if (imageUrl) {
            showStatus('ANALYZING COLORS...', 'info');
            // Send image URL to LLM for analysis
            const payload = {
                message: `Analyze the colors in this image at ${imageUrl} and provide exactly 5 dominant colors in hex format. Response format: {'colors': ['#hex1', '#hex2', '#hex3', '#hex4', '#hex5']}`,
                useLLM: true
            };
            
            PluginMessageHandler.postMessage(JSON.stringify(payload));
        } else {
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error('Fallback analysis error:', error);
        showStatus('ANALYSIS FAILED', 'error');
    }
}

// Function to generate a PNG image of the color palette
function generatePaletteImage() {
    return new Promise((resolve, reject) => {
        try {
            // Create a canvas to draw the palette
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to fit R1 screen
            canvas.width = 220; // Slightly smaller than 240px width to account for borders
            canvas.height = 80; // Reduced height
            
            // Fill background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw each color swatch
            const swatchWidth = 30;
            const swatchHeight = 30;
            const spacing = 8;
            const startY = 15;
            
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
                ctx.lineWidth = 1;
                ctx.strokeRect(x, startY, swatchWidth, swatchHeight);
                
                // Draw color hex code below swatch
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '8px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText(color, x + swatchWidth/2, startY + swatchHeight + 12);
            });
            
            // Convert canvas to data URL
            const imageDataUrl = canvas.toDataURL('image/png');
            resolve(imageDataUrl);
        } catch (error) {
            reject(error);
        }
    });
}
