

document.querySelector(".login-form").addEventListener("submit", function () {
  const input = this.querySelector('input[type="submit"]');
  input.disabled = true;

  let dots = 0;
  input.value = "Inloggen";

  setInterval(() => {
    dots = (dots + 1) % 4;
    input.value = "Inloggen" + ".".repeat(dots);
  }, 400);
});
