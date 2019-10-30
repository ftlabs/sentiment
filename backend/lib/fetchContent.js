const fetch = require("node-fetch");

const CAPI_KEY = process.env.CAPI_KEY;

const CAPI_PATH = "https://api.ft.com/content/";

const CAPI_CONCURRENCE = process.env.hasOwnProperty("CAPI_CONCURRENCE")
  ? process.env.CAPI_CONCURRENCE
  : 2;

function getArticle(uuid) {
  const path = `${CAPI_PATH}${uuid}`;
  const url = `${path}?apiKey=${CAPI_KEY}`;

  return fetch(url)
    .then(res => {
      if (res.status === 400) {
        throw `ERROR: fetch article for uuid=${uuid} status code=${res.status}`;
      }
      return res;
    })
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text);
      return json;
    })
    .catch(err => {
      throw err;
    });
}

module.exports = {
  getArticle
};
