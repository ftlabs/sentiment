const axios = require("axios");

const URL = process.env.MEANING_CLOUD_URL;
const API_KEY = process.env.MEANING_CLOUD_APIKEY;

async function getSentiment({ articleContent, title, standfirst }) {}

module.exports = { getSentiment };
