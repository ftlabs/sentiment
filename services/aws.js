const AWS = require("aws-sdk");
var comprehend = new AWS.Comprehend();


function getSentiments(contentArray) {
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
}