"use strict";
const fetchArticles = require("./lib/fetchArticles");

module.exports.main = async event => {
  try {
    const searchTerm = event.queryStringParameters.searchTerm;

    const rawSapiResult = await fetchArticles.search(searchTerm);
    const uuids = rawSapiResult.sapiObj.results[0].results.map(obj => obj.id);
    return {
      statusCode: 200,
      body: JSON.stringify(uuids),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 401,
      body: "Something went wrong",
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  }
};
