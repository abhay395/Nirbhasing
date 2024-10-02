// Load news/event data
const loadTableData = () => {
  fetch("/headline")
    .then((response) => response.json())
    .then((data) => {
      if (data.length) {
        const type = data[0];
        populateTable("Event", type.Event);
        populateTable("NewsHeadline", type.NewsHeadline);
        populateTable("Reqrutement", type.Reqrutement);
      }
    })
    .catch((error) => console.error("Error loading data:", error));
};

// Populate table
const populateTable = (tableId, typeData = []) => {
  const tableBody = document.getElementById(tableId).querySelector("tbody");
  tableBody.innerHTML = typeData.length
    ? typeData.map((type, index) => createTableRow(type, index)).join("")
    : `<tr><td colspan="4" class='text-danger'>Data not found</td></tr>`;
};

// Create table row dynamically
const createTableRow = (type, index) => `
  <tr>
    <td>${index + 1}</td>
    <td>${type.type}</td>
    <td>${type.description}</td>
    <td>
      <button class="edit-btn" onclick="openEditModal('${type._id}')">Edit</button>
      <button class="delete-btn" onclick="deleteNewsEvent('${type._id}')">Delete</button>
    </td>
  </tr>
`;

// Add news/event data
const addNewsEvent = async () => {
  const description = document.getElementById("new-event-news-Description").value;
  const type = document.getElementById("new-event-news-type").value;

  if (!description || !type) {
    alert("All fields are required");
    return;
  }

  const data = { description, type };
  try {
    const response = await fetch("/headline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Data added successfully");
      document.getElementById("new-event-news-Description").value = "";
      document.getElementById("new-event-news-type").value = "";
      loadTableData(); // Reload the table after adding data
    } else {
      alert("Failed to add data");
    }
  } catch (error) {
    console.error("Error adding data:", error);
  }
};

// Delete news/event data
const deleteNewsEvent = async (id) => {
  try {
    const response = await fetch(`/headline/${id}`, { method: "DELETE" });

    if (response.ok) {
      alert("Data deleted successfully");
      loadTableData(); // Reload the table after deletion
    } else {
      alert("Error deleting data");
    }
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};

// Open edit modal
let currentId = null;
const openEditModal = (id) => {
  currentId = id;
  document.getElementById("editModal").style.display = "flex";
};

// Close modal
const closeModal = () => {
  document.getElementById("editModal").style.display = "none";
};

// Save edited data
const saveEdit = async () => {
  const descript = document.getElementById("event-news-description").value;
  const type = document.getElementById("event-news-type").value;

  if (!descript || !type) {
    alert("All fields are required");
    return;
  }

  // Prepare the updated data as JSON
  const data = { type, descript };

  try {
    const response = await fetch(`/headline/${currentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Set content type as JSON
      },
      body: JSON.stringify(data), // Send data as JSON
    });

    if (response.ok) {
      alert("Data updated successfully");
      closeModal();
      loadTableData(); // Reload the table after editing data
    } else {
      alert("Failed to update data");
    }
  } catch (error) {
    console.error("Error updating data:", error);
  }
};

// Load data when the page loads
window.onload = loadTableData;
