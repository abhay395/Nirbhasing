const selectForSession = document.querySelector("#courseSession");
const selectForCourse = document.querySelector("#courseName");
const selectTimeTableFor = document.querySelector("#timeTableFor");
const form = document.querySelector("form");
const pdfInput = document.querySelector("#timetablePdf");
const year = new Date().getFullYear();
// console.log(date.getFullYear());
const sessions = [
  `Jan ${year} - Apr ${year}`,
  `July ${year} - Dec ${year}`,
];

sessions.forEach((session) => {
  const option = document.createElement("option");
  option.value = session;
  option.text = session;
  selectForSession.appendChild(option);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const courseName = selectForCourse.value;
  const courseSession = selectForSession.value;
  const type = selectTimeTableFor.value;
  const pdf = pdfInput.files[0];
  const formData = new FormData();
  formData.append("courseName", courseName);
  formData.append("courseSession", courseSession);
  formData.append("type", type);
  formData.append("pdf", pdf);
  fetch("/timeTable", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((response) => {
      // Handle the response
      alert("Time Table Added ")
      selectForCourse.value='';
      selectForSession.value='';
      selectTimeTableFor.value='';
      pdfInput.value=''
      console.log(response);
    })
    .catch((error) => {
      // Handle the error
      console.error(error);
    });
});
