const form = document.querySelector(".login-form"); 

if (form) {
  form.addEventListener("submit", function () {
    const input = this.querySelector('input[type="submit"]');
     input.disabled = true; // schakelt input uit 

    let dots = 0;
    input.value = "Inloggen"; // tekst wordt gezet op inloggen.

    setInterval(() => {
      dots = (dots + 1) % 4; //zorgt dat het van 3 weer naar 0 gaat
      input.value = "Inloggen" + ".".repeat(dots);
    }, 400); // Herhaald elke 400ms een functie telt dots van 0 tm 3
  });
}

