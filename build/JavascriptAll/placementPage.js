const placementData = document.getElementById("placementdata");

// Function to hide the loader
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

// Function to display a message when no data is available
function displayNoDataMessage() {
  placementData.innerHTML = `
    <div class="col-12 text-center">
      <p class="text-muted">No placement student data data available at the moment.</p>
    </div>`;
}

// Function to display an error message in case of a failed fetch
function displayErrorMessage() {
  placementData.innerHTML = `
    <div class="col-12 text-center">
      <p class="text-danger">Error loading placement student data. Please try again later.</p>
    </div>`;
}

// Function to create a placement card dynamically
function createPlacementCard(student) {
  const colDiv = document.createElement("div");
  colDiv.className = "col-md-4 mb-4";

  // Template literal for card HTML structure
  colDiv.innerHTML = `
    <div class="card h-100 shadow border rounded">
      <img src="${student.image}" class="card-img-top img-fluid" alt="placement Image" style="object-fit: contain;">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-center mb-3">${student.name}</h5>
        <p class="card-text"><strong>Company Name :</strong> ${student.company}</p>
        <p class="card-text"><strong>Annual Package :</strong> ${student.package} LPA</p>
       ${student.passoutYear && `<p class="card-text"><strong>Passout Year: </strong>${student.passoutYear-1}-${student.passoutYear} </p>` }
      </div>
    </div>`;
  
  return colDiv;
}

// Function to render the placement data
function renderPlacementData(placementList) {
  if (placementList.length === 0) {
    displayNoDataMessage();
    return;
  }

  placementList.forEach((placement) => {
    const placementCard = createPlacementCard(placement);
    placementData.appendChild(placementCard);
  });
}

// Fetch placement data and handle the response
function fetchPlacementData() {
  fetch("/placementStudent")
    .then((response) => response.json())
    .then((data) => {
      hideLoader();
      renderPlacementData(data);
    })
    .catch((error) => {
      console.error("Error fetching placement student data:", error);
      hideLoader();
      displayErrorMessage();
    });
}

// Initialize the fetching of placement data
fetchPlacementData();

