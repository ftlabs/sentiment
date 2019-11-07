function init() {
  var form = document.getElementById("sentiment-api-call");
  form.addEventListener("submit", submitForm);
}

async function submitForm(event) {
  event.preventDefault();
  const uuid = document.getElementById("uuid").value;
  let inputs = Array.from(
    document.querySelector(".provider-checkboxes").children
  );
  inputs = inputs.filter(element => element.tagName === "INPUT");

  let url =
    "https://umwi7bvika.execute-api.us-east-1.amazonaws.com/dev/ftlabs-sentiment/" +
    uuid;

  if (inputs.length !== 0) {
    let providers = [];
    inputs.forEach(input => {
      if (input.checked) {
        providers.push(input.value);
      }
    });
    url = url + "?providers=" + providers.join(",");
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

  providerArray.forEach((provider, index) => {
    if (index !== 0) {
      createResultElement(result[provider], provider);
    }
  });
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
    code.innerHTML = JSON.stringify(provider[section], undefined, 2);
    parentElement.appendChild(providerContainer);
  });
}

window.addEventListener("load", init);
