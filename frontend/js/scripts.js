function init() {
  const form = document.getElementById("sentiment-api-call");
  form.addEventListener("submit", submitForm);
  const documentation = document.querySelector(".show-documentation");
  documentation.addEventListener("click", toggleDocumentation);
}

function toggleDocumentation() {
  const documentation = document.querySelector(".documentation-contents");
  documentation.classList.toggle("hidden");
  documentation.classList.toggle("flex");
}

async function submitForm(event) {
  event.preventDefault();
  const loading = document.querySelector(".loading");
  loading.classList.remove("hidden");
  const uuid = document.getElementById("uuid").value;
  let inputs = Array.from(
    document.querySelector(".provider-checkboxes").children
  );
  inputs = inputs.filter(element => element.tagName === "INPUT");

  let url =
    "https://umwi7bvika.execute-api.us-east-1.amazonaws.com/dev/ftlabs-sentiment/" +
    uuid;
  let providersSelected;
  if (inputs.length !== 0) {
    providersSelected = inputs.length;
    let providers = [];
    inputs.forEach(input => {
      if (input.checked) {
        providers.push(input.value);
      }
    });
    url = url + "?providers=" + providers.join(",");
  } else {
    providersSelected = 3;
  }

  let result = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  result = await result.text();

  result = JSON.parse(result);

  const providerArray = Object.keys(result);

  addHeadings(result.original);

  const sentenceData = {};
  providerArray.forEach((provider, index) => {
    if (index !== 0) {
      createResultElement(result[provider], provider);
    }
    if (provider !== "original") {
      sentenceData[provider] = result[provider].sentences;
    }
  });
  const matchedSentenceData = sentenceFormatter(sentenceData);
  sentenceFormatterGroups(matchedSentenceData, providersSelected);
  console.log("sentenceData", sentenceData);

  sd = sentenceData;

  const groupedBySentimentData = groupedBySentimentData(sentenceData);

  const resultContainer = document.querySelector(".result");
  resultContainer.classList.remove("hidden");
  loading.classList.add("hidden");
}

function groupedBySentimentData(sentenceData) {
  Object.keys(sentenceData).forEach(key => {
    let sentenceDat;
    if (key === "ibm") {
    } else if (key === "aws") {
    } else if (key === "meaningCloud") {
    }
  });
}

function sentenceFormatterGroups(matchedSentenceData, providersSelected) {
  const onlyPairableSentences = matchedSentenceData.filter(
    sentenceData => sentenceData.length === providersSelected
  );
  const standardisedSentenceData = onlyPairableSentences.map(sentenceData =>
    getStandardisedSentenceData(sentenceData)
  );
  const groupedStandardisedSentenceData = groupStandardisedSentenceData(
    standardisedSentenceData
  );
  displaySentenceData(groupedStandardisedSentenceData);
}

function displaySentenceData(groupedStandardisedSentenceData) {
  groupedStandardisedSentenceData.forEach(sentenceData => {
    const selector =
      sentenceData.length === 3
        ? ".grouped-three-container"
        : ".grouped-two-container";
    sentenceData.matches.forEach(match => {
      const sentencesContainer = document.querySelector(selector);
      andSentenceElement(match, sentencesContainer);
    });
  });
}

