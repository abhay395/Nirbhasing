const form = document.querySelector("form");
const descriptionInput = document.querySelector("#description");
const typeInput = document.querySelector("#type");

form.addEventListener("submit", (e) => {
  e.preventDefault();

const description = descriptionInput.value;
  const type = typeInput.value;
  const data = { description, type };

  fetch("/headline", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res)=>res.json()).then(
    res=>{
        descriptionInput.value=''
        typeInput.value=''
        alert("data added")
    }
  ).catch(err=>console.log(err))
});
