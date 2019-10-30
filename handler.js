"use strict";
const fetchContent = require("./lib/fetchContent");
const extractText = require("./lib/extractText");

const aws = require("./services/aws");
const ibm = require("./services/ibm");
const meaningCloud = require("./services/meaningCloud");

module.exports.main = async event => {
  try {
    let finalProviderArray = [];
    const potentialProviders = { aws, ibm, meaningCloud };
    const validProviders = ["aws", "ibm", "meaningCloud"];
    if (event.queryStringParameters.providers) {
      const providerArray = event.queryStringParameters.providers.split(",");
      let valid = true;
      providerArray.forEach(provider => {
        if (!validProviders.includes(provider)) {
          valid = false;
        }
      });
      if (!valid) {
        throw new Error(
          `Provider does not exist. Valid providers are ${validProviders.join(
            " "
          )}`
        );
      }
      finalProviderArray = providerArray.map(provider => ({
        name: provider,
        functionality: potentialProviders[provider]
      }));
    } else {
      finalProviderArray = [
        { name: "aws", functionality: aws },
        { name: "ibm", functionality: ibm },
        { name: "meaningCloud", functionality: meaningCloud }
      ];
    }
    const uuid = event.pathParameters.uuid;
    const result = await fetchContent.getArticle(uuid);
    const articleContent = extractText(result.bodyXML);
    const title = result.title;
    const standfirst = result.standfirst;

    const sentimentResult = await Promise.all(
      finalProviderArray.map(async provider => {
        const result = await provider.functionality.getSentiment({
          articleContent,
          title,
          standfirst
        });
        return { name: provider.name, result };
      })
    );
    const finalResult = {};
    sentimentResult.forEach(finalObj => {
      finalResult[finalObj.name] = finalObj.result;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(finalResult)
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 401,
      body: "Something went wrong"
    };
  }
};
