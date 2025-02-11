import { rmSync, readdirSync, lstatSync } from 'fs';
import { join } from 'path';

function cleanMisc() {
  const miscFiles = ['.*~'];
  miscFiles.forEach(pattern => {
    const filesToDelete = findFilesMatchingPattern(pattern);
    filesToDelete.forEach(file => {
      try {
        rmSync(file, { force: true, recursive: true });
        console.log(`Deleted: ${file}`);
      } catch (err) {
        console.error(`Error deleting ${file}: ${err}`);
      }
    });
  });
}

function cleanDist() {
  const distPath = join(__dirname, '..', 'dist');
  const filesToKeep = ['manifest.json', 'favicon.ico', 'rss.xml', 'robots.txt'];

  const filesInDist = getFilesInDist(distPath);

  filesInDist.forEach(file => {
    const fullPath = join(distPath, file);
    if (!filesToKeep.includes(file)) {
      try {
        rmSync(fullPath, { force: true, recursive: true });
        console.log(`Deleted: ${fullPath}`);
      } catch (err) {
        console.error(`Error deleting ${fullPath}: ${err}`);
      }
    }
  });
}

function findFilesMatchingPattern(pattern) {
  const files = [];
  const currentDir = process.cwd();
  
  function traverse(dir) {
    const entries = readdirSync(dir);
    entries.forEach(entry => {
      const fullPath = join(dir, entry);
      const stats = lstatSync(fullPath);
      if (stats.isDirectory()) {
        traverse(fullPath);
      } else if (entry.match(new RegExp(pattern))) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(currentDir);
  return files;
}

function getFilesInDist(distPath) {
    const files = [];
    try {
        const entries = readdirSync(distPath);
        entries.forEach(entry => {
            files.push(entry);
        });
    } catch (error) {
        // Handle errors, like dist not existing.
        console.warn(`Could not read dist directory: ${error.message}`);
    }
    return files;
}


if (process.argv.includes('--misc')) {
  cleanMisc();
}

if (process.argv.includes('--dist')) {
  cleanDist();
}