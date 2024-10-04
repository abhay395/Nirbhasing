const techerSection = document.querySelector("#teacherSecition");
const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const qualificationInput = document.querySelector("#qualification");
const emailInput = document.querySelector("#email");
const postInput = document.querySelector("#post");
const imageInput = document.querySelector("#image");
const descriptionInput = document.querySelector("#description");

const updateData = async ({ name, qualification, email, post }, id) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("qualification", qualification);
  formdata.append("email", email);
  formdata.append("post", post);
  console.log(post)
  try {
    const res = await fetch(`https://server-for-college-git-main-abhay395s-projects.vercel.app/teacher/${id}`, {
      method: "PUT",
      body: formdata,
    });
    return res;
  } catch (error) {
    return error;
  }
};
const postData = async ({
  name,
  qualification,
  email,
  post,
  description,
  image,
}) => {
  try {
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("qualification", qualification);
    formdata.append("email", email);
    formdata.append("post", post);
    formdata.append("description", description);
    formdata.append("image", image);
    const response = await fetch("https://server-for-college-git-main-abhay395s-projects.vercel.app/teacher", {
      method: "POST",
      body: formdata,
    });
    return response;
  } catch (error) {
    return null;
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value;
  const qualification = qualificationInput.value;
  const email = emailInput.value;
  const post = postInput.value;
  const description = descriptionInput.value;
  const image = imageInput.files[0];
  try {
   const respo = await postData({
      name,
      qualification,
      email,
      post,
      description,
      image,
    })
    console.log(respo);
    if(respo.status == 201){
      alert("data added successfully");
      nameInput.value='';
      qualificationInput.value='';
      emailInput.value='';
      postInput.value='';
      descriptionInput.value='';
      imageInput.value='';
      // renderData()
      renderData();
    }
  } catch (error) {
    alert(error);
  }
});

const getData = async () => {
  try {
    const response = await fetch(`https://server-for-college-git-main-abhay395s-projects.vercel.app/teacher`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const teacherDelete = async (id) => {
  try {
    const response = await fetch(`https://server-for-college-git-main-abhay395s-projects.vercel.app/teacher/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    return null;
  }
};
const renderData = async () => {
  try {
    techerSection.innerHTML = "";
    const data = (await getData()) || [];
    const tableForTeacherAndStaff = creatTable(data, "Teacher And Staff");
    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.innerHTML = `Teacher And Staff`;
    div.appendChild(h1);
    div.appendChild(tableForTeacherAndStaff);
    techerSection.appendChild(div);

    // data.forEach(element => {

    // });
  } catch (error) {
    console.log(error);
  }
};
function creatTable(data, name) {
  const table = document.createElement("table");
  table.innerHTML = `<thead>
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Qualification</th>
                    <th>Email</th>
                    <th>Post</th>
                    <th>Actions</th>
                </tr>
            </thead>`;
  const tbody = document.createElement("tbody");
  data.forEach((element) => {
    const tr = document.createElement("tr");
    let EditMode = false;
    const { name, image, qualification, email, post } = element;
    tr.innerHTML = `
    <td>${name}</td>
    <td>${`<img src="${image}" >`}</td>
    <td>${qualification}</td>
    <td>${email}</td>
    <td>${post}</td>
    <td><button class="EditBtn">Edit</button><button class="DeleteBtn">Delete</button></td>`;
    const EditBtn = tr.querySelector(".EditBtn");
    const DeleteBtn = tr.querySelector(".DeleteBtn");
    DeleteBtn.addEventListener("click", async (e) => {
      try {
        const res = await teacherDelete(element._id);
        if (res.status == 200) {
          const parentElement =
            e.target.parentElement.parentElement.parentElement;
          parentElement.removeChild(e.target.parentElement.parentElement);
        }
      } catch (error) {
        console.log(error);
      }
    });
    EditBtn.addEventListener("click", async (e) => {
      EditMode = !EditMode;
      if (EditMode) {
        const obj = {};
        tr.querySelectorAll("td").forEach((td, index) => {
          let id;
          if (index == 0) id = "name";
          if (index == 2) id = "qualification";
          if (index == 3) id = "email";
          if (index == 4) id = "post";
          if (index != 1 && index < 4) {
            // First 4 columns are editable
            const value = td.innerText;
            td.innerHTML = `<input id="${id}" value="${value}" />`;
          }
          if (index == 4) {
            const value = td.innerText;
            td.innerHTML = `<select id="post">
            <option value="Faculty"  ${
              value === "Faculty" ? "selected" : ""
            }>Faculty</option>
            <option value="Staff" ${
              value === "Staff" ? "selected" : ""
            }>Staff</option>
            <option value="HOD" ${
              value === "HOD" ? "selected" : ""
            }>HOD</option>
            </select>`;
          }
        });
        EditBtn.innerText = "Save";
      } else {
        const name = tr.querySelector("#name").value;
        const qualification = tr.querySelector("#qualification").value;
        const email = tr.querySelector("#email").value;
        const post = tr.querySelector("#post").value;
        const id = element._id;
        const res = await updateData({ name, qualification, email, post }, id);
        if (res.status == 200)
          tr.querySelectorAll("td").forEach((td, index) => {
            if (index != 1 && index < 5) {
              const input = td.querySelector("input");
              const select = td.querySelector("select");
              if (select) {
                td.innerHTML = select.value;
              }
              if (input) {
                td.innerHTML = input.value;
              }
            }
          });
        EditBtn.innerText = "Edit";
      }
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  return table;
}

renderData();
