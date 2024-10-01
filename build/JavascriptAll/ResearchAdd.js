const selectType = document.querySelector("#type");
const imageInputDiv = document.querySelector("#imageInput");
const descriptionInput = document.querySelector("#description");
const titleInput = document.querySelector("#title");
const imageInput = imageInputDiv.querySelector("input");

const form = document.querySelector("form");

selectType.addEventListener("change", (e) => {
  if (e.target.value !== "Ongoing Research") {
    imageInputDiv.style.display = "none";
    return;
  }
  imageInputDiv.style.display = "block";
});

form.addEventListener("submit", async(e) => {
  e.preventDefault();
  const type = selectType.value;
  const description = descriptionInput.value;
  const title = titleInput.value;
  const formData = new FormData();
  
  formData.append("type", type);
  formData.append("description", description);
  formData.append("title", title);
  
  if (imageInput.files[0]){
    formData.append("image", imageInput.files[0]);
  }
 try {
  const respo = await fetch("/research", {
    method: "POST",
    body: formData,  // No manual Content-Type header
  })
  const data = await respo.json();
  console.log(data);
 } catch (error) {
  console.log(error)
 }
});
