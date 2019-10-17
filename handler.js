"use strict";
const fetchContent = require("./lib/fetchContent");

module.exports.main = async event => {
  const result = await fetchContent.getArticle(
    "5200d5fe-efda-11e9-bfa4-b25f11f42901"
  );
  const articleContent = result.bodyXML;
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: articleContent,
        input: event
      },
      null,
      2
    )
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
