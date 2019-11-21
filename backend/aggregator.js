"use strict";
const fetchArticles = require("./lib/fetchArticles");

module.exports.main = async event => {
  try {
    const result = await fetchArticles.search("brexit");
    return {
      statusCode: 200,
      body: JSON.stringify(result),
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
