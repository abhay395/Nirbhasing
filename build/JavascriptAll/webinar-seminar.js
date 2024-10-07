const webinarSeminarSection = document.getElementById("webinar-seminar-container");

// all data
const webinarSeminarData = [
  {
    image: "https://res.cloudinary.com/dprpxnibm/image/upload/v1728031843/WhatsApp_Image_2024-10-04_at_14.19.25_1f1206ad_gtbjio.jpg",
    title: "Webinar 1",
    description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    time: "23-03-2024",
  },
  {
    image: "https://res.cloudinary.com/dprpxnibm/image/upload/v1728031843/WhatsApp_Image_2024-10-04_at_14.19.25_1f1206ad_gtbjio.jpg",
    title: "Webinar 2",
    description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    time: "23-03-2024",
  },
  {
    image: "https://res.cloudinary.com/dprpxnibm/image/upload/v1728031843/WhatsApp_Image_2024-10-04_at_14.19.25_1f1206ad_gtbjio.jpg",
    title: "Webinar 3",
    description: "This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    time: "23-03-2024",
  },
];

// Function to hide the loader
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

// Function to display a message when no data is available
function displayNoDataMessage() {
  webinarSeminarSection.innerHTML = `
    <div class="col-12 text-center">
      <p class="text-muted">No webinar or seminar data available at the moment.</p>
    </div>`;
}

// Function to display an error message in case of a failed fetch
function displayErrorMessage() {
  webinarSeminarSection.innerHTML = `
    <div class="col-12 text-center">
      <p class="text-danger">Error loading webinar or seminar data. Please try again later.</p>
    </div>`;
}

// getData
// create function
// createdata
const createWebinar = (data) => {
  const div = document.createElement("div");
  div.className='col-md-6'
  // Template literal for card HTML structure
  div.innerHTML = `
    <div class="card mb-3 mt-4" style="max-width: 600px">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${data.image}" class="img-fluid rounded-start" alt="${data.title}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text">${data.description}</p>
            <p class="card-text"><small class="text-body-secondary">${data.time}</small></p>
          </div>
        </div>
      </div>
    </div>`;
  
  return div;
};

const renderData = (webinarList) => {
  webinarSeminarSection.innerHTML=''
  if (webinarList.length === 0) {
    hideLoader();
    displayNoDataMessage();
    return;
  }

  webinarList.forEach((element) => {
    const webinarCard = createWebinar(element);
    webinarSeminarSection.appendChild(webinarCard);
  });
};

// Example usage:
renderData(webinarSeminarData);
