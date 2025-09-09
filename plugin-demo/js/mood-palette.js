// Mood Palette Generator for R1 - Integrated with SDK
let currentPalette = [];
let capturedImageData = null;
let videoStream = null;

function loadMoodPalettePage(container) {
    container.innerHTML = `
        <div class="mood-palette-container">
            <div class="camera-section">
                <video id="videoElement" autoplay playsinline width="220" height="165" style="display: none;"></video>
                <canvas id="canvasElement" style="display: none;"></canvas>
                <div id="previewContainer" class="preview-container">
                    <div class="placeholder-text">Camera Preview</div>
                </div>
            </div>
            
            <div class="palette-display" id="paletteDisplay">
                <div class="placeholder-text">No palette generated yet</div>
            </div>
            
            <div class="controls-section">
                <button id="captureBtn" class="action-button">Capture Image</button>
                <button id="analyzeBtn" class="action-button" disabled>Analyze Colors</button>
                <button id="generateBtn" class="action-button" disabled>Generate Palette</button>
            </div>
            
            <div class="email-section">
                <input type="email" id="emailInput" class="email-input" placeholder="your@email.com">
                <button id="emailBtn" class="action-button" disabled>Send Palette</button>
            </div>
            
            <div class="status-message" id="statusMessage"></div>
        </div>
    `;
    
    // Store reference to this module
    pageModules.moodPalette = {
        handleMessage: handlePluginMessage
    };
    
    // Initialize the app
    initializeMoodPalette();
}

function initializeMoodPalette() {
    const captureBtn = document.getElementById('captureBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const generateBtn = document.getElementById('generateBtn');
    const emailBtn = document.getElementById('emailBtn');
    const emailInput = document.getElementById('emailInput');
    
    // Set up event listeners
    captureBtn.addEventListener('click', captureImage);
    analyzeBtn.addEventListener('click', analyzeColors);
    generateBtn.addEventListener('click', generatePalette);
    emailBtn.addEventListener('click', emailPalette);
    
    // Update email button state based on input
    emailInput.addEventListener('input', function() {
        emailBtn.disabled = !isValidEmail(emailInput.value) || currentPalette.length === 0;
    });
    
    showStatus('Ready to capture image', 'info');
}

function captureImage() {
    const videoElement = document.getElementById('videoElement');
    const canvasElement = document.getElementById('canvasElement');
    const previewContainer = document.getElementById('previewContainer');
    const ctx = canvasElement.getContext('2d');
    
    // Show camera if not already showing
    if (!videoStream) {
        initializeCamera();
        return;
    }
    
    // Set canvas dimensions to match video
    canvasElement.width = videoElement.videoWidth || 220;
    canvasElement.height = videoElement.videoHeight || 165;
    
    // Draw current video frame to canvas
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    // Store the image data for analysis
    capturedImageData = canvasElement.toDataURL('image/jpeg', 0.8);
    
    // Display preview
    const img = document.createElement('img');
    img.src = capturedImageData;
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '4px';
    previewContainer.innerHTML = '';
    previewContainer.appendChild(img);
    
    // Enable analysis button
    document.getElementById('analyzeBtn').disabled = false;
    
    // Stop the camera stream
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    videoElement.style.display = 'none';
    
    showStatus('Image captured! Click "Analyze Colors" to continue.', 'success');
}

function initializeCamera() {
    const videoElement = document.getElementById('videoElement');
    const previewContainer = document.getElementById('previewContainer');
    
    // Clear preview
    previewContainer.innerHTML = '<div class="placeholder-text">Loading camera...</div>';
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function(stream) {
                videoStream = stream;
                videoElement.srcObject = stream;
                videoElement.style.display = 'block';
                previewContainer.innerHTML = '';
                previewContainer.appendChild(videoElement);
                showStatus('Camera ready! Click capture when ready.', 'info');
            })
            .catch(function(error) {
                console.error('Camera access error:', error);
                showStatus('Camera access denied or unavailable', 'error');
                previewContainer.innerHTML = '<div class="placeholder-text">Camera unavailable</div>';
            });
    } else {
        showStatus('Camera not supported in this browser', 'error');
        previewContainer.innerHTML = '<div class="placeholder-text">Camera not supported</div>';
    }
}

