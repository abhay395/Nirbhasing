// Target the aboutContainer div
const aboutContainer = document.getElementById("aboutcontainer");

// Optimized object structure
let aboutData = {
  missionVision: [
    {
      title: "Our Mission",
      desc: "Our mission is to provide a cutting-edge scientific education to rural and urban students equally so that they align with the principles and objectives of the new education policy 2020. We aim to promote interdisciplinary learning and offer a flexible and modular curriculum that empowers students to design their own learning paths. We strive to foster creativity, innovation, among our students by providing them with opportunities to engage in research, internships, and experiential learning.",
    },
    {
      title: "Our Vision",
      desc: "To be a leading institution in scientific education, empowering students to become innovative problem-solvers and contributing to the advancement of society.",
    },
  ],
  history: {
    title: "Our History",
    desc: "Govt. Nirbhay Singh Patel Science College Indore was established in the year 1989. Earlier the college was known as the Government New Science College Indore. The college was renamed in the fond memory of Late Shri Nirbhay Singh Patel, freedom fighter and former Forest Minister, Government of Madhya Pradesh and now it is recognised as Government Nirbhay Singh Patel Science College Indore.The students are offered 5-degree courses in Biology, Maths, Biotechnology, Computer Science and Computer Application. The college also offer postgraduate degree in Computer Science. In the heart of the Indore city providing education to Urban as well as Rural students. Most of the students are benefited by the scholarship schemes provided by the Department of Higher Education, Government of Madhya Pradesh and Central Government.The college is Wi-Fi enabled and has well equipped Laboratories with separate block for computer science. Gradually the college is moving toward development having high-tech facilities including smart classrooms with interactive touch panel boards and English language lab.There is outdoor and indoor gym for the students. The institute has highly advance basketball ground full filling international parameters along with sports arena for various sports activities and cricket practice pitch.The front view of the main building at and sufficient parking for two wheelers and four wheelers. The institute is enriched with highly qualified and experienced Faculty members, Sports officer, Librarian, and efficient office staff.As per the guideline of the department of Higher Education, Government of Madhya Pradesh the institute has implemented new education policy 2020 and is running successfully to the satisfaction of the students. As per the norms of NEP 2020 the institute is offering various vocational subject, major and minor subject along with internship and field project as well as community work for the holistic development of the students.",
  },
};

// Generate HTML content
let aboutHTML = `
  <div class="container my-5">
    <!-- Mission & Vision Section -->
    <div class="row mb-4">
      ${aboutData.missionVision
        .map(
          (item) => `
        <div class="col-md-6">
          <h2 class="about-cont-heading">${item.title}</h2>
          <p>${item.desc}</p>
        </div>
      `
        )
        .join("")}
    </div>

    <!-- History Section -->
    <div class="row mb-4">
      <div class="col">
        <h2 class="about-cont-heading">${aboutData.history.title}</h2>
        <p>${aboutData.history.desc}</p>
      </div>
    </div>
  </div>
`;

// Inject the HTML into the aboutContainer
aboutContainer.innerHTML = aboutHTML;
