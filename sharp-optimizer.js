const path = require('path');
const fs = require('fs');
const mainImagesDir = path.join(
  __dirname,
  'dist',
  'static',
  'images',
  'main'
);
const sharp = require('sharp');

function writeImage(err, buffer) {

  if (err) {
    console.log('Error in optimization', err);
    return;
  }

  console.log(buffer);

  // fs.writeFile(imagePath, buffer, function(e) {
  //   if (e) {
  //     console.log('Error in writing ' + imagePath + ' to disk:', e);
  //     return;
  //   }

  //   console.log('optimized file ' + imagePath + ' written to disk');
  // });
}

fs.readdir(mainImagesDir, (err, images) => {
  if (err) {
    console.log('Error reading main images.');
  } else {
    images.forEach(function(image) {
      const imagePath = path.join(mainImagesDir, image);
      sharp(imagePath).webp().toBuffer(writeImage)
      sharp(imagePath)
        .resize({ width: 500 })
        .jpeg({ quality: 90 })
        .toBuffer(writeImage);
    });
  }
});

const promises = [];
