// @ts-check
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const { argv, env } = process;
/**
 * @type {any}
 */
const { SERIAL_PATH, REPLACE_REGEXP, TEST_REGEXP } = env;

switch (argv[2]) {
  case 'rename':
    renameSeries();
    break;
  default:
    console.info('Default case');
}

/**
 * Rename all series
 */
function renameSeries() {
  const isTest = TEST_REGEXP === 'yes';
  const reg = new RegExp(REPLACE_REGEXP);
  console.info('Start rename script with regexp:', reg, 'TEST_REGEXP:', TEST_REGEXP);
  const dirPath = path.normalize(SERIAL_PATH);
  const dir = fs.readdirSync(dirPath);
  let count = 0;
  let errors = 0;
  for (let i = 0; dir[i]; i++, count++) {
    const file = dir[i];
    const newFile = file.replace(reg, '');
    if (isTest) {
      console.log(newFile);
    } else {
      try {
        fs.renameSync(path.resolve(dirPath, file), path.resolve(dirPath, newFile));
      } catch (err) {
        console.error(err);
        errors++;
      }
    }
  }
  if (!isTest) {
    console.info('Renamed', count, 'files with', errors, 'errors');
  } else {
    console.info('Tested', count, 'files with', errors, 'errors');
  }
}
