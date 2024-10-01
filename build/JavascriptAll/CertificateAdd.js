const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const descriptionInput = document.querySelector("#description");
const durationInput = document.querySelector("#duration");
const modeInput = document.querySelector("#mode");
const skillsGainedInput = document.querySelector("#skillsGained");

form.addEventListener("submit", (e) => {
    e.preventDefault();
  const name = nameInput.value;
  const description = descriptionInput.value;
  const duration = durationInput.value;
  const mode = modeInput.value;
  const skillsGained = skillsGainedInput.value;

  const data = { name, description, duration, mode, skillsGained };

  fetch("/certification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
        alert("data added")
        nameInput.value =""
        descriptionInput.value=""
        durationInput.value=""
        modeInput.value=""
        skillsGainedInput.value=""
    })
    .catch((err) => console.log(err));
});
