const tableSection = document.getElementById("table-section");
const newDescription = document.getElementById("new-event-news-Description");
const newType = document.getElementById("new-event-news-type");
const submitButton = document.getElementById("submitDataButton");
const form = document.querySelector("form");
const pdfInput = document.querySelector("#pdfInput input");

newType.addEventListener("change", (e) => {
  const pdfInputDiv = pdfInput.parentElement;
  if (e.target.value === "Certificate") {
    console.log(pdfInputDiv);
    pdfInputDiv.style.display = "block";
  } else {
    // const pdfInput = document.getElementById("pdfInput");
    pdfInputDiv.style.display = "none";
  }
});
const getData = async () => {
  let responce = await fetch("/headline");
  let data = await responce.json();
  console.log(data);
  return data;
};

//  update data
const updateData = async (updateObje, id) => {
  console.log(id);
  const formData = new FormData();
  formData.append("description", updateObje.description);
  if(updateObje.pdf){
    formData.append("pdf", updateObje.pdf);
  }
  // const data = { description };
  try {
    const responce = await fetch(`/headline/${id}`, {
      method: "PUT",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: formData,
    });
    return responce;
  } catch (error) {
    console.log(error);
  }
};
// delete
const deleteData = async (id) => {
  try {
    const response = await fetch(`/headline/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};
// post data
const postData = async (description, type, pdf) => {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("type", type);
  if (type === "Certificate") {
    formData.append("pdf", pdf);
  }
  try {
    const responce = await fetch("/headline", {
      method: "POST",
      body: formData,
    });
    return responce;
  } catch (error) {
    console.log(error);
    // alert("data not added");
    return null;
  }
};
//  render data
const renderData = async () => {
  tableSection.innerHTML = "";
  const data = (await getData()) || [];

  const news = data[0]?.NewsHeadline;
  const event = data[0]?.Event;
  const Certificate = data[0]?.Certificate;
  createTable(news, "News");
  createTable(event, "Event");
  createTable(Certificate, "Certificate");
};
function createRow(element, index) {
  const tr = document.createElement("tr");
  
  // Avoid potential XSS by safely setting innerHTML
  const sanitizeHTML = (str) => {
    const tempDiv = document.createElement("div");
    tempDiv.textContent = str;
    return tempDiv.innerHTML;
  };

  const type = sanitizeHTML(element?.type || "");
  const description = sanitizeHTML(element?.description || "");
  const pdfLink = element?.type === "Certificate" && element?.pdf ? 
                  `<a href="${sanitizeHTML(element.pdf)}" target="_blank" rel="noopener noreferrer">View</a>` : "";
  
  tr.innerHTML = `
    <td>${sanitizeHTML(index.toString())}</td>
    <td>${type}</td>
    <td>${description}</td>
   ${ element?.type === "Certificate" && element?.pdf? `<td>${pdfLink}</td>`:""}
    <td>
      <button class='btn btn-warning btn-sm edit-button'>Edit</button>
      <button class='btn btn-danger btn-sm delete-button'>Delete</button>
    </td>
  `;

  const editBtn = tr.querySelector(".edit-button");
  const deleteBtn = tr.querySelector(".delete-button");

  let editMode = false;
  
  // Handle edit button functionality
  editBtn.addEventListener("click", async () => {
    editMode = !editMode;
    const descriptionCell = tr.querySelector("td:nth-child(3)");
    const pdfCell = element.type === "Certificate" ? tr.querySelector("td:nth-child(4)") : null;

    if (editMode) {
      const descriptionValue = sanitizeHTML(descriptionCell.textContent);
      descriptionCell.innerHTML = `<input id="description-input-field" value="${descriptionValue}" />`;

      if (element.type === "Certificate") {
        pdfCell.innerHTML = `<input id="pdf-input-field" type="file" />`;
      }
      editBtn.innerText = "Save";
    } else {
      // Gather updated data
      const updatedDescription = tr.querySelector("#description-input-field").value;
      // console.log(updatedDescription);
      const updateObj = { description: sanitizeHTML(updatedDescription) };
      
      if (element.type === "Certificate") {
        const pdfFile = tr.querySelector("#pdf-input-field").files[0];
        if (pdfFile) {
          updateObj.pdf = pdfFile;
        }
      }

      try {
        const response = await updateData(updateObj, element._id);
        if (response.ok) {
          const updatedElement = await response.json();
          const newDescription = sanitizeHTML(updatedElement?.headline?.description || "");
          descriptionCell.innerHTML = newDescription;

          if (updatedElement?.headline?.pdf && pdfCell) {
            const newPdfLink = sanitizeHTML(updatedElement.headline.pdf);
            pdfCell.innerHTML = `<a href="${newPdfLink}" target="_blank" rel="noopener noreferrer">View</a>`;
          }
          
          editBtn.innerText = "Edit";
        } else {
          alert("Failed to update data");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while updating the data.");
      }
    }
  });

  // Handle delete button functionality
  deleteBtn.addEventListener("click", async () => {
    try {
      const response = await deleteData(element._id);
      if (response.ok) {
        tr.remove();
      } else {
        alert("Failed to delete data. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the data.");
    }
  });

  return tr;
}

// createTable
const createTable = (data, title) => {
  const h1 = document.createElement("h1");
  h1.className = "text-center my-4"; // Centered text with margin
  h1.innerText = title;

  const table = document.createElement("table");
  table.className = "table table-bordered table-hover"; // Bootstrap classes for the table
  table.id = `${title}`;
  table.innerHTML = `
      <thead class="table-light">
          <tr>
              <th>Sr. No.</th>
              <th>Type</th>
              <th>Description</th>
              ${title == "Certificate" ? `<th>PDF</th>` : ""}
              <th>Action</th>
          </tr>
      </thead>`;

  const tableBody = document.createElement("tbody");
  data?.forEach((element, index) => {
    const tr = createRow(element, index + 1);
    tableBody.appendChild(tr);
  });
  table.appendChild(tableBody);
  //  append table heading
  tableSection.appendChild(h1);
  // append table
  tableSection.appendChild(table);
};

// submit data
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const description = newDescription.value;
  const type = newType.value;
  if(type=="Certificate"){
    pdfInput.required = true;
  }
  const pdf = pdfInput.files[0];
  try {
    const respones = await postData(description, type, pdf);
    if (respones.ok) {
      let data = await respones.json();
      data = data.headlines;
      const tr = createRow(data, 1);
      let tbody;
      if(type == "News"){
        tbody = document.querySelector("#News tbody");
      }
      else if(type == "Event"){
        tbody = document.querySelector("#Event tbody");
      }
      else if(type == "Certificate"){
        tbody = document.querySelector("#Certificate tbody");
      }
      tbody.appendChild(tr);
      form.reset();
    }else{
      alert("Failed to add data");
    }
  } catch (error) {
    console.log(error);
  }
});
window.onload = renderData;
