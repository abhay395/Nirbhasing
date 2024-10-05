const newCertificateName = document.getElementById("newCertificateName");
const newDescription = document.getElementById("newCertiDescription");
const newDuration = document.getElementById("newCertificateDuration");
const newSkills = document.getElementById("newCertificateSkills");
const newCertificationMode = document.getElementById("newCertificateMode");
const addCertificateBtn = document.getElementById("certificate-btn");
const tableSection = document.getElementById("certificate-section");
const getData = async () => {
  try {
    const responce = await fetch("http://localhost:8081/certification");
    const data = await responce.json();
    
    return data;
  } catch (err) {
    console.log(err);
  }
};

// data post on database
const postData = async (data) => {
  try {
    const responce = await fetch("/certification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = responce.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};
// update data on database;
const updateData = async (
  { name, description, duration, mode, skillsGained },
  id
) => {
  const data = { name, description, duration, mode, skillsGained };
  console.log(data);
  try {
    const responce = await fetch(`/certification/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(data);
    return responce;
  } catch (err) {
    console.log(err);
    alert("data not updated ");
    return;
  }
};
// delete data on database
const deleteData = async (id) => {
  try {
    const responce = await fetch(`/certification/${id}`, {
      method: "DELETE",
    });
    return responce;
  } catch (err) {
    console.log(err);
  }
};

// add data
addCertificateBtn.addEventListener("click", async (e) => {
  // tableSection.innerHTML=''
  e.preventDefault();
  const name = newCertificateName.value;
  const duration = newDuration.value;
  const mode = newCertificationMode.value;
  const skillsGained = newSkills.value;
  const description = newDescription.value;

  if (!name || !duration || !mode || !skillsGained) {
    alert("All filed required");
  }

  try {
    const data = { name, description, duration, mode, skillsGained };
    await postData(data).then((data) => {
      if (data) {
        alert("data added");
      }
      createTable();
    });
  } catch (err) {
    console.log(err);
  }
});

// data render on table
const createTable = async () => {
  tableSection.innerHTML = "";
  const data = (await getData()) || [];
  const table = document.createElement("table");
  table.innerHTML = `<thead>
        <tr>
        <th>Sr No.</th>
        <th>Certificate</th>
        <th>Description</th>
        <th>Duration</th>
        <th>Mode</th>
        <th>Skill Gained</th>
        <th>Action</th>
        </tr>
    </thead>`;

  const tableBody = document.createElement("tbody");
  data.forEach((element, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${element.name}</td>
        <td>${element.description}</td>
        <td>${element.duration}</td>
        <td>${element.mode}</td>
        <td>${element.skillsGained}</td>
        <td>
            <button class='edit-btn'> Edit</button>
            <button class='delete-btn'>Delete </button>
        </td>
        `;
    // edit event listener
    const editBtn = tr.querySelector(".edit-btn");
    let editMode = false;
    editBtn.addEventListener("click", async () => {
      editMode = !editMode;
      if (editMode) {
        tr.querySelectorAll("td").forEach((td, index) => {
          const value = td.textContent;
          let id;
          if (index == 1) id = "name";
          if (index == 2) id = "description";
          if (index == 3) id = "duration";
          // if (index == 4) id = "mode";
          if (index == 5) id = "skills";
          if (index != 0 && index !=4 && index <= 5) {
            td.innerHTML = `<input id=${id} value='${value}'>`;
          }
        });
        editBtn.innerText = "Save";
      } else {
        const name = tr.querySelector("#name").value;
        const duration = tr.querySelector("#duration").value;
        const mode = tr.querySelector("#mode").value;
        const description = tr.querySelector("#description").value;
        const skillsGained = tr.querySelector("#skills").value;
        const id = element._id;
        const responce = await updateData(
          { name, description, duration, mode, skillsGained },
          id
        )
        if (responce.status == 200)
          tr.querySelectorAll("td").forEach((td, index) => {
            if (index != 0 && index <= 5) {
              const input = td.querySelector("input");
              if (input) {
                td.innerHTML = input.value;
              }
            }
          });
        editBtn.innerText = "Edit";
      }
    });
    // delete event listener
    const deleteBtn = tr.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async () => {
      try {
        const responce = await deleteData(element._id);
        if (responce.ok) createTable();
      } catch (error) {
        console.log(error);
        alert("data not deleted please try again");
      }
    });
    // append table row
    tableBody.appendChild(tr);
  });
  // append table body
  table.appendChild(tableBody);
  // append table
  tableSection.appendChild(table);
};

// load table;
window.onload = createTable();
