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

// Function to upload image to catbox.moe
async function uploadToCatbox(imageData) {
    try {
        showStatus('UPLOADING TO CATBOX...', 'info');
        console.log('Starting image upload to catbox');
        
        // Validate image data
        if (!imageData) {
            throw new Error('No image data provided');
        }
        
        // Convert data URL to Blob
        const blob = dataURLToBlob(imageData);
        console.log('Blob created, size:', blob.size, 'type:', blob.type);
        
        // Check if blob is valid
        if (blob.size === 0) {
            throw new Error('Image blob is empty');
        }
        
        // Create FormData
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', blob, 'image.jpg');
        
        // Try to upload to catbox with timeout and error handling
        console.log('Sending request to catbox.moe');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('Catbox response status:', response.status);
        
        if (response.ok) {
            const responseText = await response.text();
            const url = responseText.trim();
            console.log('Image uploaded successfully to:', url);
            
            // Validate that we got a URL
            if (url && url.length > 0 && (url.startsWith('http://') || url.startsWith('https://'))) {
                showStatus('IMAGE UPLOADED SUCCESSFULLY', 'success');
                return url;
            } else {
                throw new Error('Invalid URL received from catbox: ' + responseText);
            }
        } else {
            const errorText = await response.text();
            throw new Error('Upload failed with status: ' + response.status + ' ' + response.statusText + ' - ' + errorText);
        }
    } catch (error) {
        console.error('Catbox upload error:', error);
        if (error.name === 'AbortError') {
            showStatus('UPLOAD TIMED OUT - CHECK NETWORK', 'error');
        } else if (error.message.includes('fetch')) {
            showStatus('NETWORK ERROR - CATBOX UNAVAILABLE', 'error');
        } else {
            showStatus('UPLOAD FAILED: ' + error.message, 'error');
        }
        throw error;
    }
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

function analyzeColorsFromImage() {
    if (!capturedImageData) {
        showStatus('NO IMAGE CAPTURED', 'error');
        return;
    }
    
    showStatus('ANALYZING COLORS...', 'info');
    
    // In a real R1 implementation, we would send this to the LLM
    if (typeof PluginMessageHandler !== 'undefined') {
        // Send image data directly to LLM for analysis
        sendImageToLLM();
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
    
    if (colors && Array.isArray(colors) && colors.length > 0) {
        console.log('Displaying palette with colors:', colors);
        
        const paletteContainer = document.createElement('div');
        paletteContainer.className = 'palette-container';
        paletteContainer.style.display = 'flex';
        paletteContainer.style.gap = '10px';
        paletteContainer.style.justifyContent = 'center';
        paletteContainer.style.flexWrap = 'wrap';
        paletteContainer.style.alignItems = 'center';
        paletteContainer.style.marginTop = '10px';
        
        colors.forEach((color, index) => {
            // Validate that color is a valid hex code
            if (typeof color === 'string' && /^#[0-9A-F]{6}$/i.test(color)) {
                const swatchContainer = document.createElement('div');
                swatchContainer.style.display = 'flex';
                swatchContainer.style.flexDirection = 'column';
                swatchContainer.style.alignItems = 'center';
                swatchContainer.style.margin = '5px';
                
                // Create a rectangle shape for the color
                const colorSwatch = document.createElement('div');
                colorSwatch.style.backgroundColor = color;
                colorSwatch.style.width = '40px';
                colorSwatch.style.height = '40px';
                colorSwatch.style.border = '2px solid #fff';
                colorSwatch.style.borderRadius = '4px';
                colorSwatch.style.boxSizing = 'border-box';
                colorSwatch.title = color;
                
                // Add a label with the hex code
                const colorLabel = document.createElement('div');
                colorLabel.textContent = color;
                colorLabel.style.color = '#fff';
                colorLabel.style.fontSize = '10px';
                colorLabel.style.marginTop = '4px';
                colorLabel.style.fontFamily = 'Courier New, monospace';
                colorLabel.style.textAlign = 'center';
                
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
    showStatus('PROCESSING RESPONSE...', 'info');
    
    if (data.data) {
        try {
            // Try to parse the data as JSON
            const parsedData = JSON.parse(data.data);
            console.log('Parsed data:', parsedData);
            
            // Handle color analysis response
            if (parsedData.colors && Array.isArray(parsedData.colors)) {
                console.log('Received colors from LLM:', parsedData.colors);
                currentPalette = parsedData.colors;
                displayPalette(currentPalette);
                showStatus('PALETTE READY! EMAIL TO SEND', 'success');
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
        } 
        // Handle case where LLM requests image URL (fallback)
        else if (data.message.includes('image') && data.message.includes('url')) {
            showStatus('LLM REQUESTS IMAGE URL - UPLOADING...', 'info');
            // Use catbox as fallback only when LLM explicitly requests it
            fallbackToCatboxAnalysis();
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

// Function to send image directly to LLM for analysis
function sendImageToLLM() {
    showStatus('SENDING IMAGE TO LLM...', 'info');
    
    try {
        // Send image data directly to LLM for analysis
        const payload = {
            message: `Please analyze the colors in this image and provide exactly 5 dominant colors in hex format. Response format: {"colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"]}.`,
            useLLM: true,
            wantsR1Response: false,  // Set to false to get JSON response
            imageData: capturedImageData  // Send image data directly
        };
        
        console.log('Sending image to LLM');
        PluginMessageHandler.postMessage(JSON.stringify(payload));
    } catch (error) {
        console.error('Error sending image to LLM:', error);
        showStatus('LLM COMMUNICATION FAILED', 'error');
    }
}

// Fallback function to use catbox for image hosting and analysis (only when LLM requests it)
async function fallbackToCatboxAnalysis() {
    showStatus('UPLOADING IMAGE TO CATBOX...', 'info');
    
    try {
        // Check if we have image data
        if (!capturedImageData) {
            throw new Error('No captured image data available');
        }
        
        console.log('Captured image data length:', capturedImageData.length);
        
        // Validate image data
        if (capturedImageData.length < 100) {
            throw new Error('Captured image data is too small');
        }
        
        // Upload image to catbox
        const imageUrl = await uploadToCatbox(capturedImageData);
        
        if (imageUrl && imageUrl.length > 0) {
            showStatus('IMAGE UPLOADED! REQUESTING ANALYSIS...', 'info');
            console.log('Image uploaded to:', imageUrl);
            
            // Validate URL before sending to LLM
            if (!imageUrl.startsWith('http')) {
                throw new Error('Invalid image URL received');
            }
            
            // Send image URL to LLM for analysis
            const payload = {
                message: `Please analyze the colors in this image and provide exactly 5 dominant colors in hex format. Response format: {"colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"]}. Image URL: ${imageUrl}`,
                useLLM: true,
                wantsR1Response: false  // Set to false to get JSON response
            };
            
            console.log('Sending to LLM:', payload.message);
            showStatus('REQUESTING COLOR ANALYSIS...', 'info');
            PluginMessageHandler.postMessage(JSON.stringify(payload));
        } else {
            throw new Error('Failed to get image URL from catbox');
        }
    } catch (error) {
        console.error('Catbox analysis error:', error);
        showStatus('ANALYSIS FAILED: ' + error.message, 'error');
    }
}
