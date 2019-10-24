"use strict";
const fetchContent = require("./lib/fetchContent");
const extractText = require("./lib/extractText");

const aws = require("./services/aws");
const ibm = require("./services/ibm");

module.exports.main = async event => {
  const uuid = event.pathParameters.uuid;
  const result = await fetchContent.getArticle(uuid);
  const articleContent = extractText(result.bodyXML);
  const title = result.title;
  const standfirst = result.standfirst;
  const sentimentResult = await aws.getSentiment({
    articleContent,
    title,
    standfirst
  });
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
