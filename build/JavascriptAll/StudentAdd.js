const form = document.querySelector('form')
const nameInput = document.querySelector('#name')
const cgpaInput = document.querySelector('#cgpa')
const courseInput = document.querySelector('#course')
const yearInput = document.querySelector('#year')
const rankInput = document.querySelector('#rank')
const examYearInput = document.querySelector('#examYear')
const imageInput = document.querySelector('#image')
const alertBox  = document.getElementById('alerts')
const pandingdata = document.getElementsByClassName('panding-data')[0]

// alert function 
function showAlert(message, type) {
  alertBox.innerHTML = `<div id='alert' class="alert alert-${type} alert-dismissible fade show" role="alert">
    <strong>${message}</strong>
  </div>`;
  setTimeout(() => {
    // document.getElementById('alert').classList.add('fade-in');
    setTimeout(() => document.getElementById('alert').style.display = 'none', 3000);
  }, 100);
}
function pandingAlert(type){
  pandingdata.style.display=`${type}`
}
form.addEventListener('submit', (e) => {
    e.preventDefault()
    // pandingdata('inline')
    const name = nameInput.value
    const cgpa = parseFloat(cgpaInput.value)
    const course = courseInput.value
    const year = yearInput.value
    const rank = rankInput.value
    const examYear = examYearInput.value
    const image = imageInput.files[0]
    const formData = new FormData();
    formData.append("name", name);
    formData.append("cgpa", cgpa);
    formData.append("course", course);
    formData.append("year", year);
    formData.append("rank", rank);
    formData.append("examYear", examYear);
    formData.append("image", image);
    fetch('/student/create', {
        method: 'POST',
        body: formData
    }).then((response) => {
        nameInput.value = ''
        cgpaInput.value = ''
        courseInput.value = ''
        yearInput.value = ''
        rankInput.value = ''
        examYearInput.value = ''
        imageInput.value = ''
        // alert('Student added successfully')
        // pandingdata('');
        showAlert('Student Data Uploaded Successfully !','success');
    }).catch((error) => {
        console.log(error)
        showAlert('Something Went Wrong! try again','danger')
    })

})

document.addEventListener("DOMContentLoaded", async () => {
    const navbarUl = document.querySelector("#navbarNav ul");
    const login = document.querySelector("#login");
    const adminPanelItem = createNavItem("Admin Panel", "/Pages/AdminPanel.html");
    const loginItem = createNavItem("Login", "/Pages/Login.html");
  
    try {
      const response = await fetch("/check/myUser");
      const data = await response.json();
      navbarUl.appendChild(adminPanelItem);
  
      console.log(data);
    } catch (error) {
      navbarUl.appendChild(loginItem);
      console.error("Authentication check failed:", error);
    }
  });
  
  // Helper function to create nav item
  function createNavItem(text, href) {
    const li = document.createElement("li");
    li.className = "nav-item";
  
    const a = document.createElement("a");
    a.className = "nav-link";
    a.href = href;
    a.textContent = text;
  
    li.appendChild(a);
    return li;
  }
  