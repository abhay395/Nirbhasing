let editIndex, editTable;

// Load Teacher Data from API
const loadTeacherData = () => {
  fetch("http://localhost:8081/teacher")
    .then((response) => response.json())
    .then((data) => {
      populateTable(data);
    })
    .catch((error) => console.error("Error loading teacher data:", error));
};

// Populate the teacher table
const populateTable = (teachers) => {
  const tableBody = document
    .getElementById("teacherTable")
    .querySelector("tbody");
  tableBody.innerHTML = "";

  teachers.forEach((teacher) => {
    console.log(teacher._id);
    const row = `
            <tr>
                <td>${teacher.name}</td>
                <td><img src="${teacher.image}" alt="teacher image"></td>
                <td>${teacher.qualification}</td>
                <td>${teacher.email}</td>
                <td>${teacher.post}</td>
                <td>
                    <button class="edit-btn" onclick="openEditModal(${teacher._id})">Edit</button>
                    <button class="delete-btn" onclick="deleteTeacher(${teacher._id})">Delete</button>
                </td>
            </tr>
        `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
};


// Add new teacher
const addTeacher = async () => {
  const name = document.getElementById("newTeacherName").value;
  const qualification = document.getElementById("newTeacherQualification").value;
  const email = document.getElementById("newTeacherEmail").value;
  const post = document.getElementById("newTeacherPost").value;
  const image = document.getElementById("newTeacherImage").files[0];
  const description = document.getElementById("description").value;

  if (!name || !qualification || !email || !post || !image || !description) {
    alert("Please fill out all fields.");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("qualification", qualification);
  formData.append("email", email);
  formData.append("post", post);
  formData.append("image", image);
  formData.append("description", description);

  try {
    const response = await fetch("/teacher", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Teacher added successfully");
      loadTeacherData(); // Reload the table after adding
      document.getElementById("addTeacherForm").reset(); // Reset the form
    } else {
      throw new Error("Failed to add teacher");
    }
  } catch (error) {
    console.error("Error adding teacher:", error);
    alert("Something went wrong! Please try again.");
  }
};


// Open Edit Modal
const openEditModal = (index) => {
  const teacher = document
    .getElementById("teacherTable")
    .querySelectorAll("tbody tr")[index];
  document.getElementById("editTeacherName").value = teacher.cells[0].innerText;
  document.getElementById("editTeacherQualification").value =
    teacher.cells[2].innerText;
  document.getElementById("editTeacherEmail").value =
    teacher.cells[3].innerText;

  document.getElementById("editModal").style.display = "flex";
};

// Save Edited Teacher
const saveEdit = () => {
  const teacherRow = document
    .getElementById("teacherTable")
    .querySelectorAll("tbody tr")[editIndex];
  teacherRow.cells[0].innerText =
    document.getElementById("editTeacherName").value;
  teacherRow.cells[2].innerText = document.getElementById(
    "editTeacherQualification"
  ).value;
  teacherRow.cells[3].innerText =
    document.getElementById("editTeacherEmail").value;

  closeModal();
};

// Close Edit Modal
const closeModal = () => {
  document.getElementById("editModal").style.display = "none";
};


// Delete Teacher
const deleteTeacher = (id) => {
  alert('teacher data deleted successfully'+id)
  // fetch(`/teacher/delete/${id}`, {
  //   method: "DELETE",
  // })
  //   .then((response) => {
  //     if (response.ok) {
  //       alert("Teacher data deleted successfully");
  //       loadTeacherData(); // Reload the table after deletion
  //     } else {
  //       alert("Error deleting teacher. Please try again.");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Error deleting teacher:", error);
  //     alert("Failed to delete the teacher.");
  //   });
};

// Load teacher data on page load
window.onload = loadTeacherData;
