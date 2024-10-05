const tableSection = document.getElementById("table-section");
const newDescription = document.getElementById("new-event-news-Description");
const newType = document.getElementById("new-event-news-type");
const submitButton = document.getElementById("submitDataButton");

const getData = async () => {
  let responce = await fetch("/headline");
  let data = await responce.json();
  console.log(data);
  return data;
};

//  update data
const updateData = async ({ description }, id) => {
  console.log(id);
  const data = { description };
  try {
    const responce = await fetch(`/headline/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
const postData = async ({ description, type }) => {
  const data = { description, type };
  try {
    const responce = await fetch("/headline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await responce.json();
    return result;
  } catch (error) {
    console.log(error);
    // alert("data not added");
    return;
  }
};
//  render data
const renderData = async () => {
  tableSection.innerHTML = "";
  const data = (await getData()) || [];

  const news = data[0]["NewsHeadline"];
  const event = data[0]["Event"];
  const reqrutement = data[0]["Reqrutement"];
  createTable(news,'NEWS');
  createTable(event,'EVENT');
  createTable(reqrutement,"REQUIRETMENT");
};
// createTable
const createTable = (data,title) => {
  
  const h1 = document.createElement('h1');
  h1.className = 'text-center my-4'; // Centered text with margin
  h1.innerText = title;
  
  const table = document.createElement("table");
  table.className = 'table table-bordered table-hover'; // Bootstrap classes for the table
  table.innerHTML = `
      <thead class="table-light">
          <tr>
              <th>Sr. No.</th>
              <th>Type</th>
              <th>Description</th>
              <th>Action</th>
          </tr>
      </thead>`;
  
  const tableBody = document.createElement("tbody");
  data.forEach((element, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${element.type}</td>
          <td>${element.description}</td>
          <td>
              <button class='btn btn-warning btn-sm edit-button'>Edit</button>
              <button class='btn btn-danger btn-sm delete-button'>Delete</button>
          </td>
      `;
    const editBtn = tr.querySelector(".edit-button");
    const deleteBtn = tr.querySelector(".delete-button");
    //  edit button
    let editMode = false;
    editBtn.addEventListener("click", async () => {
      editMode = !editMode;

      if (editMode) {
        tr.querySelectorAll("td").forEach((td, index) => {
          
          const value = td.textContent;
          if (index == 2) {
            const id = "description-input-field";
            td.innerHTML = `<input id=${id} value ='${value}'>`;
          }
        });
        editBtn.innerText = "Save";
      } else {
        const description = tr.querySelector("#description-input-field").value;
        console.log(description);
        const id = element._id;

        const responce = await updateData({ description }, id);

        if (responce.status == 200) {
          tr.querySelectorAll("td").forEach((td, index) => {
            if (index === 2) {
              const input = td.querySelector("input");
              if (input) {
                td.innerHTML = input.value;
              }
            }
          });
          editBtn.innerText = "Edit";
        } else {
          alert("Failed to update data");
        }
      }
    });
    // delete button
    deleteBtn.addEventListener("click", async () => {
      try {
        const response = await deleteData(element._id);
        if (response.status == 200) {
          alert("data delete succesfully !");
          renderData();
        }
      } catch (err) {
        console.log(err);
        alert("data not deleted please try again");
      }
    });

    tableBody.appendChild(tr);
  });
  table.appendChild(tableBody);
  //  append table heading
  tableSection.appendChild(h1)
  // append table
  tableSection.appendChild(table);
};

// submit data
submitButton.addEventListener("click", async () => {
  const description = newDescription.value;
  const type = newType.value;
  console.log(description, type);
  if (description == "" || type == "Select Type") {
    alert("all field are required !");
    return;
  }
  try {
    await postData({ description, type }).then((data) => {
      if (data) {
        alert("data added");
      }
      renderData();
    });
  } catch (error) {
    console.log(error);
  }
});
window.onload = renderData;
