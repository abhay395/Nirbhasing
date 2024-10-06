// Cached DOM elements to avoid redundant queries
const selectForSession = document.querySelector("#courseSession");
const selectForCourse = document.querySelector("#courseName");
const selectTimeTableFor = document.querySelector("#timeTableFor");
const form = document.querySelector("form");
const pdfInput = document.querySelector("#timetablePdf");
const tableContainer = document.getElementById("tableContainer");
const date = new Date();

// Generate current and future sessions
const currentYear = date.getFullYear();
let index =1;
let session = date.getMonth() >= 6 ? `July ${currentYear} - Dec ${currentYear}` : `Jan ${currentYear} - Apr ${currentYear}`;
const sessions = [
  `Jan ${currentYear} - Apr ${currentYear}`,
  `July ${currentYear} - Dec ${currentYear}`,
  `Jan ${currentYear + 1} - Apr ${currentYear + 1}`,
  `July ${currentYear + 1} - Dec ${currentYear + 1}`,
];

// Populate sessions dropdown
sessions.forEach(el => {
  const option = document.createElement("option");
  option.value = el;
  option.text = el;
  selectForSession.appendChild(option);
});
selectForSession.value = session;

// Helper functions for API calls
const postData = async (name, session, type, pdf) => {
  const formData = new FormData();
  formData.append("courseName", name);
  formData.append("courseSession", session);
  formData.append("type", type);
  formData.append("pdf", pdf);

  try {
    const response = await fetch("/timeTable", { method: "POST", body: formData });
    return response.json();
  } catch (error) {
    console.error("Error posting data:", error);
    return null;
  }
};

const getData = async () => {
  try {
    const response = await fetch(`/timeTable?session=${session}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const deleteTimeTable = async (id) => {
  try {
    const response = await fetch(`/timeTable/${id}`, { method: "DELETE" });
    return response.status === 200;
  } catch (error) {
    console.error("Error deleting time table:", error);
    return false;
  }
};

const updateData = async (type, pdf, id) => {
  const formData = new FormData();
  formData.append("type", type);
  formData.append("pdf", pdf);

  try {
    const response = await fetch(`/timeTable/${id}`, { method: "PUT", body: formData });
    return response.json();
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
};

// Helper to handle adding rows to the table
const addTableRow = (data, tableBody) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <th scope="row">${index}</th>
    <td>${data.courseName}</td>
    <td>${createTimeTableCell(data.timeTable)}</td>
    <td>${createTimeTableCell(data.cce)}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;
  index++;
  tableBody.appendChild(tr);

  // Attach event listeners
  attachUpdateListeners(tr, data);
  attachDeleteListener(tr, data._id);
};

const createTimeTableCell = (pdfLink) => {
  return pdfLink !== "Comming Soon"
    ? `<div class="pdf-container"><p class="pdf-link"><a href="${pdfLink}" target="_blank">view</a></p>
        <input type="file" class="update-input" style="display:none;" accept="application/pdf"/>
        <button class="update-btn">update</button></div>`
    : `<div class="pdf-container"><p class="pdf-link">Coming Soon</p>
        <input type="file" class="update-input" style="display:none;" accept="application/pdf"/>
        <button class="update-btn">update</button></div>`;
};

const attachUpdateListeners = (row, data) => {
  const updateButtons = row.querySelectorAll(".update-btn");
  updateButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const parentDiv = e.target.parentElement;
      const typeToUpdate = parentDiv.classList.contains("timeTable") ? "timeTable" : "cce";
      const updatePdfInput = parentDiv.querySelector(".update-input");
      updatePdfInput.style.display = "block";

      if (updatePdfInput.files[0]) {
        const updatedData = await updateData(typeToUpdate, updatePdfInput.files[0], data._id);
        if (updatedData) {
          const pdfArea = parentDiv.querySelector(".pdf-link");
          pdfArea.innerHTML = `<a href="${updatedData[typeToUpdate]}" target="_blank">view</a>`;
          // btn.innerHTML='update';
          // parentDiv.querySelector("a").href = updatedData[typeToUpdate];
          updatePdfInput.style.display = "none";
          alert(`${typeToUpdate} Updated`);
        }
      }
    });
  });
};

const attachDeleteListener = (row, id) => {
  const deleteButton = row.querySelector(".delete-btn");
  deleteButton.addEventListener("click", async () => {
    const isDeleted = await deleteTimeTable(id);
    if (isDeleted) row.remove();
  });
};

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const courseName = selectForCourse.value;
  const courseSession = selectForSession.value;
  const type = selectTimeTableFor.value;
  const pdf = pdfInput.files[0];

  const data = await postData(courseName, courseSession, type, pdf);
  if (data) {
    alert("Time Table Added");
    const tableBody = tableContainer.querySelector("tbody");
    addTableRow(data, tableBody);

    // Clear form
    selectForCourse.value = "";
    selectTimeTableFor.value = "";
    pdfInput.value = "";
  }
});

// Create and render table
const createTable = (data) => {
  const table = document.createElement("table");
  table.classList.add("table", "table-hover", "table-bordered", "mt-5");
  table.innerHTML = `
    <thead>
      <tr class="bg-dark text-white">
        <td colspan="5" class="text-center">Session: ${session}</td>
      </tr>
      <tr class="bg-light">
        <th scope="col">S No.</th>
        <th scope="col">Course and Year</th>
        <th scope="col">Time-Table</th>
        <th scope="col">CCE</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");

  data.forEach((element) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <th scope="row">${index}</th>
      <td>${element.courseName}</td>
      <td>${createTimeTableCell(element.timeTable)}</td>
      <td>${createTimeTableCell(element.cce)}</td>
      <td><button class="delete-btn">Delete</button></td>
    `;
    tbody.appendChild(tr);
    attachUpdateListeners(tr, element);
    attachDeleteListener(tr, element._id);
    // index++;
  });

  return table;
};

const renderTimeTable = async () => {
  const timeTableData = await getData();
  const table = createTable(timeTableData);
  tableContainer.appendChild(table);
};

document.addEventListener("DOMContentLoaded", renderTimeTable);