function analyzeColors() {
    if (!capturedImageData) {
        showStatus('No image captured', 'error');
        return;
    }
    
    showStatus('Analyzing colors with AI...', 'info');
    document.getElementById('analyzeBtn').disabled = true;
    
    // In a real R1 implementation, we would send this to the LLM
    // For now, we'll simulate the analysis
    if (typeof PluginMessageHandler !== 'undefined') {
        // Real implementation with R1 LLM
        const payload = {
            message: "Analyze the colors in this image and provide a JSON response with the 5 most dominant colors in hex format. Response format: {'colors': ['#hex1', '#hex2', '#hex3', '#hex4', '#hex5']}",
            useLLM: true
        };
        
        // We would send the image data as well, but for now we'll just send the request
        PluginMessageHandler.postMessage(JSON.stringify(payload));
    } else {
        // Simulate analysis for browser testing
        setTimeout(() => {
            // Simulate receiving color data
            const simulatedColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
            handleColorAnalysis(simulatedColors);
        }, 1500);
    }
}

function handleColorAnalysis(colors) {
    if (colors && colors.length > 0) {
        showStatus(`Found ${colors.length} dominant colors. Click "Generate Palette" to continue.`, 'success');
        document.getElementById('generateBtn').disabled = false;
    } else {
        showStatus('Could not analyze colors. Try another image.', 'error');
        document.getElementById('analyzeBtn').disabled = false;
    }
}

function generatePalette() {
    showStatus('Generating color palette...', 'info');
    document.getElementById('generateBtn').disabled = true;
    
    // In a real implementation, this would use the LLM to create a harmonious palette
    if (typeof PluginMessageHandler !== 'undefined') {
        const payload = {
            message: "Create a harmonious color palette based on these colors. Return JSON with 5 colors that work well together: {'palette': ['#hex1', '#hex2', '#hex3', '#hex4', '#hex5']}",
            useLLM: true
        };
        
        PluginMessageHandler.postMessage(JSON.stringify(payload));
    } else {
        // Simulate palette generation for browser testing
        setTimeout(() => {
            // Simulate receiving palette data
            currentPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
            displayPalette(currentPalette);
            document.getElementById('emailBtn').disabled = !isValidEmail(document.getElementById('emailInput').value);
            showStatus('Palette generated! You can now send it by email.', 'success');
        }, 1000);
    }
}

function displayPalette(colors) {
    const paletteDisplay = document.getElementById('paletteDisplay');
    paletteDisplay.innerHTML = '';
    
    if (colors && colors.length > 0) {
        const paletteContainer = document.createElement('div');
        paletteContainer.className = 'palette-container';
        
        colors.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.title = color;
            
            const label = document.createElement('div');
            label.className = 'color-label';
            label.textContent = color;
            
            const swatchContainer = document.createElement('div');
            swatchContainer.className = 'swatch-container';
            swatchContainer.appendChild(swatch);
            swatchContainer.appendChild(label);
            
            paletteContainer.appendChild(swatchContainer);
        });
        
        paletteDisplay.appendChild(paletteContainer);
    } else {
        paletteDisplay.innerHTML = '<div class="placeholder-text">No palette generated yet</div>';
    }
}

function emailPalette() {
    const email = document.getElementById('emailInput').value;
    
    if (!isValidEmail(email)) {
        showStatus('Please enter a valid email address', 'error');
        return;
    }
    
    if (currentPalette.length === 0) {
        showStatus('No palette to send', 'error');
        return;
    }
    
    showStatus(`Sending palette to ${email}...`, 'info');
    
    // Format palette for email
    let emailContent = "Your Mood Palette:\n\n";
    currentPalette.forEach((color, index) => {
        emailContent += `Color ${index + 1}: ${color}\n`;
    });
    
    // Send message to LLM to handle email
    if (typeof PluginMessageHandler !== 'undefined') {
        const payload = {
            message: `Please send this color palette to ${email}: ${emailContent}`,
            useLLM: true,
            wantsR1Response: true
        };
        
        PluginMessageHandler.postMessage(JSON.stringify(payload));
    } else {
        showStatus(`Palette would be sent to ${email} in R1`, 'info');
    }
}

// Plugin message handler for LLM responses
function handlePluginMessage(data) {
    console.log('Received plugin message:', data);
    
    if (data.data) {
        try {
            const parsedData = JSON.parse(data.data);
            
            // Handle color analysis response
            if (parsedData.colors) {
                handleColorAnalysis(parsedData.colors);
            }
            // Handle palette generation response
            else if (parsedData.palette) {
                currentPalette = parsedData.palette;
                displayPalette(currentPalette);
                document.getElementById('emailBtn').disabled = !isValidEmail(document.getElementById('emailInput').value);
                showStatus('Palette generated! You can now send it by email.', 'success');
            }
        } catch (e) {
            console.error('Error parsing plugin message:', e);
            showStatus('Received response from AI', 'info');
        }
    } else if (data.message) {
        showStatus(data.message, 'info');
    }
}

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