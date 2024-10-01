const tbody = document.querySelector("tbody");

let certificate = [
  {
    courses: [
      {
        name: "Data Science Certification",
        description:
          "Learn to analyze and visualize data using Python and machine learning techniques.",
        duration: "3 Months",
        skills: "Data Analysis, Machine Learning, Python",
        mode: 'Offline'
      },
      {
        name: "Cybersecurity Certification",
        description:
          "Learn to analyze and visualize data using Python and machine learning techniques.",
        duration: "3 Months",
        skills: "Data Analysis, Machine Learning, Python",
        mode: 'Offline'
      },
      {
        name: "Web Development Certification",
        description:
          "Learn to analyze and visualize data using Python and machine learning techniques.",
        duration: "3 Months",
        skills: "Data Analysis, Machine Learning, Python",
        mode: 'Offline'
      },
      {
        name: "Artificial Intelligence (AI) Certification",
        description:
          "Learn to analyze and visualize data using Python and machine learning techniques.",
        duration: "3 Months",
        skills: "Data Analysis, Machine Learning, Python",
        mode: 'Offline'
      },
      {
        name: "Software Engineering Certification",
        description:
          "Learn to analyze and visualize data using Python and machine learning techniques.",
        duration: "3 Months",
        skills: "Data Analysis, Machine Learning, Python",
        mode: 'Offline',
      },
      {
        name: "Mobile App Development Certification",
        description:
          "Learn to analyze and visualize data using Python and machine learning techniques.",
        duration: "3 Months",
        skills: "Data Analysis, Machine Learning, Python",
        mode: 'Offline'
      },
      {
        name: "Cloud Computing Certification",
        description:
          "Learn to analyze and visualize data using Python and machine learning techniques.",
        duration: "3 Months",
        skills: "Data Analysis, Machine Learning, Python",
        mode: 'Offline'
      },
    ],
  },
];

// function loader hide
function loader() {
  document.getElementById("loader").remove();
}

const getData = async()=>{
  try {
    const response = await fetch('/certification')
    const data = await response.json();
    return data;
  } catch (error) {
    return null
  }
}
const renderData =async()=>{
  try {
    const data = await getData()||[];
    data?.forEach((item,index) => {
      const {description,duration,mode,name,skillsGained} = item
      const trElement = document.createElement('tr');
      trElement.innerHTML=`<th scope="row">${index+1}</th>
              <td>${name}</td>
              <td>${description}</td>
              <td>${duration}</td>
              <td>${mode}</td>
              <td>${skillsGained}</td>`
      tbody.appendChild(trElement);
    });
  } catch (error) {
    console.log(error)
  }
}
renderData();