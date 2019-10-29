"use strict";
const fetchContent = require("./lib/fetchContent");
const extractText = require("./lib/extractText");

const aws = require("./services/aws");
const ibm = require("./services/ibm");
const meaningCloud = require("./services/meaningCloud");

module.exports.main = async event => {
  const uuid = event.pathParameters.uuid;
  const result = await fetchContent.getArticle(uuid);
  const articleContent = extractText(result.bodyXML);
  const title = result.title;
  const standfirst = result.standfirst;

  const sentimentResult = await Promise.all([
    ibm.getSentiment({
      articleContent,
      title,
      standfirst
    }),
    aws.getSentiment({
      articleContent,
      title,
      standfirst
    }),
    meaningCloud.getSentiment({
      articleContent,
      title,
      standfirst
    })
  ]);

  const formattedResult = {
    ibm: sentimentResult[0],
    aws: sentimentResult[1],
    meaningCloud: sentimentResult[2]
  };

  return {
    statusCode: 200,
    body: JSON.stringify(formattedResult)
  };
};
