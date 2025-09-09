// Mood Palette Generator - Simplified Workflow
let capturedImageData = null;
let currentPalette = [];
let videoStream = null;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show initial screen
    showScreen(1);
    
    // Set up event listeners
    document.getElementById('captureBtn').addEventListener('click', startCamera);
    document.getElementById('generateBtn').addEventListener('click', generatePalette);
    document.getElementById('recaptureBtn').addEventListener('click', recaptureImage);
    document.getElementById('emailBtn').addEventListener('click', emailPalette);
    
    // Email input validation
    document.getElementById('emailInput').addEventListener('input', function() {
        const email = this.value;
        document.getElementById('emailBtn').disabled = !isValidEmail(email);
    });
    
    showStatus('Ready to capture image', 'info');
}

function showScreen(screenNumber) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show requested screen
    document.getElementById(`screen${screenNumber}`).classList.add('active');
}

function startCamera() {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '<div class="placeholder-text">Loading camera...</div>';
    
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
                
                // Auto-capture after 3 seconds
                showStatus('Camera ready! Tap preview to capture', 'info');
                
                // Add click to capture
                video.addEventListener('click', function() {
                    captureImage(video);
                });
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
    
    // Show thumbnail
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const img = document.createElement('img');
    img.src = capturedImageData;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '8px';
    thumbnailContainer.innerHTML = '';
    thumbnailContainer.appendChild(img);
    
    // Show screen 2
    showScreen(2);
    showStatus('Image captured! Generate your palette', 'success');
}

function recaptureImage() {
    // Stop any existing stream
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    
    // Show screen 1
    showScreen(1);
    showStatus('Ready to capture image', 'info');
}

function generatePalette() {
    if (!capturedImageData) {
        showStatus('No image captured', 'error');
        return;
    }
    
    showStatus('Analyzing image colors...', 'info');
    
    // Simulate AI processing
    setTimeout(() => {
        // Generate a beautiful color palette
        currentPalette = generateBeautifulPalette();
        
        // Display the palette
        displayPalette(currentPalette);
        
        // Show screen 3
        showScreen(3);
        showStatus('Palette generated! Enter email to receive', 'success');
    }, 2000);
}

function generateBeautifulPalette() {
    // Predefined beautiful color palettes
    const palettes = [
        ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"], // Warm & Cool
        ["#6C5CE7", "#A29BFE", "#FD79A8", "#FDCB6E", "#E17055"], // Vibrant
        ["#00B894", "#00CEC9", "#0984E3", "#6C5CE7", "#A29BFE"], // Ocean
        ["#E84393", "#FD79A8", "#FDCB6E", "#E17055", "#6C5CE7"], // Sunset
        ["#00B894", "#55EFC4", "#81ECEC", "#74B9FF", "#A29BFE"]  // Fresh
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
        paletteDisplay.innerHTML = '<div class="placeholder-text">No palette generated</div>';
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
    
    // Simulate email sending
    setTimeout(() => {
        showStatus(`Palette sent to ${email}!`, 'success');
        
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
    
    // Reset UI
    document.getElementById('emailInput').value = '';
    document.getElementById('emailBtn').disabled = true;
    
    // Show screen 1
    showScreen(1);
    showStatus('Ready to capture image', 'info');
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