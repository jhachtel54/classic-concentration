function countColor(image, targetColor) {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Set canvas dimensions to match the image
  canvas.width = image.width;
  canvas.height = image.height;

  // Draw the image on the canvas
  context.drawImage(image, 0, 0);

  // Get image data
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Initialize a counter for the target color
  let count = 0;

  // Loop through each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Check if the pixel matches the target color
    if (r === targetColor[0] && g === targetColor[1] && b === targetColor[2]) {
      count++;
    }
  }

  // Calculate the percentage of the target color
  const percentage = (count / (data.length / 4)) * 100;

  return percentage;
}

// Example usage:
const image = document.getElementById('myImage');
const targetColor = [255, 0, 0]; // Red color
const percentage = countColor(image, targetColor);

console.log(`The image contains ${percentage.toFixed(2)}% of red.`);