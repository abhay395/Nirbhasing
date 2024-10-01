const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const qualificationInput = document.querySelector("#qualification");
const emailInput = document.querySelector("#email");
const imageInput = document.querySelector("#image");
const selectInput = document.querySelector('#post')
const discriptionInput = document.querySelector('#discription');
form.addEventListener("submit", (e) => {
    e.preventDefault();
  const name = nameInput.value;
  const qualification = qualificationInput.value;
  const email = emailInput.value;
  const image = imageInput.files[0]; // Get the file object
  const post = selectInput.value
  const discription=discriptionInput.value
  
  console.log({ name, email, qualification, image });

  const formData = new FormData();
  formData.append("name", name);
  formData.append("qualification", qualification);
  formData.append("email", email);
  formData.append("image", image);
  formData.append("post", post);
  formData.append("description",discription);


  fetch("/teacher", {
    method: "POST",
    body: formData,
  })
    .then((response) =>{
      nameInput.value = "";
      qualificationInput.value = "";
      emailInput.value = "";
      imageInput.value = "";
      selectInput.value = "";
      discriptionInput.value="";
     alert("Teacher added successfully");
    } )
    .catch((error) => console.log(error));
});

