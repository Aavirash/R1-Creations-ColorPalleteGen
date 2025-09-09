// Script to create a PNG icon for the Mood Palette Generator
function createPaletteIcon() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 64;
    canvas.height = 64;
    
    // Fill background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw color palette circles
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F1C'];
    const radius = 12;
    
    // Position circles in a flower pattern
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = colors[4]; // Orange center
    ctx.fill();
    
    // Draw surrounding circles
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI / 2) - (Math.PI / 4);
        const x = centerX + Math.cos(angle) * (radius + 5);
        const y = centerY + Math.sin(angle) * (radius + 5);
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = colors[i];
        ctx.fill();
    }
    
    // Return the data URL
    return canvas.toDataURL('image/png');
}

// If running in a browser, create and download the icon
if (typeof window !== 'undefined') {
    const iconData = createPaletteIcon();
    const link = document.createElement('a');
    link.download = 'icon.png';
    link.href = iconData;
    link.textContent = 'Download Icon';
    
    // Add to page if there's a container
    const container = document.getElementById('icon-container');
    if (container) {
        container.appendChild(link);
    }
    
    // Also save to localStorage for later use
    try {
        localStorage.setItem('moodPaletteIcon', iconData);
        console.log('Icon saved to localStorage');
    } catch (e) {
        console.log('Could not save icon to localStorage');
    }
}