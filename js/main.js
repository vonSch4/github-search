const hintContainer = document.querySelector(".hint-container");
const addCardsContainer = document.querySelector(".added-cards-container");
const input = document.querySelector("#search");

const debouncedGetValue = debounce(getResponce, 600);

input.addEventListener("input", () => {
  debouncedGetValue();
});

hintContainer.addEventListener("click", (evt) => {
  addCard(evt.target);
});

addCardsContainer.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("close-btn")) {
    removeCard(evt.target.parentElement);
  }
});

function debounce(callback, ms) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback.call(this, ...args);
    }, ms);
  };
}

function getResponce() {
  const value = input.value;

  if (value) {
    fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
      .then((responce) => responce.json())
      .then((result) => {
        createHintCard(result.items);
      })
      .catch(console.log);
  } else {
    hintContainer.innerHTML = "";
  }
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
    card.tabIndex = 1;
    fragment.append(card);
  });

  hintContainer.append(fragment);
}

function addCard(card) {
  addCardsContainer.insertAdjacentHTML(
    "afterbegin",
    `<div class='added-card'>
      <p>Name: ${card.innerHTML}</p>
      <p>Owner: ${card.dataset.owner}</p>
      <p>Stars: ${card.dataset.stars}</p>
      <p class='close-btn'></p>
    </div>
    `
  );
  input.value = "";
  hintContainer.innerHTML = "";
}

function removeCard(card) {
  card.remove();
}
