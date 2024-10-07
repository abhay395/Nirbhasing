const tableSection = document.getElementById("teacher-section");
const teacherNameInput = document.getElementById("newTeacherName");
const teacherQualificationInput = document.getElementById(
  "newTeacherQualification"
);
const teacherEmailInput = document.getElementById("newTeacherEmail");
const teacherDescriptionInput = document.getElementById("description");
const teacherPost = document.getElementById("newTeacherPost");
const imageInput = document.getElementById("newTeacherImage");
const erroreMessage = document.querySelector("#errorMessage");
let indexOfRow = 1;
// const submitDataButton = document.getElementById("submitDataButton");
const form = document.querySelector("form");

const getData = async () => {
  try {
    const response = await fetch("/teacher");
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// update data
const updateData = async (
  name,
  qualification,
  email,
  post,
  description,
  id
) => {
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
    if (response.ok) {
      alert("data updated");
    }
    return response;
  } catch (error) {
    console.log(error);
    alert("data not updated !");
    return null;
  }
};
//  delete data
const deleteData = async (id) => {
  try {
    const response = await fetch(`/teacher/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.log(error);
    alert("Data not deleted");
  }
};

// post data
const postData = async ({
  name,
  qualification,
  email,
  post,
  image,
  description,
}) => {
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
    // console.log(result)
    return response;
  } catch (error) {
    alert("Data not updated");
  }
};

// render data
const creatRow = (data, index) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <th scope="row">${index}</th>
    <td>${data.name}</td>
    <td>
      <img src="${data.image}" class="img-thumbnail" style="width: 80px; height: auto;">
    </td>
    <td>${data.description}</td>
    <td>${data.post}</td>
    <td>${data.email}</td>
    <td>${data.qualification}</td>
    <td>
      <button class="btn btn-sm btn-warning edit-btn me-2">Edit</button>
      <button class="btn btn-sm btn-danger delete-btn">Delete</button>
    </td>
    `;
  const editButton = tr.querySelector(".edit-btn");
  const deleteButton = tr.querySelector(".delete-btn");
  let editMode = false;
  editButton.addEventListener("click", async () => {
    editMode = !editMode;
    if (editMode) {
      tr.querySelectorAll("td").forEach((td, index) => {
        console.log(td);
        const value = td.innerText;
        let id;
        if (index == 0) id = "name";
        if (index == 2) id = "description";
        if (index == 3) id = "post";
        if (index == 4) id = "email";
        if (index == 5) id = "qualification";

        if (index != 1 && index != 3 && index <= 5) {
          td.innerHTML = `<input id=${id} value='${value}'>`;
        }
        if (index == 3) {
          console.log(value);
          td.innerHTML = `<select id=${id} >
            <option value="HOD" ${
              value === "HOD" ? "selected" : ""
            }>HOD</option>
            <option value="Staff" ${
              value === "Staff" ? "selected" : ""
            }>Staff</option>
            <option value="Faculty" ${
              value === "Faculty" ? "selected" : ""
            }>Faculty</option>
            <select>`;
        }
      });
      editButton.innerText = "Save";
    } else {
      const name = tr.querySelector("#name").value;
      const description = tr.querySelector("#description").value;
      const post = tr.querySelector("#post").value;
      const email = tr.querySelector("#email").value;
      const qualification = tr.querySelector("#qualification").value;
      const id = data._id;

      const response = await updateData(
        name,
        qualification,
        email,
        post,
        description,
        id
      );
      console.log(response);
      if (response.ok) {
        tr.querySelectorAll("td").forEach((td, index) => {
          if (index != 1 && index != 3 && index <= 5) {
            const input = td.querySelector("input");
            if (input) {
              td.textContent = input.value;
            }
          }
          if (index == 3) {
            const select = td.querySelector("select");
            if (select) {
              td.textContent = select.value;
            }
          }
        });

        editButton.innerText = "Edit";
      }
    }
  });
  deleteButton.addEventListener("click", async (e) => {
    try {
      const response = await deleteData(data._id);
      if (response.status == 200) {
        const tbody = tr.parentElement;
        tbody.removeChild(tr);
      }
    } catch (error) {
      console.log(error);
    }
  });

  return tr;
};
const renderData = async () => {
  tableSection.innerHTML = "";
  const table = document.createElement("table");
  table.className = "table table-hover table-bordered table-striped"; // Added more Bootstrap classes

  const data = (await getData()) || [];
  table.innerHTML = `
  <thead class="table-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">Image</th>
      <th scope="col">Description</th>
      <th scope="col">Post</th>
      <th scope="col">Email</th>
      <th scope="col">Qualification</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
`;

  const tableBody = document.createElement("tbody");
  data.forEach((element, index) => {
    const tr = creatRow(element, index + 1);
    tr.setAttribute("data-index", index);
    // append data
    indexOfRow = index + 1;
    tableBody.appendChild(tr);
  });
  table.appendChild(tableBody);
  tableSection.appendChild(table);
};

// Add new teacher
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = teacherNameInput.value;
  const qualification = teacherQualificationInput.value;
  const email = teacherEmailInput.value;
  const post = teacherPost.value;
  const image = imageInput.files[0];
  const description = teacherDescriptionInput.value;
  
  // Disable input fields during data submission
  disableInputFields(true);

  try {
    const data = { name, qualification, image, email, post, description };
    erroreMessage.innerHTML = '';
    let res = await postData(data);

    if (res.ok) {
      res = await res.json();
      let teacher = res.teacher;
      const tbody = document.querySelector("table tbody");
      const row = creatRow(teacher, indexOfRow + 1);
      tbody.appendChild(row);
      alert("Data added successfully");
    } else {
      const errore = await res.json();
      erroreMessage.innerHTML = `${errore.message}`;
    }
  } catch (err) {
    console.log(err);
    // alert("data not uploaded");
  } finally {
    // Enable input fields after data submission
    disableInputFields(false);
    form.reset();
  }
});

function disableInputFields(disable) {
  teacherNameInput.disabled = disable;
  teacherQualificationInput.disabled = disable;
  teacherEmailInput.disabled = disable;
  teacherPost.disabled = disable;
  teacherDescriptionInput.disabled = disable;
  imageInput.disabled = disable;
}

// Delete Teacher

// Load teacher data on page load
window.onload = renderData;
