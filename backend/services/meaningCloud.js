const request = require("request-promise");
const URL = process.env.MEANING_CLOUD_URL;
const API_KEY = process.env.MEANING_CLOUD_APIKEY;

async function getSentiment({ articleContent, title, standfirst }) {
  console.log("meaningCloud", articleContent, title, standfirst);
  var request = require("request-promise");

  const result = await Promise.all([
    request(createParams(standfirst)),
    request(createParams(title)),
    request(createParams(articleContent))
  ]);

  const fullArticle = JSON.parse(result[2]);
  return {
    title: { ...JSON.parse(result[0]) },
    standfirst: { ...JSON.parse(result[1]) },
    fullArticle: {
      sentiment: fullArticle.score_tag,
      agreement: fullArticle.agreement,
      subjectivity: fullArticle.subjectivity,
      confidence: fullArticle.confidence,
      irony: fullArticle.irony
    },
    sentences: fullArticle.sentence_list
  };
}

function createParams(text) {
  return {
    method: "POST",
    url: "https://api.meaningcloud.com/sentiment-2.1",
    headers: { "content-type": "application/json" },
    form: {
      key: API_KEY,
      lang: "en",
      txt: text,
      txtf: "plain"
    }
  };
}

module.exports = { getSentiment };
