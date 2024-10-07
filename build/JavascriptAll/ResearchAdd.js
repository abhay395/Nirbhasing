const reasearchSection = document.getElementById("research-section");
const titleInput = document.getElementById("newTitle");
const descriptionInput = document.getElementById("newDescription");
const typeInput = document.getElementById("type");
const imageInputDiv = document.querySelector("#imageInput");
const imageInput = imageInputDiv.querySelector("input");
const form = document.querySelector("form");

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
    // console.log(data[0]);
    createTable(onGoingRearch, "Ongoing-Research");
    createTable(publications,"Publications");
    createTable(researchGroup,"Research Groups");
  } catch (error) {
    console.log(error);
  }
};

const creatRow = (data,index)=>{
  const tr = document.createElement("tr");
  tableType = data.type;
  tr.innerHTML = `
  <td>${index }</td>
  <td>${data.title}</td>
  ${
    data.image
      ? `<td><img src="${data.image}" class="img-thumbnail" style="max-width: 100px;" alt="Image"></td>`
      : ""
  }
  <td>${data.description}</td>
  <td>${data.type}</td>
  <td>
    <button class="btn btn-danger btn-sm delete-btn">Delete</button>
  </td>
`;
  // delete button
  const deleteButton = tr.querySelector(".delete-btn");
  deleteButton.addEventListener("click", async () => {
    try {
      const response = await deleteData(data._id);
      if (response.status == 200) {
        tr.remove();
        // alert("Data deleted successfully !");
        // renderData();
      }
    } catch (error) {
      console.log(error);
      alert("data not deleted please try again");
    }
  });

  return tr;
}
// table create
const createTable = (data,type) => {
  const table = document.createElement("table");
  table.id=`${type.replace(/ /g, '-')}`
  table.className = "table  table-hover"; // Add Bootstrap classes for styling
  table.innerHTML = `
  <thead class="table-light">
    <tr>
      <th>Sr No.</th>
      <th>Title</th>
      ${type=="Ongoing-Research" ? `<th>Image</th>` : ""}
      <th>Description</th>
      <th>Type</th>
      <th>Action</th>
    </tr>
  </thead>
`;
console.log(data);
  // data iterate
  const tableBody = document.createElement("tbody");

  // let tableType;
  data.forEach((element, index) => {
    const tr = creatRow(element, index + 1);
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
  // return table;
  reasearchSection.appendChild(table);
  // console.log(data)
  table.insertAdjacentHTML("beforebegin", `<h1>${type}</h1>`);
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
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value;
  const description = descriptionInput.value;
  const type = typeInput.value;
  const image = imageInput.files[0];
  const addobject = {title,description,type};
  if(type=='Ongoing Research'){
    addobject.image = image
  }

  try {
    disableInputFields(true);
    let data =  await postData(addobject)
    data = data.research
    const tr = creatRow(data, 1);
    const tbody = document.querySelector(`#${data.type.replace(/ /g, '-')} tbody`);
    // console.log(data)
    console.log(tbody)
    tbody.appendChild(tr);
    form.reset();
    disableInputFields(false);
    // index++;
      // renderData();s
  } catch (error) {
    console.log(error)
    alert("Something went wrong !");
  }
});

function disableInputFields(disable) {
  titleInput.disabled = disable;
  descriptionInput.disabled = disable;
  imageInput.disabled = disable;
  typeInput.disabled = disable;
}
// window load
window.onload = renderData;
