const fetch = require("node-fetch");
const CAPI_KEY = process.env.CAPI_KEY;
const SAPI_PATH = "https://api.ft.com/content/search/v1";

if (!CAPI_KEY) {
  throw new Error("ERROR: CAPI_KEY not specified in env");
}

const searchBody = {
  queryContext: {
    curations: ["ARTICLES"]
  },
  resultContext: {
    maxResults: "10",
    offset: "0",
    aspects: [
      "audioVisual",
      "editorial",
      "images",
      "lifecycle",
      "location",
      "master",
      "metadata",
      "nature",
      "provenance",
      "summary",
      "title"
    ],
    sortOrder: "DESC",
    sortField: "lastPublishDateTime",
    facets: {
      names: [
        "authors",
        "organisations",
        "organisationsId",
        "people",
        "peopleId",
        "topics",
        "topicsId",
        "genre",
        "regions"
      ],
      maxElements: -1
    }
  }
};

function constructSAPIQuery(params) {
  const defaults = {
    queryString: "",
    maxResults: 10,
    offset: 0,
    aspects: ["title", "lifecycle", "location"], // [ "title", "location", "summary", "lifecycle", "metadata"],
    constraints: [],
    facets: { names: ["people", "organisations", "topics"], maxElements: -1 }
  };
  const combined = Object.assign({}, defaults, params);
  let queryString = combined.queryString;
  if (combined.constraints.length > 0) {
    // NB: not promises...
    queryString = `"${combined.queryString}" and `;
    queryString += combined.constraints
      .map(c => {
        return rephraseEntityForQueryString(c);
      })
      .join(" and ");
  }

  const full = {
    queryString: queryString,
    queryContext: {
      curations: ["ARTICLES", "BLOGS"]
    },
    resultContext: {
      maxResults: `${combined.maxResults}`,
      offset: `${combined.offset}`,
      aspects: combined.aspects,
      sortOrder: "DESC",
      sortField: "lastPublishDateTime",
      facets: combined.facets
    }
  };
  return full;
}

function fetchResText(url, options) {
  return fetchWithTiming(url, options)
    .then(resWithTiming => {
      const res = resWithTiming.res;
      const resOk = res && res.ok;
      if (resOk) {
        return res;
      } else {
        throw new Error(
          `fetchResText: res not ok: res.status=${
            res["status"]
          }, res.statusText=${
            res["statusText"]
          }, url=${url}, options=${JSON.stringify(options)}`
        );
      }
    })
    .then(res => res.text());
}

function search(searchTerm) {
  const sapiUrl = `${SAPI_PATH}?apiKey=${CAPI_KEY}`;
  const sapiQuery = constructSAPIQuery({
    ...searchBody,
    queryString: `topics:"UK Politics & Policy"`
  });
  const options = {
    method: "POST",
    body: JSON.stringify(sapiQuery),
    headers: {
      "Content-Type": "application/json"
    }
  };
  return fetchResText(sapiUrl, options)
    .then(text => {
      let sapiObj;
      try {
        sapiObj = JSON.parse(text);
      } catch (err) {
        throw new Error(`JSON.parse: err=${err},
				text=${text},
				params=${searchBody}`);
      }
      console.log(sapiObj);
      return {
        searchBody,
        sapiObj
      };
    })
    .catch(err => {
      console.log(`ERROR: search: err=${err}.`);
      return { searchBody }; // NB, no sapiObj...
    });
}

function fetchWithTiming(url, options = {}) {
  const startMillis = Date.now();
  return fetch(url, options).then(res => {
    const endMillis = Date.now();
    const timing = endMillis - startMillis;
    return { res, timing };
  });
}

module.exports = {
  search
};
