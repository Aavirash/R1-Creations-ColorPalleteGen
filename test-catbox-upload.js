// Test catbox upload functionality
console.log('Testing catbox upload functionality...');

// Create a simple test image as a blob
const canvas = document.createElement('canvas');
canvas.width = 100;
canvas.height = 100;
const ctx = canvas.getContext('2d');

// Draw a simple pattern
ctx.fillStyle = '#ff0000';
ctx.fillRect(0, 0, 50, 50);
ctx.fillStyle = '#00ff00';
ctx.fillRect(50, 0, 50, 50);
ctx.fillStyle = '#0000ff';
ctx.fillRect(0, 50, 50, 50);
ctx.fillStyle = '#ffff00';
ctx.fillRect(50, 50, 50, 50);

canvas.toBlob(function(blob) {
    console.log('Blob created, size:', blob.size, 'type:', blob.type);
    
    // Create FormData
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', blob, 'test-image.jpg');
    
    // Try to upload to catbox
    console.log('Uploading to catbox.moe...');
    fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.text();
    })
    .then(text => {
        console.log('Upload successful! URL:', text.trim());
    })
    .catch(error => {
        console.error('Upload failed:', error);
    });
}, 'image/jpeg', 0.8);