const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '.next');

if (fs.existsSync(dir)) {
  fs.rm(dir, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(`Error while deleting ${dir}:`, err);
    } else {
      console.log(`Deleted ${dir}`);
    }
  });
} else {
  console.log(`${dir} does not exist`);
}
