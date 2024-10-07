const headcontainer = document.getElementById("head-depart");

// Function to hide the loader
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

// Function to display a message when no data is available
function displayNoDataMessage() {
  headcontainer.innerHTML = `
    <div class="col-12 text-center">
      <p class="text-muted">No data available at the moment.</p>
    </div>`;
}


// Function to display an error message in case of a failed fetch
function displayErrorMessage() {
  headcontainer.innerHTML = `
    <div class="col-12 text-center">
      <p class="text-danger">Error loading  data. Please try again later.</p>
    </div>`;
}

async function GetHODData() {
  try {
    const response = await fetch("/teacher?post=HOD&limit=1");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error)
    return null;
  }
}
async function renderHODData(){
  try {
    const data =  await GetHODData();
    if(data.length==0){
      displayNoDataMessage();
      return
    }
    console.log(data);
    data.forEach((item) => {
      headcontainer.innerHTML = `<div class="row justify-content-center">
            <div class="col-lg-8 col-md-10">
              <div class=" shadow-lg border-0">
                <div class="row g-0">
                  <div class="col-md-4">
                    <img
                      src=${item.image}
                      class="img-fluid rounded-start h-100 object-fit-cover"
                      alt="Head of Department"
                    />
                  </div>
                  <div class="col-md-8 align-items-center">
                    <div class="card-body p-4">
                      <h5 class="card-title">${item.name}</h5>
                      ${item.post=='HOD' && "<span class='badge bg-primary mb-2'>Head of Computer Science Department</span>"}
                      <p class="card-text">
                      ${item.description}
                      </p>
                      <p class="card-text">
                      <span class="fw-bold">Qualification : </span>${item.qualification}
                      </p>
                      <ul class="list-unstyled">
                        <li>
                          <i class="fas fa-envelope"></i> 
                          <span class="fw-bold">Email:</span> 
                          ${item.email}
                        </li>
                       ${item.phone?` <li>
                          <i class="fas fa-phone"></i> 
                          <span class="fw-bold">Phone:</span> 
                          +91-${item.phone}
                        </li>`:''}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
    });
    
  } catch (error) {
    console.log(error)
    displayErrorMessage()
  }finally{
    hideLoader();
  }
}
renderHODData()
// document.addEventListener('loadstart',renderHODData)