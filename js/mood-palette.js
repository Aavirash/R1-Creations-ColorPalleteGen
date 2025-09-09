// Mood Palette Generator - Single Screen Workflow
let capturedImageData = null;
let currentPalette = [];
let videoStream = null;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show initial screen
    showScreen1();
    
    showStatus('READY TO CAPTURE IMAGE', 'info');
}

function showScreen1() {
    const appContent = document.getElementById('appContent');
    appContent.innerHTML = `
        <div class="screen-content">
            <div class="preview-section">
                <div id="previewContainer" class="preview-container">
                    <div class="placeholder-text">CAMERA PREVIEW</div>
                </div>
            </div>
            
            <div class="controls-section">
                <button id="captureBtn" class="action-button">CAPTURE IMAGE</button>
            </div>
        </div>
    `;
    
    // Set up event listener
    document.getElementById('captureBtn').addEventListener('click', startCamera);
}

function showScreen2() {
    const appContent = document.getElementById('appContent');
    appContent.innerHTML = `
        <div class="screen-content">
            <div class="preview-section">
                <div id="thumbnailContainer" class="thumbnail-container">
                    <div class="placeholder-text">IMG</div>
                </div>
                <div class="preview-container" style="height: 165px;">
                    <div class="placeholder-text">IMAGE CAPTURED</div>
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
                    <div class="placeholder-text">GENERATING...</div>
                </div>
                
                <div class="email-section">
                    <input type="email" id="emailInput" class="email-input" placeholder="YOUR@EMAIL.COM">
                    <button id="emailBtn" class="action-button">EMAIL ME</button>
                </div>
            </div>
        </div>
    `;
    
    // Display the palette
    displayPalette(currentPalette);
    
    // Set up event listeners
    document.getElementById('emailBtn').addEventListener('click', emailPalette);
    
    // Email input validation
    document.getElementById('emailInput').addEventListener('input', function() {
        const email = this.value;
        document.getElementById('emailBtn').disabled = !isValidEmail(email);
    });
}

function startCamera() {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '<div class="placeholder-text">LOADING CAMERA...</div>';
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(function(stream) {
                videoStream = stream;
                
                // Create video element
                const video = document.createElement('video');
                video.autoplay = true;
                video.playsInline = true;
                video.srcObject = stream;
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'cover';
                
                previewContainer.innerHTML = '';
                previewContainer.appendChild(video);
                
                showStatus('CAMERA READY! TAP TO CAPTURE', 'info');
                
                // Add click to capture
                video.addEventListener('click', function() {
                    captureImage(video);
                });
            })
            .catch(function(error) {
                console.error('Camera access error:', error);
                showStatus('CAMERA ERROR', 'error');
                previewContainer.innerHTML = '<div class="placeholder-text">CAMERA UNAVAILABLE</div>';
            });
    } else {
        showStatus('CAMERA NOT SUPPORTED', 'error');
        previewContainer.innerHTML = '<div class="placeholder-text">NO CAMERA</div>';
    }
}

function captureImage(video) {
    // Create canvas to capture image
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Store the image data
    capturedImageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Stop camera
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    
    // Show screen 2
    showScreen2();
    showStatus('IMAGE CAPTURED! GENERATE PALETTE', 'success');
}

function generatePalette() {
    if (!capturedImageData) {
        showStatus('NO IMAGE CAPTURED', 'error');
        return;
    }
    
    showStatus('ANALYZING COLORS...', 'info');
    
    // Simulate AI processing
    setTimeout(() => {
        // Generate a beautiful color palette
        currentPalette = generateBeautifulPalette();
        
        // Show screen 3
        showScreen3();
        showStatus('PALETTE READY! ENTER EMAIL', 'success');
    }, 2000);
}

function generateBeautifulPalette() {
    // Predefined beautiful color palettes
    const palettes = [
        ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"], // RGB Classic
        ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF33A1"], // Vibrant
        ["#FFD700", "#FF4500", "#32CD32", "#1E90FF", "#8A2BE2"], // Gold to Purple
        ["#FF1493", "#00FF7F", "#FFD700", "#FF6347", "#4169E1"], // Pink to Blue
        ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF"]  // Rainbow
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
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.title = color;
            paletteContainer.appendChild(swatch);
        });
        
        paletteDisplay.appendChild(paletteContainer);
    } else {
        paletteDisplay.innerHTML = '<div class="placeholder-text">NO PALETTE</div>';
    }
}

function emailPalette() {
    const email = document.getElementById('emailInput').value;
    
    if (!isValidEmail(email)) {
        showStatus('ENTER VALID EMAIL', 'error');
        return;
    }
    
    if (currentPalette.length === 0) {
        showStatus('NO PALETTE TO SEND', 'error');
        return;
    }
    
    showStatus(`SENDING TO ${email.toUpperCase()}...`, 'info');
    
    // Simulate email sending
    setTimeout(() => {
        showStatus(`PALETTE SENT!`, 'success');
        
        // Reset after success
        setTimeout(() => {
            resetApp();
        }, 2000);
    }, 1500);
}

function resetApp() {
    // Clear data
    capturedImageData = null;
    currentPalette = [];
    
    // Show screen 1
    showScreen1();
    showStatus('READY TO CAPTURE IMAGE', 'info');
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