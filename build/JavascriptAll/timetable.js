// const { session } = require("passport");

const tableContainer = document.getElementById("tableContainer");
const selectSession = document.getElementById("sessionSelect");
const tableTitle = document.querySelector("table #tableTitle");
const tbody = document.querySelector('tbody');
const date = new Date();

let session = `Jan ${date.getFullYear()} - Apr ${date.getFullYear()}`;
if (date.getMonth() >= 6 && date.getMonth() <= 11) {
  session = `July ${date.getFullYear()} - Dec ${date.getFullYear()}`;
}
tableTitle.innerHTML = ` <span style="font-size: 14pt;"><strong>
              Session: ${session} (Sem. "A")</strong></span>`;

const getTimeTableData = async () => {
  try {
    const response = await fetch(`/timeTable?session=${session}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
// let timeTable = await getTimeTableData();
const renderTimeTable =async()=>{
  let timeTable = await getTimeTableData();
  console.log(timeTable);
  if (timeTable.length > 0) {
    timeTable.forEach((element,index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<th scope="row">${index+1}</th>
              <td>${element.courseName}</td>
              <td>${element.timeTable!="Comming Soon"?`<a href="${element.timeTable}" target="_blank">view</a>`:"Comming Soon"}</td>
              <td>${element.cce!="Comming Soon"?`<a href="${element.cce}" target="_blank">view</a>`:"Comming Soon"}</td>`

              tbody.appendChild(tr);
    })
    // console.log(timeTable);
  }else{
    tbody.innerHTML=` 
            <tr>
              <th scope="row">1</th>
              <td>BCA</td>
              <td>Comming Soon</td>
              <td>Comming Soon</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Bsc.cs</td>
              <td>Comming Soon</td>
              <td>Comming Soon</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Msc.cs</td>
              <td>Comming Soon</td>
              <td>Comming Soon</td>
            </tr>
        `
  }
}
renderTimeTable();
// function loader hide
function loader() {
  document.getElementById("loader").remove();
}
