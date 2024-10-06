// Cache DOM elements to avoid repeated querying
const studentSection = document.querySelector("#studentSection");
const form = document.querySelector("form");
const selectYearInput = document.querySelector("#year");
const selectCourseInput = document.querySelector("#course");
const selectExamYear = document.querySelector("#examyear");
const nameInput = document.querySelector("#name");
const cgpaInput = document.querySelector("#cgpa");
const rankInput = document.querySelector("#rank");
const imageInput = document.querySelector("#image");

// Cache tbody elements for year tables
const tbodyFor1st = document.querySelector("#year1 tbody");
const tbodyFor2nd = document.querySelector("#year2 tbody");
const tbodyFor3rd = document.querySelector("#year3 tbody");

let examYear = selectExamYear.value;
let course = selectCourseInput.value;

// Function to handle API requests
const fetchRequest = async (url, method, formData) => {
  try {
    const response = await fetch(url, { method, body: formData });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Function to create FormData from an object
const createFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};

// Update student data
const updateData = (data, id) => {
  const formData = createFormData(data);
  return fetchRequest(`/student/update/${id}`, "PUT", formData);
};

// Create a new student entry
const postData = (data) => {
  const formData = createFormData(data);
  return fetchRequest("/student/create", "POST", formData);
};

// Delete student by ID
const deleteStudent = (id) => fetchRequest(`/student/delete/${id}`, "DELETE");

// Event listener for form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentData = {
    name: nameInput.value,
    cgpa: cgpaInput.value,
    course: selectCourseInput.value,
    year: selectYearInput.value,
    rank: parseFloat(rankInput.value),
    image: imageInput.files[0],
    examYear: selectExamYear.value
  };

  try {
    let data = await postData(studentData);
    data = data.json();
    if (data) {
      data = data.student;
      const tr = createStudentRow(data);
      appendStudentRow(tr, data.year);
    }
  } catch (error) {
    console.error(error);
  }
});

// Create a student row dynamically
const createStudentRow = (data) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${data.name}</td>
    <td><img src="${data.image}" alt="student image" style="width:50px;"></td>
    <td>${data.cgpa}</td>
    <td>${data.rank}</td>
    <td>
      <button class="EditBtn">Edit</button>
      <button class="DeleteBtn">Delete</button>
    </td>`;

  const EditBtn = tr.querySelector(".EditBtn");
  const DeleteBtn = tr.querySelector(".DeleteBtn");

  // Edit button functionality
  EditBtn.addEventListener("click", () => handleEdit(tr, data));

  // Delete button functionality
  DeleteBtn.addEventListener("click", async () => {
    const res = await deleteStudent(data._id);
    if (res && res.status === 200) tr.remove();  // Remove the row from the DOM
  });

  return tr;
};

// Append student row to the correct year's table
const appendStudentRow = (tr, year) => {
  let tbody;
  switch (year) {
    case "1":
      tbody = tbodyFor1st;
      break;
    case "2":
      tbody = tbodyFor2nd;
      break;
    case "3":
      tbody = tbodyFor3rd;
      break;
  }
  if (tbody) {
    tbody.appendChild(tr);
    sortStudent(tbody);  // Sort rows after appending
  }
};

// Handle editing of a student row
const handleEdit = async (tr, data) => {
  const EditBtn = tr.querySelector(".EditBtn");
  let EditMode = EditBtn.innerText === "Edit";

  if (EditMode) {
    tr.querySelectorAll("td").forEach((td, index) => {
      if (index !== 1 && index < 4) {
        const value = td.innerText;
        const id = index === 0 ? "name" : index === 2 ? "cgpa" : "rank";
        td.innerHTML = `<input id="${id}" value="${value}" />`;
      }
    });
    EditBtn.innerText = "Save";
  } else {
    const updatedData = {
      name: tr.querySelector("#name").value,
      cgpa: parseFloat(tr.querySelector("#cgpa").value),
      rank: parseInt(tr.querySelector("#rank").value),
    };

    const res = await updateData(updatedData, data._id);
    if (res && res.status === 200) {
      tr.querySelectorAll("td").forEach((td, index) => {
        if (index !== 1 && index < 4) {
          const input = td.querySelector("input");
          if (input) td.innerText = input.value;  // Update the cell with the new value
        }
      });
      sortStudent(tr.parentElement);
      EditBtn.innerText = "Edit";
    }
  }
};

// Sort students by CGPA
const sortStudent = (tbody) => {
  const studentArr = Array.from(tbody.children);
  studentArr.sort((a, b) => {
    const cgpaA = parseFloat(a.querySelector("td:nth-child(3)").innerText);
    const cgpaB = parseFloat(b.querySelector("td:nth-child(3)").innerText);
    return cgpaB - cgpaA;
  });
  studentArr.forEach((student) => tbody.appendChild(student));  // Append sorted rows
};

// Fetch and render data
const getData = () => fetch(`/student/getAll?examYear=${examYear}&course=${course}`)
  .then((response) => response.json())
  .catch((error) => {
    console.error(error);
    return [];
  });

// Render the data based on selected year and course
const renderData = async () => {
  studentSection.innerHTML = "";
  const data = await getData();
  const years = ["1stYearStudents", "2ndYearStudents", "3rdYearStudents", "4thYearStudents"];
  years.forEach((yearKey, index) => {
    const students = data[0][yearKey];
    if (students) {
      const table = createTable(students, `${index + 1} Year Students`);
      studentSection.appendChild(table);
    }
  });
};

// Create table for student data
const createTable = (students, yearName) => {
  const table = document.createElement("table");
  table.className = "table table-hover";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Image</th>
        <th>CGPA</th>
        <th>Rank</th>
        <th>Actions</th>
      </tr>
    </thead>`;
  const tbody = document.createElement("tbody");
  students.forEach((student) => tbody.appendChild(createStudentRow(student)));
  table.appendChild(tbody);
  return table;
};

// Event listeners for input changes
selectExamYear.addEventListener("change", (e) => {
  examYear = e.target.value;
  renderData();
});

selectCourseInput.addEventListener("change", (e) => {
  course = e.target.value;
  renderData();
});

// Initial rendering of data
renderData();
