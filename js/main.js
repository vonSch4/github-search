const hintContainer = document.querySelector(".hint-container");
const addedCardsContainer = document.querySelector(".added-cards-container");
const input = document.querySelector("#search");

const debouncedGetValue = debounce(getValue, 600);

function debounce(callback, ms) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    return new Promise((resolve) => {
      timer = setTimeout(() => {
        resolve(callback.call(this, ...args));
      }, ms);
    });
  };
}

function getValue() {
  return new Promise((resolve) => {
    const value = input.value;

    if (value) {
      fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
        .then((responce) => responce.json())
        .then((result) => {
          createHintCard(result.items);
          resolve(result.items);
        })
        .catch(console.log);
    } else {
      hintContainer.innerHTML = "";
    }
  });
}

function createHintCard(responce) {
  const fragment = document.createDocumentFragment();
  hintContainer.innerHTML = "";

  responce.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("hint-card");
    card.textContent = item.name;
    card.dataset.owner = item.owner.login;
    card.dataset.stars = item.stargazers_count;
    fragment.append(card);
  });

  hintContainer.append(fragment);
}

function addCard(card) {
  addedCardsContainer.insertAdjacentHTML(
    "afterbegin",
    `<div class='added-card'>
      <p>Name: ${card.innerHTML}</p>
      <p>Owner: ${card.dataset.owner}</p>
      <p>Stars: ${card.dataset.stars}</p>
    </div>
    `
  );
  input.value = "";
  hintContainer.innerHTML = "";
}

input.addEventListener("input", () => {
  debouncedGetValue();
});

hintContainer.addEventListener("click", (evt) => {
  addCard(evt.target);
});