function groupStandardisedSentenceData(standardisedSentenceData) {
  let threeMatches = [];
  let twoMatches = [];

  standardisedSentenceData.forEach(sentenceData => {
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    sentenceData.forEach(providerSentenceData => {
      providerSentenceData.standardisedSentiment.forEach(sentiment => {
        if (sentiment === "POSITIVE") {
          positive = positive + 1;
        } else if (sentiment === "NEUTRAL") {
          neutral = neutral + 1;
        } else if (sentiment === "NEGATIVE") {
          negative = negative + 1;
        }
      });
    });

    if (positive === 2) {
      twoMatches = [
        ...twoMatches,
        sentenceData.map(providerData => ({
          ...providerData,
          matchedData: "POSTIVE"
        }))
      ];
    }
    if (negative === 2) {
      twoMatches = [
        ...twoMatches,
        sentenceData.map(providerData => ({
          ...providerData,
          matchedData: "NEGATIVE"
        }))
      ];
    }
    if (neutral === 2) {
      twoMatches = [
        ...twoMatches,
        sentenceData.map(providerData => ({
          ...providerData,
          matchedData: "NEUTRAL"
        }))
      ];
    }
    if (positive === 3) {
      threeMatches = [
        ...threeMatches,
        sentenceData.map(providerData => ({
          ...providerData,
          matchedData: "POSTIVE"
        }))
      ];
    }
    if (negative === 3) {
      threeMatches = [
        ...threeMatches,
        sentenceData.map(providerData => ({
          ...providerData,
          matchedData: "NEGATIVE"
        }))
      ];
    }
    if (neutral === 3) {
      threeMatches = [
        ...threeMatches,
        sentenceData.map(providerData => ({
          ...providerData,
          matchedData: "NEUTRAL"
        }))
      ];
    }
  });
  return [
    { length: 3, matches: threeMatches },
    { length: 2, matches: twoMatches }
  ];
}

function getStandardisedSentenceData(sentenceData) {
  const standardisedData = sentenceData.map(sentence => {
    switch (sentence.provider) {
      case "aws":
        return { ...sentence, standardisedSentiment: [sentence.Sentiment] };
      case "ibm":
        const standardisedScores = ibmStandardised(sentence.tones);
        return { ...sentence, standardisedSentiment: standardisedScores };
      case "meaningCloud":
        const standardisedScore = meaningCloudStandardised(sentence.score_tag);
        if (standardisedScore) {
          return { ...sentence, standardisedSentiment: [standardisedScore] };
        } else {
          return { ...sentence, standardisedSentiment: [] };
        }
      default:
        return { ...sentence, standardisedSentiment: [] };
    }
  });
  return standardisedData;
}

function ibmStandardised(tones) {
  let sentimentArray = [];
  tones.forEach(toneData => {
    switch (toneData.tone_id) {
      case "anger":
        if (!sentimentArray.includes("NEGATIVE")) {
          sentimentArray = [...sentimentArray, "NEGATIVE"];
        }
      case "fear":
        if (!sentimentArray.includes("NEGATIVE")) {
          sentimentArray = [...sentimentArray, "NEGATIVE"];
        }
      case "sadness":
        if (!sentimentArray.includes("NEGATIVE")) {
          sentimentArray = [...sentimentArray, "NEGATIVE"];
        }
      case "analytical":
        if (!sentimentArray.includes("NEUTRAL")) {
          sentimentArray = [...sentimentArray, "NEUTRAL"];
        }
      case "tentative":
        if (!sentimentArray.includes("NEUTRAL")) {
          sentimentArray = [...sentimentArray, "NEUTRAL"];
        }
      case "joy":
        if (!sentimentArray.includes("POSITIVE")) {
          sentimentArray = [...sentimentArray, "POSITIVE"];
        }
      case "confident":
        if (!sentimentArray.includes("POSITIVE")) {
          sentimentArray = [...sentimentArray, "POSITIVE"];
        }
      default:
        break;
    }
  });
  return sentimentArray;
}

function meaningCloudStandardised(score_tag) {
  switch (score_tag) {
    case "P+":
      return "POSITIVE";
    case "P":
      return "POSITIVE";
    case "NEU":
      return "NEUTRAL";
    case "N+":
      return "NEGATIVE";
    default:
      break;
  }
}

function addHeadings({ title, fullArticle, standfirst }) {
  const titleContent = document.querySelector(".title-content");
  titleContent.innerHTML = title;
  const fullArticleContent = document.querySelector(".fullArticle-content");
  fullArticleContent.innerHTML = fullArticle;
  const standfirstContent = document.querySelector(".standfirst-content");
  standfirstContent.innerHTML = standfirst;
}

function createResultElement(provider, providerName) {
  Object.keys(provider).forEach(section => {
    if (section !== "sentences") {
      addNewElement(provider, providerName, section);
    }
  });
}

