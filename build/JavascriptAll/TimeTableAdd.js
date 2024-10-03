const selectForSession = document.querySelector("#courseSession");
const selectForCourse = document.querySelector("#courseName");
const selectTimeTableFor = document.querySelector("#timeTableFor");
const form = document.querySelector("form");
const pdfInput = document.querySelector("#timetablePdf");
const tableContainer = document.getElementById("tableContainer");
const date = new Date();

let session = `Jan ${date.getFullYear()} - Apr ${date.getFullYear()}`;
if (date.getMonth() >= 6 && date.getMonth() <= 11) {
  session = `July ${date.getFullYear()} - Dec ${date.getFullYear()}`;
}
// console.log(date.getFullYear());
const sessions = [
  `Jan ${date.getFullYear()} - Apr ${date.getFullYear()}`,
  `July ${date.getFullYear()} - Dec ${date.getFullYear()}`,
  `Jan ${date.getFullYear() + 1} - Apr ${date.getFullYear() + 1}`,
  `July ${date.getFullYear() + 1} - Dec ${date.getFullYear() + 1}`,
];

sessions.forEach((el) => {
  const option = document.createElement("option");
  option.value = el;
  option.text = el;
  selectForSession.appendChild(option);
});
selectForSession.value = session;

const postData = async (name, session, type, pdf) => {
  try {
    const formData = new FormData();
    formData.append("courseName", name);
    formData.append("courseSession", session);
    formData.append("type", type);
    formData.append("pdf", pdf);
    const response = await fetch(`/timeTable`, {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    return [];
  }
};
const getData = async () => {
  try {
    const response = await fetch(`/timeTable?session=${session}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};
const timeTablesDelete = async (id) => {
  try {
    const response = await fetch(`/timeTable/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    return null;
  }
};
const updateData = async (type, pdf, id) => {
  try {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("pdf", pdf);
    console.log(id);
    const response = await fetch(`/timeTable/${id}`, {
      method: "PUT",
      body: formData,
    });
    return response;
  } catch (error) {
    return null;
  }
};
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const courseName = selectForCourse.value;
    const courseSession = selectForSession.value;
    const type = selectTimeTableFor.value;
    const pdf = pdfInput.files[0];
    console.log(courseName, courseSession, type, pdf);
    const data = await postData(courseName, courseSession, type, pdf);
    if (data.status == 200) {
      alert("Time Table Added ");
      selectForCourse.value = "";
      selectForSession.value = "";
      selectTimeTableFor.value = "";
      pdfInput.value = "";
      tableContainer.innerHTML = "";
      renderTimeTable();
    }
  } catch (error) {}
});
const createTable = (data) => {
  const table = document.createElement("table");
  table.classList.add("table", "table-hover", "table-bordered", "mt-5");
  const thead = document.createElement("thead");
  thead.innerHTML = `<tr class="bg-dark text-white">
            <td colspan="4" style="vertical-align: middle; text-align: center" id="tableTitle">
              <span style="font-size: 14pt;"><strong id="sessionName">
             Session: ${session}</strong></span>
            </td>
          </tr>
          <tr class="bg-light">
            <th scope="col" style="width: 10%;">S No.</th>
            <th scope="col" style="width: 30%;">Course and Year</th>
            <th scope="col" style="width: 30%;">Time-Table</th>
            <th scope="col" style="width: 30%;">CCE</th>
            <th scope="col" style="width: 30%;">Action</th>
          </tr>
          `;
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  data.forEach((element, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<th scope="row">${index + 1}</th>
              <td>${element.courseName}</td>
              <td>${
                element.timeTable != "Comming Soon"
                  ? `<div id="timeTable">
                  <p id='pdfArea'><a href="${element.timeTable}" target="_blank">view</a>
                  </p>
                  <input type="file" id="updatePdf" accept="application/pdf" style="display: none;"/> <button id="updateBtn">update</button></div>`
                  : ` <div id="timeTable">
                 <p id="pdfArea">Comming Soon</p>
                  <input type="file" id="updatePdf" accept="application/pdf" style="display: none;"/>
                  <button id="updateBtn">Add</button>
                  </div>`
              }</td>
              <td>${
                element.cce != "Comming Soon"
                  ? `<div id="cce">
                  <p id='pdfArea' ><a href="${element.cce}" id='pdfArea' target="_blank">view</a>
                  </p>
                  <input type="file" id="updatePdf" accept="application/pdf" style="display: none;"/> <button id="updateBtn">update</button></div>`
                  : `<div id="cce">
                 <p id="pdfArea">Comming Soon</p>
                  <input type="file" id="updatePdf" accept="application/pdf" style="display: none;"/>
                  <button id="updateBtn">Add</button>
                  </div>`
              }</td>
              <td><button id="DeleteBtn">Delete</button>
              </td>
              `;
    let updateBtns = tr.querySelectorAll("#updateBtn");
    updateBtns = Array.from(updateBtns);
    // console.log(updateBtns)
    let edite = false;
    // Add event listeners for update buttons for timetable and CCE
    updateBtns.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const parentDiv = e.target.parentElement;
        const typeToUpdate = parentDiv.id; // Either 'timeTable' or 'cce'
        console.log(parentDiv);
        // Show file input to upload a new file
        const updatePdfInput = e.target.previousElementSibling;
        console.log(updatePdfInput);
        updatePdfInput.style.display = "block";
        if (
          updatePdfInput.style.display == "block" &&
          updatePdfInput.files[0]
        ) {
          try {
            const res = await updateData(
              typeToUpdate,
              updatePdfInput.files[0],
              element._id
            );
            if (res.status == 200) {
              alert("Time Table Updated");
              updatePdfInput.style.display = "none";
              tableContainer.innerHTML = "";
              // const data = await res.json()
              // const pdfArea = e.target.parentElement.querySelector("#pdfArea");
              // console.log(pdfArea);
              renderTimeTable();
              // pdfArea.innerHTML = `<a href="${data.url}" target="_blank">view</a>`
            }
          } catch (error) {
            console.log(error);
          }
        }

        // Event listener to handle file selection and update process
      });
    });

    const DeleteBtn = tr.querySelector("#DeleteBtn");
    DeleteBtn.addEventListener("click", async (e) => {
      try {
        const res = await timeTablesDelete(element._id);
        if (res.status == 200) {
          const parentElement =
            e.target.parentElement.parentElement.parentElement;
          parentElement.removeChild(e.target.parentElement.parentElement);
        }
      } catch (error) {
        console.log(error);
      }
    });

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
};

const renderTimeTable = async () => {
  let timeTable = await getData();
  const table = createTable(timeTable);
  tableContainer.appendChild(table);
};

document.addEventListener("DOMContentLoaded", renderTimeTable);
// renderTimeTable();
