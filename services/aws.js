const AWS = require("aws-sdk");
const truncate = require("truncate-utf8-bytes");
const comprehend = new AWS.Comprehend();

async function getSentiment(contentArray) {
  const result = await Promise.all(
    contentArray.split(".").map(async sentence => {
      const result = await comprehend
        .detectSentiment({
          LanguageCode: "en",
          Text: sentence
        })
        .promise();
      return { ...result, sentence };
    })
  );
  return result;
}

module.exports = { getSentiment };
