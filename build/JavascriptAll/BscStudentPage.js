const StudentSection = document.getElementById("facultydata");
const container = document.getElementById("ak");
const loader = document.createElement("div");

loader.className = "loader";
loader.innerHTML = `
  <div id="loader" class="d-flex justify-content-center align-items-center" style="height: 50vh;">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
`;

// Show and hide loader
const showLoader = () => container.appendChild(loader);
const hideLoader = () => container.removeChild(loader);

// Fetch Data
const getData = async () => {
  showLoader();
  try {
    const response = await fetch("/student/getAll?course=Bsc.cs");
    const data = await response.json();
    if (!data || data.length === 0) {
      StudentSection.innerHTML = `
    <div class="col-12 text-center">
      <p class="text-muted">No faculty data available at the moment.</p>
    </div>`;
      return null; 
    }
    return data;
  } catch (error) {
    console.error(error);
    StudentSection.innerHTML =
      "<p>Failed to load student data. Please try again later.</p>";
  } finally {
    hideLoader();
  }
};

// Helper function to create student year sections
const createYearSection = (id, yearTitle) => `
  <div class="row g-4" id="${id}" style="margin-bottom: 20px">
    <h1>${yearTitle}</h1>
  </div>
`;

// Helper function to populate students
const populateStudents = (students = [], section) => {
  students.forEach((student) => {
    const studentDiv = document.createElement("div");
    studentDiv.className = "col-md-4";
    studentDiv.innerHTML = `
      <div class="card mb-4">
        <div class="card-image">
          <img class="img-fluid" src="${
            student.image
          }?height=400&width=400" alt="${student.name}">
          ${student.isTopper ? `<span class="topper-badge">Topper</span>` : ""}
        </div>
        <div class="card-content p-3">
          <h2 class="student-name">${student.name}</h2>
          <div class="student-stats d-flex justify-content-between">
            <div class="stat">
              <div class="stat-label">CGPA</div>
              <div class="stat-value">${student.cgpa}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Rank</div>
              <div class="stat-value">${student.rank}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    section.appendChild(studentDiv);
  });
};

// Populate student data into UI
const setStudentUI = async () => {
  const students = await getData();
  if (!students) return;

  students.forEach((item) => {
    const studentWithYear = document.createElement("div");
    studentWithYear.className = "course-info";
    studentWithYear.innerHTML = `
      <div class="course-info" style="font-size: 1.25rem">
        <span>Bachelor of Science in Computer Science</span>
        <span>${item.examYear}</span>
      </div>
      ${createYearSection("Student1stYear", "1st year")}
      ${createYearSection("Student2ndYear", "2nd year")}
      ${createYearSection("Student3rdYear", "3rd year")}
    `;

    const [
      student1stYearSection,
      student2ndYearSection,
      student3rdYearSection,
    ] = [
      studentWithYear.querySelector("#Student1stYear"),
      studentWithYear.querySelector("#Student2ndYear"),
      studentWithYear.querySelector("#Student3rdYear"),
    ];

    populateStudents(item["1stYearStudents"], student1stYearSection);
    populateStudents(item["2ndYearStudents"], student2ndYearSection);
    populateStudents(item["3rdYearStudents"], student3rdYearSection);

    container.appendChild(studentWithYear);
  });
};

// Initialize the UI
setStudentUI();
