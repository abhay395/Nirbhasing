let currentCourse = "BCA"; // Default course
let currentYear = "2023";
let editIndex, editTable; // Variables for editing

const loadCourseData = () => {
  currentCourse = document.getElementById("courseSelect").value;
  console.log(currentCourse)
  loadTableData();
};

const loadYearData = () => {
  currentYear = document.getElementById("yearSelect").value;
  console.log(currentYear)
  loadTableData();
};
const loadTableData = (examyear) => {
  fetch(`http://localhost:8081/student/getAll?examYear=${examyear}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // const courseData = {
      //     "BCA_2023": data[0],
      //     "Bsc.cs_2022": data[1],
      //     "Msc.cs_2022": data[2]
      // };
      // const selectedCourse = courseData[currentCourse];
      // populateTable("firstYearTable", selectedCourse["1stYearStudents"]);
      // populateTable("secondYearTable", selectedCourse["2ndYearStudents"]);
      // populateTable("thirdYearTable", selectedCourse["3rdYearStudents"]);
    })
    .catch((error) => console.error("Error loading student data:", error));
};

const populateTable = (tableId, students) => {
  const tableBody = document.getElementById(tableId).querySelector("tbody");
  tableBody.innerHTML = "";
  students.forEach((student, index) => {
    const row = `
            <tr>
                <td>${student.name}</td>
                <td><img src="${student.image}" alt="student image"></td>
                <td>${student.cgpa}</td>
                <td>${student.rank}</td>
                <td>
                    <button class="edit-btn" onclick="openEditModal(${index}, '${tableId}')">Edit</button>
                    <button class="delete-btn" onclick="deleteStudent(${index}, '${tableId}')">Delete</button>
                </td>
            </tr>
        `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
};

const addStudent = () => {
  const name = document.getElementById("newStudentName").value;
  const cgpa = parseFloat(document.getElementById("newStudentcgpa").value);
  const rank = parseInt(document.getElementById("newStudentRank").value);
  const year = document.getElementById("newStudentYear").value;
  const image = document.getElementById("newStudentImage").value;

  if (name && cgpa && rank && image) {
    const newStudent = { name, cgpa, rank, image };
    const yearTableMap = {
      "1stYear": "firstYearTable",
      "2ndYear": "secondYearTable",
      "3rdYear": "thirdYearTable",
    };
    populateTable(yearTableMap[year], [
      ...document
        .getElementById(yearTableMap[year])
        .querySelectorAll("tbody tr"),
      newStudent,
    ]);
    document.getElementById("addStudentForm").reset();
  } else {
    alert("Please fill out all fields");
  }
};

const openEditModal = (index, table) => {
  editIndex = index;
  editTable = table;

  const student = document.getElementById(table).querySelectorAll("tbody tr")[
    index
  ];
  document.getElementById("studentName").value = student.cells[0].innerText;
  document.getElementById("studentCgpa").value = student.cells[2].innerText;
  document.getElementById("studentRank").value = student.cells[3].innerText;

  document.getElementById("editModal").style.display = "flex";
};

const saveEdit = () => {
  const student = document
    .getElementById(editTable)
    .querySelectorAll("tbody tr")[editIndex];
  student.cells[0].innerText = document.getElementById("studentName").value;
  student.cells[2].innerText = document.getElementById("studentCgpa").value;
  student.cells[3].innerText = document.getElementById("studentRank").value;

  closeModal();
};

const closeModal = () => {
  document.getElementById("editModal").style.display = "none";
};

const deleteStudent = (index, table) => {
  const tableBody = document.getElementById(table).querySelector("tbody");
  tableBody.deleteRow(index);
};

// Load the initial data on page load
window.onload = loadTableData(currentYear);
