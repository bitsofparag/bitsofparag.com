import fs from 'fs/promises';
import path from 'path';
import { load } from 'cheerio';
import glob from 'glob';
import util from 'util';

const globPromise = util.promisify(glob);

async function addPermalinks() {
  console.log('Adding permalinks to microblog files');

  try {
    const files = await globPromise('./dist/**/*.html', {
      ignore: './dist/index.html',
    });
    const indexPath = './dist/microblog/index.html';

    const fileNames = files.map((file) => {
      let baseName = path.basename(file, path.extname(file));
      let dirName = path.dirname(file).replace('./dist', '');
      return { baseName, dirName };
    });

    const data = await fs.readFile(indexPath, 'utf8');
    const $ = load(data);

    fileNames.forEach(({ baseName, dirName }) => {
      const container = $(`#${baseName}`).parent();
      const metadata = container.find('.metadata');
      const oldP = metadata.find('p');
      const newP = $('<p></p>');
      const span = $('<span class="bullet-separator">&#8226</span>'); // Or $('<span>•</span>'
      const a = $('<a></a>')
        .attr('href', `${dirName}/${baseName}.html`)
        .text('Permalink');

      newP.append(oldP.html());
      newP.append(span);
      newP.append(a);

      oldP.replaceWith(newP);
    });

    await fs.writeFile(indexPath, $.html());
    console.log('HTML file successfully updated');
  } catch (err) {
    throw err;
  }
}

addPermalinks();
