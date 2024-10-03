// const { session } = require("passport");

const tableContainer = document.getElementById("tableContainer");
// const selectSession = document.getElementById("sessionSelect");
const tableTitle = document.querySelector("table #tableTitle");
const tbody = document.querySelector("tbody");
const date = new Date();

let session = `Jan ${date.getFullYear()} - Apr ${date.getFullYear()}`;
if (date.getMonth() >= 6 && date.getMonth() <= 11) {
  session = `July ${date.getFullYear()} - Dec ${date.getFullYear()}`;
}
// tableTitle.innerHTML = ` <span style="font-size: 14pt;"><strong>
//               Session: ${session} (Sem. "A")</strong></span>`;

const getData = async () => {
  try {
    const response = await fetch(`/timeTable?session=${session}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};
// let timeTable = await getTimeTableData();
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
                  ? `<a href="${element.timeTable}" target="_blank">view</a>`
                  : "Comming Soon"
              }</td>
              <td>${
                element.cce != "Comming Soon"
                  ? `<a href="${element.cce}" target="_blank">view</a>`
                  : "Comming Soon"
              }</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
};
const renderTimeTable = async () => {
  let timeTable = await getData();
  if (timeTable.length== 0) {
    timeTable = [
      {
        courseName: "BCA",
        timeTable: "Comming Soon",
        cce: "Comming Soon",
      },
      {
        courseName: "Bsc.cs",
        timeTable: "Comming Soon",
        cce: "Comming Soon",
      },
      {
        courseName: "Msc.cs",
        timeTable: "Comming Soon",
        cce: "Comming Soon",
      },
    ]
    // console.log(timeTable);
  }
  const table = createTable(timeTable);
  tableContainer.appendChild(table);
};
renderTimeTable();
// function loader hide

