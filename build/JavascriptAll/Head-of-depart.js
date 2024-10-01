const headcontainer = document.getElementById("head-depart");
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
    console.log(data);
    data.forEach((item) => {
      headcontainer.innerHTML = `<div class="row justify-content-center">
            <div class="col-lg-8 col-md-10">
              <div class="card shadow-lg border-0">
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
                      <span class="badge bg-primary mb-2">${item.post}</span>
                      <p class="card-text">
                      ${item.description}
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
  }
}
renderHODData()
// document.addEventListener('loadstart',renderHODData)