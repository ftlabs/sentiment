const AWS = require("aws-sdk");
const truncate = require("truncate-utf8-bytes");
const comprehend = new AWS.Comprehend();

async function getSentiment(contentArray) {
  const result = await comprehend
    .detectSentiment({
      LanguageCode: "en",
      Text: truncate(file, 4975)
    })
    .promise();

  return result;
}

module.exports = { getSentiment };
