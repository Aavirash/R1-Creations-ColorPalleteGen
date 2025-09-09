const fs = require('fs');

// Create a simple PNG icon as a base64 data URL
// This is a very simple 16x16 PNG with a color palette theme
const pngData = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACtSURBVDhPpZLBCoMwDIbT9y97Dh9EFNQxhA1B2dTB3lSE0kIr1tFbG5P8X5PQVpHSOcf3fWmapmkURZHP83zfV9d1yrLMtm1T1/Xruq6qqgrDMKi6rkVVVXIYhqzrWtd1Lcsy7/su8zxLURSCWZaJcRzleR6Z51maplFVVYphGGRZFsmyTBRFEoahDMMg0zTJtm0yjqOM4yjzPMu2bbJtm8zzLNu2yTzPMs+z7Num67qkLEtp21aappG2bWVZFlmWRZZlkWVZZFkWWZZF13VJ171/kiRvI47jN03T9AdJkurHcfwB0nFfAAAAAABJRU5ErkJggg==';

// Write the PNG file
const iconPath = 'plugin-demo/mood-palette/images/icon.png';
fs.writeFileSync(iconPath, Buffer.from(pngData, 'base64'));

console.log(`PNG icon created at ${iconPath}`);