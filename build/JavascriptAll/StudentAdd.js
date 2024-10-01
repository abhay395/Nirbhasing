// Variables for course and year
let currentCourse = document.getElementById("courseSelect").value;
let currentYear = document.getElementById("yearSelect").value;

let editIndex, editTable;

// Load course or year data on selection
// document.getElementById("courseSelect").addEventListener("change", loadCourseData);
// document.getElementById("yearSelect").addEventListener("change", loadYearData);

const loadCourseData = () =>
  loadTableData(getCurrentYear(), getCurrentCourse());
const loadYearData = () => loadTableData(getCurrentYear(), getCurrentCourse());

const getCurrentYear = () => document.getElementById("yearSelect").value;
const getCurrentCourse = () => document.getElementById("courseSelect").value;

const datanotFound = (tableId) => {
  const tableBody = document.getElementById(tableId).querySelector("tbody");
  tableBody.innerHTML = `<tr><td colspan="5" class='text-danger'>Data not found</td></tr>`;
};

const loadTableData = (examYear, course) => {
  fetch(
    `/student/getAll?examYear=${examYear}&course=${course}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length !== 0) {
        const yearData = data[0];
        console.log(yearData["1stYearStudents"])
        populateTable("firstYearTable", yearData["1stYearStudents"]);
        populateTable("secondYearTable", yearData["2ndYearStudents"]);
        populateTable("thirdYearTable", yearData["3rdYearStudents"]);
      } else {
        ["firstYearTable", "secondYearTable", "thirdYearTable"].forEach(
          datanotFound
        );
      }
    })
    .catch((error) => console.error("Error loading student data:", error));
};

const populateTable = (tableId, students = []) => {
  const tableBody = document.getElementById(tableId).querySelector("tbody");
  tableBody.innerHTML = students.length
    ? students
        .map((student, index) => createTableRow(student, index, tableId))
        .join("")
    : `<tr><td colspan="5" class='text-danger'>Data not found</td></tr>`;
};

const createTableRow = (student, index, tableId) => `
  <tr>
    <td>${student.name}</td>
    <td><img src="${student.image}" alt="student image"></td>
    <td>${student.cgpa}</td>
    <td>${student.rank}</td>
    <td>
      <button class="edit-btn" data-index="${student._id}" data-table="${tableId}">Edit</button>
      <button class="delete-btn" data-index="${student._id}" data-table="${tableId}">Delete</button>
    </td>
  </tr>
`;

const addStudent = async () => {
  const name = document.getElementById("newStudentName").value;
  const cgpa = parseFloat(document.getElementById("newStudentcgpa").value);
  const rank = parseInt(document.getElementById("newStudentRank").value);
  const year = document.getElementById("newStudentYear").value;
  const imageInput = document.getElementById("newStudentImage");
  const image = imageInput.files[0]; // Get the file object
  if (!name || isNaN(cgpa) || isNaN(rank) || !image) {
    return alert("Please fill out all fields");
  }

  //    function
  const formData = new FormData();
  formData.append("name", name);
  formData.append("cgpa", cgpa);
  formData.append("course", currentCourse);
  formData.append("year", year);
  formData.append("rank", rank);
  formData.append("examYear", parseInt(currentYear));
  formData.append("image", image);
  try {
    // Send a POST request using async/await
    const response = await fetch("/student/create", {
      method: "POST",
      body: formData,
    });

    // Clear form inputs upon successful response
    if (response.ok) {
        // name = "";
        // cgpa = "";
        // year = "";
        // rank = "";
        // image = "";
      alert('Student added successfully') 
    } else {
      throw new Error("Failed to upload student data");
    }
  } catch (error) {
    // Log the error and show an error alert
    console.error(error);
    alert("Something went wrong! Please try again.");
    return;
  }
  const newStudent = { name, cgpa, rank, image };
      const yearTableMap = {
        1: "firstYearTable",
        2: "secondYearTable",
        3: "thirdYearTable",
      };
      const tableId = yearTableMap[year];
      const tableBody = document.getElementById(tableId).querySelector("tbody");
      tableBody.insertAdjacentHTML(
        "beforeend",
        createTableRow(newStudent, tableBody.rows.length, tableId)
      );
      document.getElementById("addStudentForm").reset();
};

// Event delegation for edit and delete buttons
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    openEditModal(e.target.dataset.index, e.target.dataset.table);
  } else if (e.target.classList.contains("delete-btn")) {
    deleteStudent(e.target.dataset.index, e.target.dataset.table);
    // console.log(e.target.dataset.index, e.target.dataset.table);
  }
});

const openEditModal = (index, tableId) => {
  editIndex = index;
  editTable = tableId;

  const student = document.getElementById(tableId).querySelectorAll("tbody tr")[
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

const deleteStudent = async(id, tableId) => {
  try {
    // Send a POST request using async/await
    const response = await fetch(`/student/delete/${id}`, {
      method: "DELETE",
    });

    // Clear form inputs upon successful response
    if (response.ok) {
        // name = "";
        // cgpa = "";
        // year = "";
        // rank = "";
        // image = "";
      alert('Student Deleted successfully') 
    } else {
      throw new Error("Failed to delete student data");
    }
  } catch (error) {
    // Log the error and show an error alert
    console.error(error);
    alert("Something went wrong! Please try again.");
    return;
  }

  document.getElementById(tableId).querySelector("tbody").deleteRow(id);

};

// Initial data load on page load
window.onload = () => loadTableData(currentYear, currentCourse);

// document.addEventListener("DOMContentLoaded", async () => {
//   const navbarUl = document.querySelector("#navbarNav ul");
//   const login = document.querySelector("#login");
//   const adminPanelItem = createNavItem("Admin Panel", "/Pages/AdminPanel.html");
//   const loginItem = createNavItem("Login", "/Pages/Login.html");

//   try {
//     const response = await fetch("/check/myUser");
//     const data = await response.json();
//     navbarUl.appendChild(adminPanelItem);

//     console.log(data);
//   } catch (error) {
//     navbarUl.appendChild(loginItem);
//     console.error("Authentication check failed:", error);
//   }
// });

// // Helper function to create nav item
// function createNavItem(text, href) {
//   const li = document.createElement("li");
//   li.className = "nav-item";

//   const a = document.createElement("a");
//   a.className = "nav-link";
//   a.href = href;
//   a.textContent = text;

//   li.appendChild(a);
//   return li;
// }
