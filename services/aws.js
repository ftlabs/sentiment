const AWS = require("aws-sdk");
const truncate = require("truncate-utf8-bytes");
const comprehend = new AWS.Comprehend();

async function getSentiments(contentArray) {
  const sentiment = await Promise.all(
    contentArray.map(file =>
      comprehend
        .detectSentiment({
          LanguageCode: "en",
          Text: truncate(file.byline, 4975)
        })
        .promise()
    )
  );

  return sentiment;
}

module.exports = { getSentiments };
