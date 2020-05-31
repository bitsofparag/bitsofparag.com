const path = require("path");
const fs = require("fs");
const breadImagesDir = path.join(__dirname, "dist", "static", "images", "breaking-bread");
const sharp = require("sharp");

const breadImages = [];
fs.readdir(breadImagesDir, (err, images) => {
  if (err) {
    console.log("Error reading bread images.");
  } else {
    images.forEach(function(image) {
      const imagePath = path.join(breadImagesDir, image);
      sharp(imagePath)
        .resize({ width: 500 })
        .jpeg({ quality: 90 })
        .toBuffer(function(err, buffer) {
          fs.writeFile(imagePath, buffer, function(e) {
            console.log('optimized file ' + imagePath + ' written to disk');
          });
        });
    });
  }
});

const promises = [];
