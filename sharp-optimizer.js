const path = require('path');
const fs = require('fs');
const imagesDir = path.join(__dirname, 'dist', 'static', 'images');
const mainImagesDir = path.join(imagesDir, 'main');
const notesImagesDir = path.join(imagesDir, 'notes');
const sharp = require('sharp');


function writeImage(buffer, info) {
  const imageName = path.basename(info.imagePath);
  const imageDir = path.dirname(info.imagePath);
  const outName = imageName.replace(/\.\S+/, `.${info.format}`);
  const outPath = `${imageDir}/${outName}`;

  fs.writeFile(outPath, buffer, function(err) {
    if (err) {
      console.log('Error in writing ' + outPath + ' to disk:', err);
      return;
    }

    console.log(`${outPath} written to disk`);
  });
}


function getAllFilePaths(dirPath, arrayOfFiles = []) {
  files = fs.readdirSync(dirPath)

  files.forEach(file => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFilePaths(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
}


[mainImagesDir, notesImagesDir].forEach(folder => {
  const imagePaths = getAllFilePaths(folder);

  imagePaths.forEach(imagePath => {
    sharp(imagePath).webp().toBuffer((err, buffer, info) => {
      if (err) {
        console.log('Error in optimization', err);
        return;
      }
      writeImage(buffer, { imagePath, ...info });
    });
  });
});

const promises = [];
