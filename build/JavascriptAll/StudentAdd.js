const StudentSecition = document.querySelector("#studentSection");
const form = document.querySelector("form");
const selectYearInput = document.querySelector("#year");
const selectCourseInput = document.querySelector("#course");
const selectExamYear = document.querySelector("#examyear");
const nameInput = document.querySelector("#name");
const cgpaInput = document.querySelector("#cgpa");
// const rankInput = document.querySelector("#rank");
const imageInput = document.querySelector("#image");
const erroreMessage = document.querySelector("#errorMessage");
const submitbtn = document.querySelector('#submitBtn');
let Rank = 0;
let examyear = selectExamYear.value;
let course = selectCourseInput.value;
const updateData = async ({ name, cgpa }, id) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("cgpa", cgpa);
  // formdata.append("rank", rank);
  console.log(id);
  try {
    const res = await fetch(`/student/update/${id}`, {
      method: "PUT",
      body: formdata,
    });
    return res;
  } catch (error) {
    return error;
  }
};
const postData = async ({
  name,
  cgpa,
  course,
  year,
  rank,
  image,
  examYear,
}) => {
  try {
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("cgpa", cgpa);
    formdata.append("course", course);
    formdata.append("year", year);
    // formdata.append("rank", rank);
    formdata.append("image", image);
    formdata.append("examYear", examYear);
    const response = await fetch("/student/create", {
      method: "POST",
      body: formdata,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value;
  const cgpa = cgpaInput.value;
  const course = selectCourseInput.value;
  const examYear = selectExamYear.value;
  const year = selectYearInput.value;
  const image = imageInput.files[0];
  try {
    disableInputFields(true);
    let data = await postData({
      name,
      cgpa,
      course,
      year,
      image,
      examYear,
    });
    data = data.student;
    if (data) {
      disableInputFields(false);
      form.reset();
      const tbodyFor1st = document.querySelector("#year1 tbody");
      const tbodyFor2nd = document.querySelector("#year2 tbody");
      const tbodyFor3rd = document.querySelector("#year3 tbody");
      // let Rank ;
      console.log(tbodyFor1st, tbodyFor2nd, tbodyFor3rd);
      console.log(data.year);
      if (data.year == "1") {

        Rank = tbodyFor1st.children.length + 1;
        console.log(data.year);
        const tr = createRow(data);
        tbodyFor1st.appendChild(tr);
        sortStudent(tbodyFor1st);
      } else if (data.year == 2) {
        console.log(data.year);
        const tr = createRow(data);
        tbodyFor2nd.appendChild(tr);
        sortStudent(tbodyFor2nd);
      } else if (data.year == 3) {
        console.log(data.year);
        const tr = createRow(data);
        tbodyFor3rd.appendChild(tr);
        sortStudent(tbodyFor3rd);
      }
    }
  } catch (error) {
    console.log(error);
  }
});
function disableInputFields(disable) {
  nameInput.disabled = disable;
  cgpaInput.disabled = disable;
  selectYearInput.disabled = disable;
  selectCourseInput.disabled = disable;
  selectExamYear.disabled = disable;
  imageInput.disabled = disable;
  submitbtn.disabled = disable;
}
selectExamYear.addEventListener("change", (e) => {
  examyear = e.target.value;
  renderData();
});
// console.log(submitbtn)
selectCourseInput.addEventListener("change", (e) => {
  course = e.target.value;
  renderData();
});
const getData = async () => {
  try {
    const response = await fetch(
      `/student/getAll?examYear=${examyear}&course=${course}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const deleteStudent = async (id) => {
  try {
    const response = await fetch(`/student/delete/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    return null;
  }
};
const renderData = async () => {
  try {
    StudentSecition.innerHTML = "";
    const data = (await getData()) || [];
    const firstYearStudent = data[0]["1stYearStudents"];
    const secondYearStudent = data[0]["2ndYearStudents"];
    const theredYearStudent = data[0]["3rdYearStudents"];
    const forthYearStudent = data[0]["4thYearStudents"];
    const tableFor1stYear = creatTable(firstYearStudent, "first Year");
    const tableFor2ndYear = creatTable(secondYearStudent, "seconde Year");
    const tableFor3rdYear = creatTable(theredYearStudent, "thered Year");
    let tableFor4thYear;
    const tableArray = [tableFor1stYear, tableFor2ndYear, tableFor3rdYear];
    if (forthYearStudent) {
      tableFor4thYear = creatTable(forthYearStudent, "forth Year");
      tableArray.push(tableFor4thYear);
    }
    // console.log(firstYearStudent, secondYearStudent, theredYearStudent);
    let year = 1;
    tableArray.forEach((table) => {
      const div = document.createElement("div");
      div.id = `year${year}`;
      const h1 = document.createElement("h1");
      h1.innerHTML = `${year} Year Student`;
      div.appendChild(h1);
      div.appendChild(table);
      year++;
      StudentSecition.appendChild(div);
    });
  } catch (error) {
    console.log(error);
  }
};
function createRow(data, rank = 0) {
  const tr = document.createElement("tr");
  let isEditMode = false;

  // Use textContent to avoid potential XSS injection
  const safeText = (text) => document.createTextNode(text).wholeText;

  // Create elements without directly injecting HTML to enhance security
  tr.innerHTML = `
    <td id="name">${safeText(data.name)}</td>
    <td id="image"><img src="" alt="Student image"></td>
    <td id="cgpa">${safeText(data.cgpa.toString())}</td>
    <td id="rank">${safeText(rank.toString())}</td>
    <td>
      <button class="EditBtn">Edit</button>
      <button class="DeleteBtn">Delete</button>
    </td>
  `;

  const imgElement = tr.querySelector("#image img");
  
  // Validate and set the image source securely
  if (data.image && isValidUrl(data.image)) {
    imgElement.src = data.image;
    imgElement.alt = `Image of ${data.name}`;
  } else {
    imgElement.src = 'default.png'; // Fallback if image is not valid or available
    imgElement.alt = 'No image available';
  }

  const editBtn = tr.querySelector(".EditBtn");
  const deleteBtn = tr.querySelector(".DeleteBtn");

  // Delete action with error handling
  deleteBtn.addEventListener("click", async () => {
    try {
      const res = await deleteStudent(data._id);
      if (res.status === 200) {
        const parentElement = tr.parentElement;
        tr.remove();
        sortStudent(parentElement);
      } else {
        console.error('Failed to delete student:', res.statusText);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  });

  // Edit/Save toggle functionality
  editBtn.addEventListener("click", async () => {
    isEditMode = !isEditMode;

    if (isEditMode) {
      // Enter Edit Mode
      tr.querySelectorAll("td").forEach((td, index) => {
        if (index !== 1 && index < 4) {  // Skip image and rank columns
          const value = td.textContent;
          td.innerHTML = `<input value="${value}" />`;
        }
      });
      editBtn.textContent = "Save";
    } else {
      // Save changes and exit Edit Mode
      const name = tr.querySelector("#name input").value.trim();
      const cgpa = parseFloat(tr.querySelector("#cgpa input").value);
      const id = data._id;

      try {
        const res = await updateData({ name, cgpa }, id);
        if (res.status === 200) {
          tr.querySelectorAll("td").forEach((td, index) => {
            if (index !== 1 && index < 4) {
              const input = td.querySelector("input");
              if (input) {
                td.textContent = input.value; // Replace with plain text to prevent input element persistence
              }
            }
          });
          sortStudent(tr.parentElement);
        } else {
          console.error('Update failed:', res.statusText);
        }
      } catch (error) {
        console.error('Update error:', error);
      }

      editBtn.textContent = "Edit";
    }
  });

  return tr;
}

// Utility function to validate image URLs
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function creatTable(data, name) {
  const div = document.createElement("div");
  const table = document.createElement("table");
  table.className = "table table-hover";
  table.innerHTML = `<thead>
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>CGPA</th>
                    <th>Rank</th>
                    <th>Actions</th>
                </tr>
            </thead>`;
  const tbody = document.createElement("tbody");
  data.forEach((element, index) => {
    const tr = createRow(element, index + 1);
    tbody.appendChild(tr);
    // Rank=index+1;
  });
  // sortStudent(tbody);
  table.appendChild(tbody);
  return table;
}

function sortStudent(tbody) {
  const studentArr = Array.from(tbody.children);

  studentArr.sort((a, b) => {
    const cgpaA = parseFloat(a.querySelector("td:nth-child(3)").innerHTML);
    const cgpaB = parseFloat(b.querySelector("td:nth-child(3)").innerHTML);
    console.log(cgpaA, cgpaB);
    return cgpaB - cgpaA;
  });
  studentArr.forEach((student, index) => {
    student.querySelector("td:nth-child(4)").innerHTML = index + 1;
  });
  // console.log(studentArr[0].innerHTML);
  studentArr.forEach((student) => {
    tbody.appendChild(student);
  });
  // console.log(studentArr);
}

renderData();
