const rsContainer = document.getElementById("rs-container");



// access object
const getData = async () => {
  try {
    const response = await fetch("/research");
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
const renderData = async () => {
  try {
    let data = (await getData()) || [];
    // data not available. 
    if (!data || data.length === 0) {
      rsContainer.innerHTML = `
    <div class="col-12 text-center">
      <p class="text-muted">No Research data available at the moment.</p>
    </div>`;
      return null; 
    }
    data = data[0];
    const { OngoingResearch, Publications, ResearchGroups } = data;
    rsContainer.innerHTML = `
  ${generateCards(OngoingResearch[0]?.type, OngoingResearch, true)}
  ${generateCards("Publications", Publications)}
  ${generateCards("Research Groups",ResearchGroups)}
`;
  } catch (error) {
    console.log(error);
  }
};
renderData();


// Function to generate cards
function generateCards(type, items, isImageRequired = false){
  return `
    <h2 class="text-center mt-5">${type}</h2>
    <div class="row mt-4">
      ${items
        .map(
          (item) => `
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body">
                ${
                  isImageRequired
                    ? `<img src="${item.image}" height="200px" style="object-fit: cover" class="card-img-top" alt="${item.title} Research" />`
                    : ""
                }
                <h5 class="research-card-title">${item.title}</h5>
                <p class="card-text">
                  ${item.description} 
                </p>
              </div>
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  `;
};

// Clear the container before appending new content
