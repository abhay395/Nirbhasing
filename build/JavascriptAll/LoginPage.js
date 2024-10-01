const errorSection = document.querySelector('#errorMessage')
async function login(e) {
    e.preventDefault()
    try {
        errorSection.innerHTML = ''
        const id = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
        })})
        const data = await id.json()
        console.log(data)
        window.location.href = "/Pages/AdminPanel.html";
    } catch (error) {
       errorSection.innerHTML = 'Invalid email or password'
    console.log(error)
    }
}
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
  
document.querySelector('#loginButton').addEventListener('click', login)
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
  