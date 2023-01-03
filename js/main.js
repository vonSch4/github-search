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
  console.log(input.value);
  return input.value;
}

const debouncedGetValue = debounce(getValue, 500);

input.addEventListener("input", () => {
  debouncedGetValue();
});
