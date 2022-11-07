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

function writeImage(err, buffer, info) {

  if (err) {
    console.log('Error in optimization', err);
    return;
  }

  const outName = info.imageName.replace(/\.\S+/, `.${info.format}`);
  const outDir = info.imageDir;
  const outPath = `${outDir}/${outName}`;

  fs.writeFile(outPath, buffer, function(e) {
    if (e) {
      console.log('Error in writing ' + outPath + ' to disk:', e);
      return;
    }

    console.log(`${outPath} written to disk`);
  });
}

fs.readdir(mainImagesDir, (err, images) => {
  if (err) {
    console.log('Error reading main images.');
  } else {
    images.forEach(function(image) {
      const imagePath = path.join(mainImagesDir, image);
      const imageName = path.basename(imagePath);
      const imageDir = path.dirname(imagePath);

      sharp(imagePath).webp().toBuffer((err, buffer, info) => {
        writeImage(err, buffer, { imageDir, imageName, ...info });
      });
    });
  }
});

const promises = [];
