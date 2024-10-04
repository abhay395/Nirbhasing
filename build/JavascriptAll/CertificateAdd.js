// Load certificate Data from API
const loadCertificateData = () => {
  fetch("/certification")
    .then((responce) => responce.json())
    .then((data) => {
      console.log(data);
      populateTable(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Populate the certificate table
const populateTable = (certificates) => {
  const tableBody = document
    .getElementById("CertificateTable")
    .querySelector("tbody");
  tableBody.innerHTML = "";

  certificates.forEach((certificate, index) => {
    console.log(typeof certificate._id);
    const row = `
          <tr>
              <td>${index + 1}</td>
              <td>${certificate.name}</td>
              <td>${certificate.duration}</td>
              <td>${certificate.mode}</td>
              <td>${certificate.skillsGained}</td>
              <td>
                  <button class="edit-btn" onclick="openEditModal('${
                    certificate._id
                  }')">Edit</button>
                  <button class="delete-btn" onclick="deleteCertificate('${
                    certificate._id
                  }')">Delete</button>
              </td>
              </tr>
      `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
};

const addCertificate = () => {
  const name = document.getElementById("newCertificateName").value;
  const description = document.getElementById("newCertiDescription").value;
  const duration = document.getElementById("newCertificateDuration").value;
  const skillsGained = document.getElementById("newCertificateSkills").value;
  const mode = document.getElementById("newCertificateMode").value;

  if (!name || !description || !duration || !skillsGained || !mode) {
    alert("Please fill out all fields.");
    return;
  }
  const data = { name, description, duration, mode, skillsGained };

  fetch("/certification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      loadCertificateData();
      alert("data added successfully");
    })
    .catch((err) => console.log(err));
};

// delete certificate data
const deleteCertificate = (id) => {
  fetch(`/certification/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        // If the deletion is successful, reload the teacher data
        loadCertificateData();
        alert("Certificate data deleted");
      } else {
        alert("Error deleting the Certificate. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error deleting Certificate:", error);
    });
};

//  edit data
const openEditModal = (id) => {
  alert("edit window open");
};
// Save Edited Teacher
const saveEdit = () => {
  // add coding
  closeModal();
};

// Close Edit Modal
const closeModal = () => {
  document.getElementById("editModal").style.display = "none";
};
window.onload = loadCertificateData;
