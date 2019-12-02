const AWS = require("aws-sdk");
const truncate = require("truncate-utf8-bytes");
const comprehend = new AWS.Comprehend();

async function getSentiment({ articleContent, title, standfirst }) {
  console.log("aws", articleContent, title, standfirst);
  const result = await Promise.all([
    comprehend
      .detectSentiment({
        LanguageCode: "en",
        Text: title
      })
      .promise(),
    comprehend
      .detectSentiment({
        LanguageCode: "en",
        Text: standfirst
      })
      .promise(),
    comprehend
      .detectSentiment({
        LanguageCode: "en",
        Text: truncate(articleContent, 4975)
      })
      .promise(),
    Promise.all(
      articleContent.split(".").map(async sentence => {
        const result = await comprehend
          .detectSentiment({
            LanguageCode: "en",
            Text: sentence
          })
          .promise();
        return { ...result, sentence };
      })
    )
  ]);
  return {
    title: { ...result[0] },
    standfirst: { ...result[1] },
    fullArticle: { ...result[2] },
    sentences: result[3]
  };
}

module.exports = { getSentiment };
