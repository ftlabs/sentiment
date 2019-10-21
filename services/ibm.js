const ToneAnalyzerV3 = require("ibm-watson/tone-analyzer/v3");

const URL = process.env.IMB_TONE_ANALYZER_URL;

const toneAnalyzer = new ToneAnalyzerV3({
  version: "2017-09-21"
});

async function getSentiment(content) {
  return new Promise(function(resolve, reject) {
    var res = {};

    toneAnalyzer.tone({ text: content }, function(err, res) {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

module.exports = { getSentiment };
