"use strict";
const fetchContent = require("./lib/fetchContent");
const aws = require("./services/aws");

module.exports.main = async event => {
  const result = await fetchContent.getArticle(
    "5200d5fe-efda-11e9-bfa4-b25f11f42901"
  );
  const articleContent = result.bodyXML;
  const sentimentResult = await aws.getSentiments([articleContent]);
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
