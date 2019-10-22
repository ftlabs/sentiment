const ToneAnalyzerV3 = require("ibm-watson/tone-analyzer/v3");
const { IamAuthenticator } = require("ibm-watson/auth");

const URL = process.env.IMB_TONE_ANALYZER_URL;
const API_KEY = process.env.TONE_ANALYZER_IAM_APIKEY;

const toneAnalyzer = new ToneAnalyzerV3({
  url: URL,
  authenticator: new IamAuthenticator({ apikey: API_KEY }),
  version: "2017-09-21"
});

async function getSentiment(content) {
  return new Promise(function(resolve, reject) {
    var res = {};

    toneAnalyzer.tone(
      {
        toneInput: { text: content }
      },
      function(err, res) {
        if (err) reject(err);
        else resolve(res);
      }
    );
  });
}

module.exports = { getSentiment };
