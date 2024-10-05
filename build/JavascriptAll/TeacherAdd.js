const tableSection = document.getElementById("teacher-section");
const teacherNameInput = document.getElementById("newTeacherName");
const teacherQualificationInput = document.getElementById(
  "newTeacherQualification"
);
const teacherEmailInput = document.getElementById("newTeacherEmail");
const teacherDescriptionInput = document.getElementById("description");
const teacherPost = document.getElementById("newTeacherPost");
const imageInput = document.getElementById("newTeacherImage");
const submitDataButton = document.getElementById("submitDataButton");
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
      body: formdata,
    });
    const result = response.json();
    return result;
  } catch (error) {
    console.log(error);
    alert("Data not updated");
  }
};

// render data

const renderData = async () => {
  tableSection.innerHTML = "";
  const table = document.createElement("table");
table.className = 'table table-hover table-bordered table-striped'; // Added more Bootstrap classes

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
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <th scope="row">${index + 1}</th>
    <td>${element.name}</td>
    <td>
      <img src="${element.image}" class="img-thumbnail" style="width: 80px; height: auto;">
    </td>
    <td>${element.description}</td>
    <td>${element.post}</td>
    <td>${element.email}</td>
    <td>${element.qualification}</td>
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
          console.log(td)
          const value = td.innerText;
          let id;
          if (index == 0) id = "name";
          if (index == 2) id = "description";
          if (index == 3) id = "post";
          if (index == 4) id = "email";
          if (index == 5) id = "qualification";

          if (index != 1 && index <= 5) {
            td.innerHTML = `<input id=${id} value='${value}'>`;
          }
        });
        editButton.innerText = "Save";
      } else {
        const name = tr.querySelector("#name").value;
        const description = tr.querySelector("#description").value;
        const post = tr.querySelector("#post").value;
        const email = tr.querySelector("#email").value;
        const qualification = tr.querySelector("#qualification").value;
        const id = element._id;

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
            if (index != 1 && index <= 5) {
              const input = td.querySelector("input");
              if (input) {
                td.innerHTML = input.value;
              }
            }
          });

          editButton.innerText = "Edit";
        }
      }
    });
    deleteButton.addEventListener("click", async () => {
      try {
        const response = await deleteData(element._id);
        if (response.status == 200) {
          alert("data deleted");
          renderData();
        }
      } catch (error) {
        console.log(error);
      }
    });
    // append data
    tableBody.appendChild(tr);
  });
  table.appendChild(tableBody);
  tableSection.appendChild(table);
};

// Add new teacher
submitDataButton.addEventListener("click", async () => {
  const name = teacherNameInput.value;
  const qualification = teacherQualificationInput.value;
  const email = teacherEmailInput.value;
  const post = teacherPost.value;
  const image = imageInput.files[0];
  const description = teacherDescriptionInput.value;

  if (!name || !qualification || !email || !post || !image || !description) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    const data = { name, qualification, image, email, post, description };
    await postData(data).then((data) => {
      if (data) {
        alert("data added");
      }
      renderData();
    });
  } catch (err) {
    console.log(err);
    alert("data not uploaded");
  }
});

// Delete Teacher

// Load teacher data on page load
window.onload = renderData;
