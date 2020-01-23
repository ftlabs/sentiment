const fs = require("fs");

function getUuids(name) {
  return JSON.parse(fs.readFileSync(`./${name}/uuids.json`));
}

function getUrl(uuid) {
  return `http://localhost:3000/ftlabs-sentiment/${uuid}`;
}
