"use strict";
const fetchContent = require("./lib/fetchContent");
const aws = require("./services/aws");

module.exports.main = async event => {
  const uuid = event.pathParameters.uuid;
  const result = await fetchContent.getArticle(uuid);
  const articleContent = result.bodyXML;
  const sentimentResult = await aws.getSentiment(articleContent);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: sentimentResult,
        input: event
      },
      null,
      2
    )
  };
};
