const hintContainer = document.querySelector(".hint-container");
const addedItems = document.querySelector(".added-items");
const input = document.querySelector("#search");

function debounce(callback, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback.call(this, ...args);
    }, ms);
  };
}

function getValue() {
  return Promise.resolve().then(() => {
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
  });
}

function createHintCard(responce) {
  const fragment = document.createDocumentFragment();
  hintContainer.innerHTML = "";

  responce.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("hint-card");
    card.textContent = item.name;
    fragment.append(card);
  });

  hintContainer.append(fragment);
}

const debouncedGetValue = debounce(getValue, 500);

input.addEventListener("input", () => {
  debouncedGetValue();
});

hintContainer.addEventListener("click", (evt) => {
  const target = evt.target;
  console.dir(target);
});
