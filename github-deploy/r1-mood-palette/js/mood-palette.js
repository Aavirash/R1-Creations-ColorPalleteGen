// Mood Palette Generator for R1
let currentPalette = [];
let videoStream = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const captureBtn = document.getElementById('captureBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const generateBtn = document.getElementById('generateBtn');
    const emailBtn = document.getElementById('emailBtn');
    const saveBtn = document.getElementById('saveBtn');
    const viewFavoritesBtn = document.getElementById('viewFavoritesBtn');
    const emailInput = document.getElementById('emailInput');
    
    // Set up event listeners
    captureBtn.addEventListener('click', captureImage);
    analyzeBtn.addEventListener('click', analyzeColors);
    generateBtn.addEventListener('click', generatePalette);
    emailBtn.addEventListener('click', emailPalette);
    saveBtn.addEventListener('click', saveToFavorites);
    viewFavoritesBtn.addEventListener('click', viewFavorites);
    
    // Initialize camera
    initializeCamera();
    
    // Update email button state based on input
    emailInput.addEventListener('input', function() {
        emailBtn.disabled = !isValidEmail(emailInput.value);
    });
    
    showStatus('Ready to capture image', 'info');
}

function initializeCamera() {
    const videoElement = document.getElementById('videoElement');
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                videoStream = stream;
                videoElement.srcObject = stream;
                videoElement.play();
            })
            .catch(function(error) {
                console.error('Camera access error:', error);
                showStatus('Camera access denied or unavailable', 'error');
            });
    } else {
        showStatus('Camera not supported in this browser', 'error');
    }
}

function captureImage() {
    const videoElement = document.getElementById('videoElement');
    const canvasElement = document.getElementById('canvasElement');
    const ctx = canvasElement.getContext('2d');
    
    // Set canvas dimensions to match video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    
    // Draw current video frame to canvas
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    // Enable analysis button
    document.getElementById('analyzeBtn').disabled = false;
    
    showStatus('Image captured! Click "Analyze Colors" to continue.', 'success');
}

function analyzeColors() {
    const canvasElement = document.getElementById('canvasElement');
    const ctx = canvasElement.getContext('2d');
    
    // Get image data from canvas
    const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const data = imageData.data;
    
    // Simple color extraction (sample every 10th pixel for performance)
    const colorMap = {};
    for (let i = 0; i < data.length; i += 4 * 10) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Convert to hex
        const hex = rgbToHex(r, g, b);
        
        // Count occurrences
        colorMap[hex] = (colorMap[hex] || 0) + 1;
    }
    
    // Sort by frequency and get top colors
    const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(entry => entry[0]);
    
    showStatus(`Found ${sortedColors.length} dominant colors. Click "Generate Palette" to continue.`, 'info');
    document.getElementById('generateBtn').disabled = false;
}

function generatePalette() {
    // In a real implementation, this would use the LLM to analyze colors
    // For now, we'll simulate the AI analysis
    
    // Generate a random palette (in real implementation, this would be based on analysis)
    currentPalette = generateRandomPalette(5);
    
    displayPalette(currentPalette);
    
    // Enable email and save buttons
    document.getElementById('emailBtn').disabled = false;
    document.getElementById('saveBtn').disabled = false;
    
    showStatus('Palette generated! You can now email or save it.', 'success');
}

function emailPalette() {
    const email = document.getElementById('emailInput').value;
    
    if (!isValidEmail(email)) {
        showStatus('Please enter a valid email address', 'error');
        return;
    }
    
    // In a real implementation, this would send the palette to the email
    // For now, we'll just show a success message
    
    // Format palette for email
    let emailContent = "Your Mood Palette:\n\n";
    currentPalette.forEach((color, index) => {
        emailContent += `Color ${index + 1}: ${color}\n`;
    });
    
    // Send message to LLM to handle email (simulated)
    if (typeof PluginMessageHandler !== 'undefined') {
        const payload = {
            message: `Please send this color palette to ${email}: ${emailContent}`,
            useLLM: true,
            wantsR1Response: true
        };
        
        PluginMessageHandler.postMessage(JSON.stringify(payload));
        showStatus(`Palette sent to ${email}!`, 'success');
    } else {
        showStatus(`In a real implementation, this palette would be sent to ${email}`, 'info');
    }
}

function saveToFavorites() {
    if (currentPalette.length === 0) {
        showStatus('No palette to save', 'error');
        return;
    }
    
    try {
        // Save to secure storage
        if (typeof window.creationStorage !== 'undefined') {
            // Get existing favorites
            window.creationStorage.secure.getItem('favoritePalettes')
                .then(existingData => {
                    let favorites = [];
                    if (existingData) {
                        favorites = JSON.parse(atob(existingData));
                    }
                    
                    // Add new palette
                    favorites.push({
                        id: Date.now(),
                        palette: currentPalette,
                        timestamp: new Date().toISOString()
                    });
                    
                    // Save back to storage
                    return window.creationStorage.secure.setItem(
                        'favoritePalettes', 
                        btoa(JSON.stringify(favorites))
                    );
                })
                .then(() => {
                    showStatus('Palette saved to favorites!', 'success');
                })
                .catch(error => {
                    console.error('Error saving to secure storage:', error);
                    showStatus('Error saving to favorites', 'error');
                });
        } else {
            showStatus('Secure storage not available', 'error');
        }
    } catch (error) {
        console.error('Error saving palette:', error);
        showStatus('Error saving palette', 'error');
    }
}

function viewFavorites() {
    if (typeof window.creationStorage !== 'undefined') {
        window.creationStorage.secure.getItem('favoritePalettes')
            .then(data => {
                if (data) {
                    const favorites = JSON.parse(atob(data));
                    showStatus(`You have ${favorites.length} saved palettes.`, 'info');
                    // In a full implementation, we would display these palettes
                } else {
                    showStatus('No saved palettes found', 'info');
                }
            })
            .catch(error => {
                console.error('Error retrieving favorites:', error);
                showStatus('Error retrieving favorites', 'error');
            });
    } else {
        showStatus('Secure storage not available', 'error');
    }
}

// Helper functions
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function generateRandomPalette(count) {
    const palette = [];
    for (let i = 0; i < count; i++) {
        // Generate random hex color
        const hex = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
        palette.push(hex);
    }
    return palette;
}

function displayPalette(colors) {
    const paletteDisplay = document.getElementById('paletteDisplay');
    paletteDisplay.innerHTML = '';
    
    colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.title = color;
        paletteDisplay.appendChild(swatch);
    });
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = 'status-message ' + type;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Plugin message handler for LLM responses
window.onPluginMessage = function(data) {
    console.log('Received plugin message:', data);
    
    if (data.message) {
        showStatus(data.message, 'info');
    }
};