function sentenceFormatter(sentenceData) {
  cleanedData = cleanSentences(sentenceData);
  let matches = [];
  Object.keys(cleanedData).forEach(key => {
    cleanedData[key].forEach(sentenceData => {
      const foundElement = matches.find(matchedSentence => {
        return matchedSentence[0].text === sentenceData.text;
      });
      if (foundElement) {
        foundElement.push({ provider: key, ...sentenceData });
      } else {
        matches.push([{ provider: key, ...sentenceData }]);
      }
    });
  });
  matches = matches.sort(function(a, b) {
    return b.length - a.length;
  });
  matches.forEach(match => {
    const sentencesContainer = document.querySelector(".sentences-container");
    andSentenceElement(match, sentencesContainer);
  });
  return matches;
}

function andSentenceElement(match, sentencesContainer) {
  const sentenceMatchContainer = document.createElement("div");
  const sentenceMatchHeading = document.createElement("h4");
  sentenceMatchHeading.innerHTML = match[0].text;
  sentenceMatchContainer.appendChild(sentenceMatchHeading);

  const matchesContainer = document.createElement("div");
  matchesContainer.classList.add("container");

  match.forEach(match => {
    const sentenceProviderContainer = document.createElement("div");
    sentenceProviderContainer.classList.add("provider-container");
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    pre.setAttribute("id", "json");
    pre.appendChild(code);
    sentenceProviderContainer.appendChild(pre);
    code.innerHTML = JSON.stringify(
      providerFormat(match, match.provider, "sentences"),
      undefined,
      2
    );
    matchesContainer.appendChild(sentenceProviderContainer);
  });

  sentenceMatchContainer.appendChild(matchesContainer);
  sentencesContainer.appendChild(sentenceMatchContainer);
}

function addNewElement(provider, providerName, section) {
  const parentElement = document.querySelector(`.${section}-container`);
  const providerContainer = document.createElement("div");
  providerContainer.classList.add("provider-container");
  const title = document.createElement("h3");
  title.innerHTML = providerName;
  providerContainer.appendChild(title);
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  pre.setAttribute("id", "json");
  providerContainer.appendChild(pre);
  pre.appendChild(code);
  if (section !== "sentences") {
    code.innerHTML = JSON.stringify(
      providerFormat(provider[section], providerName, section),
      undefined,
      2
    );
  }

  parentElement.appendChild(providerContainer);
}

function cleanSentences(sentenceData) {
  const cleanedData = {};
  Object.keys(sentenceData).forEach(key => {
    cleanedData[key] = sentenceData[key].map(sentenceData => {
      if (key === "aws") {
        sentenceData.text = sentenceData.sentence
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/\.$/, "")
          .trim();
      } else {
        sentenceData.text = sentenceData.text
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/\.$/, "")
          .trim();
      }
      return sentenceData;
    });
  });
  return cleanedData;
}

function providerFormat(provider, providerName, section) {
  if (providerName === "meaningCloud") {
    if (section === "sentences") {
      return formatSentencesMeaningCloud(provider);
    }
    return meaningCloudFormat(provider);
  }
  if (providerName === "ibm") {
    if (section === "sentences") {
      return formatSentencesIbm(provider);
    }
    return ibmFormat(provider);
  }
  if (providerName === "aws") {
    if (section === "sentences") {
      return formatSentencesAws(provider);
    }
    return awsFormat(provider);
  }
}

function formatSentencesMeaningCloud({
  provider,
  inip,
  endp,
  bop,
  confidence,
  score_tag,
  agreement
}) {
  return {
    provider,
    inip,
    endp,
    bop,
    confidence,
    score_tag,
    agreement
  };
}

function formatSentencesIbm({ tones, provider }) {
  return { tones, provider };
}

function formatSentencesAws({ provider, Sentiment, SentimentScore }) {
  return { provider, Sentiment, SentimentScore };
}

function meaningCloudFormat({
  score_tag,
  agreement,
  subjectivity,
  confidence,
  irony
}) {
  return {
    score_tag,
    agreement,
    subjectivity,
    confidence,
    irony
  };
}

function ibmFormat({ tones }) {
  return { tones };
}

function awsFormat({ Sentiment, SentimentScore }) {
  Object.keys(SentimentScore).forEach(key => {
    SentimentScore[key] = Math.round(SentimentScore[key] * 100) / 100;
  });
  return { SentimentScore, Sentiment };
}

window.addEventListener("load", init);
