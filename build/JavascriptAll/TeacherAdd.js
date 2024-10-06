const tableSection = document.getElementById("teacher-section");
const teacherNameInput = document.getElementById("newTeacherName");
const teacherQualificationInput = document.getElementById("newTeacherQualification");
const form = document.querySelector("form");
const teacherEmailInput = document.getElementById("newTeacherEmail");
const teacherDescriptionInput = document.getElementById("description");
const teacherPost = document.getElementById("newTeacherPost");
const imageInput = document.getElementById("newTeacherImage");
const submitInputButton = document.getElementById("submitDataButton");
let index = 1;

// Fetch teacher data from the server
const getData = async () => {
  try {
    const response = await fetch("/teacher");
    return await response.json();
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    return [];
  }
};

// Update teacher data
const updateData = async (name, qualification, email, post, description, id) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("qualification", qualification);
    formData.append("email", email);
    formData.append("post", post);
    formData.append("description", description);

    const response = await fetch(`/teacher/${id}`, {
      method: "PUT",
      body: formData,
    });
    return response;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

// Delete teacher data
const deleteData = async (id) => {
  try {
    const response = await fetch(`/teacher/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Error deleting data:", error);
    return null;
  }
};

// Post new teacher data
const postData = async ({ name, qualification, email, post, image, description }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("qualification", qualification);
  formData.append("email", email);
  formData.append("post", post);
  formData.append("image", image);
  formData.append("description", description);

  try {
    const response = await fetch("/teacher", {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    return null;
  }
};

// Render the teacher data table
const renderData = async () => {
  const data = await getData();
  const fragment = document.createDocumentFragment();
  const table = document.createElement("table");
  table.className = "table table-hover table-bordered table-striped";
  table.innerHTML = `
    <thead class="table-dark">
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Image</th>
        <th>Description</th>
        <th>Post</th>
        <th>Email</th>
        <th>Qualification</th>
        <th>Action</th>
      </tr>
    </thead>
  `;
  
  const tableBody = document.createElement("tbody");
  data.forEach((teacher, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <th scope="row">${i + 1}</th>
      <td>${teacher.name}</td>
      <td><img src="${teacher.image}" class="img-thumbnail" style="width: 80px;"></td>
      <td>${teacher.description}</td>
      <td>${teacher.post}</td>
      <td>${teacher.email}</td>
      <td>${teacher.qualification}</td>
      <td>
        <button class="btn btn-sm btn-warning edit-btn" data-id="${teacher._id}">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${teacher._id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  table.appendChild(tableBody);
  fragment.appendChild(table);
  tableSection.innerHTML = "";
  tableSection.appendChild(fragment);
};

// Event delegation for dynamic buttons
tableSection.addEventListener("click", async (event) => {
  if (event.target.classList.contains("edit-btn")) {
    const tr = event.target.closest("tr");
    const id = event.target.getAttribute("data-id");
    const inputs = tr.querySelectorAll("td");

    // Switch to edit mode
    inputs.forEach((td, index) => {
      if (index >= 0 && index <= 5) {
        if(index == 1){
          return;
        } 
        const value = td.innerText;
        td.innerHTML = `<input type="text" value="${value}">`;
      }
    });
    event.target.innerText = "Save";
    
    // Save the changes
    event.target.addEventListener("click", async () => {
      const name = inputs[0].querySelector("input").value;
      const description = inputs[2].querySelector("input").value;
      const post = inputs[3].querySelector("input").value;
      const email = inputs[4].querySelector("input").value;
      const qualification = inputs[5].querySelector("input").value;

      const response = await updateData(name, qualification, email, post, description, id);
      if (response.ok) {
        renderData(); // Refresh the data after update
      }
    });
  }

  if (event.target.classList.contains("delete-btn")) {
    const id = event.target.getAttribute("data-id");
    const response = await deleteData(id);
    if (response && response.ok) {
      renderData(); // Refresh the data after delete
    }
  }
});

// Add new teacher event handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = teacherNameInput.value;
  const qualification = teacherQualificationInput.value;
  const email = teacherEmailInput.value;
  const post = teacherPost.value;
  const image = imageInput.files[0];
  const description = teacherDescriptionInput.value;
  teacherNameInput.disabled=true;
  teacherQualificationInput.disabled=true;
  teacherEmailInput.disabled=true;
  teacherPost.disabled=true;
  teacherDescriptionInput.disabled=true;
  imageInput.disabled=true;
  submitInputButton.disabled=true
  
  const response = await postData({ name, qualification, email, post, description, image });
  if (response && response.ok) {
    alert("Teacher added successfully!");
    submitInputButton.disabled=false;
    teacherNameInput.disabled=false;
    teacherQualificationInput.disabled=false;
    teacherEmailInput.disabled=false;
    teacherPost.disabled=false;
    teacherDescriptionInput.disabled=false;
    imageInput.disabled=false;
    form.reset(); // Clear the form
    renderData(); // Refresh the data
  } else {
    alert("Failed to add teacher");
  }
});

// Load teacher data on page load
window.onload = renderData;
