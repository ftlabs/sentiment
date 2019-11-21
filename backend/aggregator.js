"use strict";

module.exports.main = async event => {
  try {
  } catch (err) {
    console.error(err);
    return {
      statusCode: 401,
      body: "Something went wrong",
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  }
};
