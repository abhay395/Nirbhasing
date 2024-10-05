const reasearchSection = document.getElementById("research-section");
const titleInput = document.getElementById("newTitle");
const descriptionInput = document.getElementById("newDescription");
const typeInput = document.getElementById("type");
const imageInputDiv = document.querySelector("#imageInput");
const imageInput = imageInputDiv.querySelector("input");
const submitInputButton = document.getElementById("research-submit-btn");

// check show image icon
typeInput.addEventListener("change", (e) => {
  if (e.target.value !== "Ongoing Research") {
    imageInputDiv.style.display = "none";
    return;
  }
  imageInputDiv.style.display = "";
});
// get data
const getData = async () => {
  try {
    const response = await fetch("/research");
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
// delete data
const deleteData = async (id) => {
  try {
    const response = await fetch(`/research/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.log(err);
  }
};
// update data
// const updateData = async () => {
//   const data = { name };
//   try {
//     const response = await fetch(`/research`, {
//       method: "PUT",
//       headers: {},
//       body: data,
//     });
//   } catch (error) {
//     console.log(err);
//     alert("Something Went Wrong ! Please try again");
//     return;
//   }
// };
// render all data
const renderData = async () => {
  reasearchSection.innerHTML = "";
  try {
    reasearchSection.innerHTML = "";
    const data = (await getData()) || [];
    if (data.length === 0) {
      return;
    }
    const onGoingRearch = data[0].OngoingResearch;
    const publications = data[0].Publications;
    const researchGroup = data[0].ResearchGroups;
    // console.log(onGoingRearch);
    createTable(onGoingRearch, data[0]);
    createTable(publications);
    createTable(researchGroup);
  } catch (error) {
    console.log(error);
  }
};

// table create
const createTable = (data, ongoing) => {
  const table = document.createElement("table");
  table.className = "table  table-hover"; // Add Bootstrap classes for styling
  table.innerHTML = `
  <thead class="table-light">
    <tr>
      <th>Sr No.</th>
      <th>Title</th>
      ${ongoing ? `<th>Image</th>` : ""}
      <th>Description</th>
      <th>Type</th>
      <th>Action</th>
    </tr>
  </thead>
`;

  // data iterate
  const tableBody = document.createElement("tbody");

  let tableType;
  data.forEach((element, index) => {
    const tr = document.createElement("tr");
    tableType = element.type;
    tr.innerHTML = `
    <td>${index + 1}</td>
    <td>${element.title}</td>
    ${
      element.image
        ? `<td><img src="${element.image}" class="img-thumbnail" style="max-width: 100px;" alt="Image"></td>`
        : ""
    }
    <td>${element.description}</td>
    <td>${element.type}</td>
    <td>
      <button class="btn btn-warning btn-sm edit-btn">Edit</button>
      <button class="btn btn-danger btn-sm delete-btn">Delete</button>
    </td>
  `;
    // delete button
    const deleteButton = tr.querySelector(".delete-btn");
    deleteButton.addEventListener("click", async () => {
      try {
        const response = await deleteData(element._id);
        if (response.status == 200) {
          alert("Data deleted successfully !");
          renderData();
        }
      } catch (error) {
        console.log(error);
        alert("data not deleted please try again");
      }
    });
    // edit button
    // const editButton = tr.querySelector(".edit-btn");
    // let editMode = false;
    // editButton.addEventListener("click", () => {
    //   editMode = !editMode;
    //   if (editMode) {

    //     // some changes
    //     tr.querySelectorAll("td").forEach((td, index) => {
    //       let id;

    //       const imageCell = td.querySelector("img");
    //       if (imageCell) return;

    //       if (index == 1) id = "title";
    //       if (index == 3) id = "description";
    //       if (index != 0 && (index == 1 || index ==3)) {
    //         const value = td.innerText;
    //         td.innerHTML = `<input id=${id} value='${value}'>`;
    //       }
    //     });
    //     editButton.innerText = "Save";
    //   } else {
    //     const title = tr.querySelector("#title").value;
    //     const description = tr.querySelector("#description").value;
    //     const id = element._id;

    //     // update function call
    //     tr.querySelectorAll("td").forEach((td, index) => {
    //       // const imagetbData = td.querySelector('#image-table-data')
    //       if (index != 0 && index <= 2) {
    //         const input = td.querySelector("input");
    //         if (input) {
    //           td.innerHTML = input.value;
    //         }
    //       }
    //     });
    //     editButton.innerText = "Edit";
    //   }
    // });

    // append tr
    tableBody.appendChild(tr);
  });
  table.appendChild(tableBody);
  // append table
  reasearchSection.appendChild(table);
  table.insertAdjacentHTML("beforebegin", `<h1>${tableType}</h1>`);
};

// Post Data
const postData = async ({ title, description, type, image }) => {
  const formdata = new FormData();
  formdata.append("title", title);
  formdata.append("description", description);
  formdata.append("type", type);

  if (image) {
    formdata.append("image", image);
  }
  try {
    const response = await fetch("/research", {
      method: "POST",
      body: formdata,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// submit data
submitInputButton.addEventListener("click", async () => {
  const title = titleInput.value;
  const description = descriptionInput.value;
  const type = typeInput.value;
  const image = imageInput.files[0];
  if (title == "" || description == "" || type == "") {
    alert("all fields are requried");
    return;
  }
  try {
    await postData({ title, description, type, image }).then((data) => {
      if (data) {
        alert("Data Submitted !");
        titleInput.value = "";
        descriptionInput.value = "";
        typeInput.value = "";
        imageInput.files[0] = "";
      }
      renderData();
    });
  } catch (error) {
    alert("Something went wrong !");
  }
});

// window load
window.onload = renderData;
