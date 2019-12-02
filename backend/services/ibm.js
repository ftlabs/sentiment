const ToneAnalyzerV3 = require("ibm-watson/tone-analyzer/v3");
const { IamAuthenticator } = require("ibm-watson/auth");

const URL = process.env.IMB_TONE_ANALYZER_URL;
const API_KEY = process.env.TONE_ANALYZER_IAM_APIKEY;

const toneAnalyzer = new ToneAnalyzerV3({
  url: URL,
  authenticator: new IamAuthenticator({ apikey: API_KEY }),
  version: "2017-09-21"
});

async function getSentiment({ articleContent, standfirst, title }) {
  console.log("ibm", articleContent, title, standfirst);

  const result = await Promise.all([
    new Promise(function(resolve, reject) {
      toneAnalyzer.tone(
        {
          toneInput: { text: title }
        },
        function(err, res) {
          if (err) reject(err);
          else resolve(res);
        }
      );
    }),
    new Promise(function(resolve, reject) {
      toneAnalyzer.tone(
        {
          toneInput: { text: standfirst }
        },
        function(err, res) {
          if (err) reject(err);
          else resolve(res);
        }
      );
    }),
    new Promise(function(resolve, reject) {
      toneAnalyzer.tone(
        {
          toneInput: { text: articleContent }
        },
        function(err, res) {
          if (err) reject(err);
          else resolve(res);
        }
      );
    })
  ]);
  return {
    title: { ...result[0].result.document_tone },
    standfirst: { ...result[1].result.document_tone },
    fullArticle: { ...result[2].result.document_tone },
    sentences: result[2].result.sentences_tone
  };
}

module.exports = { getSentiment };
