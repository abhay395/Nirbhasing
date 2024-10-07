const tableSection = document.getElementById("table-section");
const newName = document.getElementById("newName");
const newCompany = document.getElementById("newCompany");
const newPassOutYear = document.getElementById("newPass-out-year");
const newAnnualPackage = document.getElementById("newAnnual-package");
const newPlacedImage = document.getElementById("newPlacedImage");
const submitDataButton = document.getElementById("submitDataButton");
const postInput = document.querySelector("#post");
const form = document.querySelector("form");
let indexForStudent = 0;

// fetch all data
const getData = async () => {
  try {
    const response = await fetch("/placementStudent");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// delete data
const deleteData = async (id) => {
  try {
    const response = await fetch(`/placementStudent/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Error deleting data:", error);
    return null;
  }
};

// post data
const postData = async (name, image, package, passoutYear, company, post) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("image", image);
  formData.append("package", package);
  formData.append("passoutYear", passoutYear);
  formData.append("company", company);
  formData.append("post", post);
  try {
    console.log(name, image, package, passoutYear, company);
    const response = await fetch("/placementStudent", {
      method: "POST",
      body: formData,
    });
   return response
  } catch (error) {
    console.error(error);
    return null;
  }
};
const createRow = (data, index) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <th scope="row">${index}</th>
  <td>${data.name}</td>
  <td><img src="${data.image}" class="img-thumbnail"></td>
  <td>${data.company}</td>
  <td>${data.post}</td>
  <td>${data.package}</td>
  <td>${data.passoutYear - 1}-${data.passoutYear}</td>
  <td>
    <button class="btn btn-sm btn-danger delete-btn" id="${
      data._id
    }">Delete</button>
  </td>
    `;
  // delete button
  const deleteBtn = tr.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", async () => {
    try {
      const responce = await deleteData(data._id);
      if (responce && responce.ok) {
        tr.remove();
      }
    } catch (error) {
      console.error(error);
      alert("data not deleted please try again");
    }
  });
  return tr;
};

// render data
const renderData = async () => {
  const data = await getData();

  const table = document.createElement("table");
  (table.className = "table table-hover table-bordered table-striped"),
    (table.innerHTML = `
    <thead class="table-dark">
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Image</th>
        <th>Company Name</th>
        <th>Post </th>
        <th>Package</th>
        <th>Passout Year</th>
        <th>Action</th>
      </tr>
    </thead>
    `);

  const tableBody = document.createElement("tbody");
  data.forEach((student, index) => {
    indexForStudent = index + 1;
    const tr = createRow(student, indexForStudent);
    tableBody.appendChild(tr);
    // indexForStudent=index+1;
    tableSection.innerHTML = "";
  });
  table.appendChild(tableBody);
  tableSection.appendChild(table);
};

// submit data
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = newName.value;
  const company = newCompany.value;
  const passoutYear = newPassOutYear.value;
  const package = newAnnualPackage.value;
  const image = newPlacedImage.files[0];
  const post = postInput.value;
  disableInputFields(true);
  const response = await postData(
    name,
    image,
    package,
    passoutYear,
    company,
    post
  );
  if (response && response.ok) {
    disableInputFields(false);
    const data = await response.json();
    const student = data.student
    const tr = createRow(student, indexForStudent);
    const tableBody = document.querySelector("tbody");
    tableBody.appendChild(tr);
    // alert("Placement student data added !");
    form.reset();
  } else {
    alert("Failed to add student data !");
  }
});
function disableInputFields(bool) {
  newName.disabled = bool;
  newCompany.disabled = bool;
  newPassOutYear.disabled = bool;
  newAnnualPackage.disabled = bool;
  newPlacedImage.disabled = bool;
  postInput.disabled = bool;
  submitDataButton.disabled = bool;
}
window.onload = renderData();
