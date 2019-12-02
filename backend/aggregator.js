"use strict";
const request = require("request-promise");
const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000
});

const fetchArticles = require("./lib/fetchArticles");

const SENTIMENT_URL = process.env.SENTIMENT_URL;

module.exports.main = async event => {
  try {
    const searchTerm = event.queryStringParameters.searchTerm;

    const rawSapiResult = await fetchArticles.search(searchTerm);
    const uuids = rawSapiResult.sapiObj.results[0].results.map(obj => obj.id);
    console.log(SENTIMENT_URL);

    const result = await Promise.all(
      uuids.map(uuid =>
        limiter.schedule(async () => {
          const result = await request(createParams(uuid));
          if (result !== "not article") {
            return JSON.parse(result);
          }
          return result;
        })
      )
    );
    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  } catch (err) {
    console.log(err);
    console.log("GETTING IN ERROR");
    console.error(JSON.stringify(err));
    return {
      statusCode: 401,
      body: "Something went wrong",
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  }
};

function createParams(uuid) {
  return {
    method: "GET",
    url: SENTIMENT_URL + uuid + "?provider=meaningCloud,aws",
    headers: { "content-type": "application/json" }
  };
}
