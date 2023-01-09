const input = document.querySelector(".search__input");
const hintContainer = document.querySelector(".search__hint-container");
const cardsContainer = document.querySelector(".cards");

const debouncedGetResponse = debounce(getResponse, 500);

input.addEventListener("input", debouncedGetResponse);

hintContainer.addEventListener("click", addCard);

cardsContainer.addEventListener("click", removeCard);

function debounce(callback, ms) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback.call(this, ...args);
    }, ms);
  };
}

function getResponse() {
  const value = input.value;

  if (!value) {
    hintContainer.textContent = "";
    return;
  }

  fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`, {
    headers: { accept: "application/vnd.github+json" },
  })
    .then((response) => response.json())
    .then((data) => {
      createHintCard(data.items);
    })
    .catch(console.log);
}

function createHintCard(data) {
  const fragment = document.createDocumentFragment();
  hintContainer.textContent = "";

  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("search__hint-card");
    card.textContent = item.name;
    card.dataset.owner = item.owner.login;
    card.dataset.stars = item.stargazers_count;
    card.tabIndex = 1;
    fragment.append(card);
  });

  hintContainer.append(fragment);
}

function addCard(evt) {
  const card = evt.target;

  cardsContainer.insertAdjacentHTML(
    "afterbegin",
    `<div class='card'>
      <p>Name: ${card.textContent}</p>
      <p>Owner: ${card.dataset.owner}</p>
      <p>Stars: ${card.dataset.stars}</p>
      <span class='btn-close'></span>
    </div>
    `
  );

  input.value = "";
  hintContainer.textContent = "";
}

function removeCard(evt) {
  const target = evt.target;
  const card = target.parentElement;

  if (target.classList.contains("btn-close")) {
    card.remove();
  }
}
