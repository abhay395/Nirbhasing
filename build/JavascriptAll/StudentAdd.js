const StudentSecition = document.querySelector("#studentSection");
const form = document.querySelector('form')
const selectYearInput = document.querySelector('#year');
const selectCourseInput = document.querySelector('#course');
const selectExamYear = document.querySelector('#examyear');
const nameInput = document.querySelector('#name');
const cgpaInput = document.querySelector('#cgpa');
const rankInput = document.querySelector('#rank');
const imageInput = document.querySelector('#image');

const examyear = selectExamYear.value
const course = selectCourseInput.value

const updateData=async({name,cgpa,rank},id)=>{
  const formdata =new FormData();
  formdata.append('name',name)
  formdata.append('cgpa',cgpa)
  formdata.append('rank',rank)
  console.log(id)
  try {
     const res = await fetch(`https://server-for-college.onrender.com/student/update/${id}`, {
      method: 'PUT',
      body: formdata
    })
    return res
  } catch (error) {
    return error
  }
}
const postData=async({name,cgpa,course,year,rank,image,examYear})=>{
  try {
    const formdata = new FormData();
    formdata.append('name',name)
    formdata.append('cgpa',cgpa)
    formdata.append('course',course)
    formdata.append('year',year)
    formdata.append('rank',rank)
    formdata.append('image',image)
    formdata.append('examYear',examYear)
    const response = await fetch('https://server-for-college.onrender.com/student/create', {
      method: 'POST',
      body: formdata
    });
    const result = await response.json();
    return result
  } catch (error) {
    return null
  }
}


form.addEventListener('submit',async(e)=>{
  e.preventDefault()
  const name = nameInput.value
  const cgpa = cgpaInput.value
  const course = selectCourseInput.value
  const examYear= selectExamYear.value
  const year = selectYearInput.value
  const rank = parseFloat(rankInput.value)
  const image = imageInput.files[0]
 try {
  await postData({name,cgpa,course,year,rank,image,examYear}).then((data)=>{
    if(data){
      alert("data added")
    }
    renderData()
  })
 } catch (error) {
  console.log(error)
 }

})

const getData = async () => {
  try {
    const response = await fetch(`https://server-for-college.onrender.com/student/getAll?examYear=${examyear}&course=${course}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const deleteStudent = async(id)=>{
  try {
    const response = await fetch(`https://server-for-college.onrender.com/student/delete/${id}`,{
      method:"DELETE"
    })
    return response 
  } catch (error) {
    return null
  }
}
const renderData = async () => {
  try {
    StudentSecition.innerHTML=''
    const data = (await getData()) || [];
    const firstYearStudent = data[0]["1stYearStudents"];
    const secondYearStudent = data[0]["2ndYearStudents"];
    const theredYearStudent = data[0]["3rdYearStudents"];
    console.log(firstYearStudent, secondYearStudent, theredYearStudent);
   const tableFor1stYear = creatTable(firstYearStudent,"first Year")
   const tableFor2ndYear = creatTable(secondYearStudent,"first Year")
   const tableFor3rdYear = creatTable(theredYearStudent,"first Year")
   const tableArray = [tableFor1stYear,tableFor2ndYear,tableFor3rdYear];
   let year =1;
   tableArray.forEach((table)=>{
    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.innerHTML = `${year} Year Student`
    div.appendChild(h1);
    div.appendChild(table);
    year++;
    StudentSecition.appendChild(div);
   })
    // data.forEach(element => {

    // });
  } catch (error) {
    console.log(error);
  }
};
function creatTable (data, name){
  const div = document.createElement("div");
  const table = document.createElement("table");
  table.innerHTML = `<thead>
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>CGPA</th>
                    <th>Rank</th>
                    <th>Actions</th>
                </tr>
            </thead>`
  const tbody = document.createElement('tbody');
  data.forEach(element => {
    const tr = document.createElement('tr');
    let EditMode = false;
    tr.innerHTML = `
    <td>${element.name}</td>
    <td>${`<img src="${element.image}" >`}</td>
    <td>${element.cgpa}</td>
    <td>${ element.rank}</td>
    <td><button class="EditBtn">Edit</button><button class="DeleteBtn">Delete</button></td>`;
    const EditBtn = tr.querySelector('.EditBtn');
    const DeleteBtn = tr.querySelector('.DeleteBtn');
    DeleteBtn.addEventListener("click",async(e)=>{
      try {
       const res= await deleteStudent(element._id)
       if(res.status==200){
        const parentElement = e.target.parentElement.parentElement.parentElement;
        parentElement.removeChild(e.target.parentElement.parentElement)
        
       }
      } catch (error) {
        console.log(error)
      }
    })
    EditBtn.addEventListener("click",async (e) => {
      EditMode = !EditMode;
      if (EditMode) {
        const obj = {};
        tr.querySelectorAll('td').forEach((td, index) => {
          let id;
          if(index==0) id="name"
          if(index==2) id="cgpa"
          if(index==3) id="rank"
          if (index!=1 && index < 4) { // First 4 columns are editable
            const value = td.innerText;
            td.innerHTML = `<input id="${id}" value="${value}" />`;
          }
          
        });
        EditBtn.innerText = 'Save';
      } else {
        const  name = tr.querySelector('#name').value
        const cgpa = parseFloat(tr.querySelector('#cgpa').value)
        const rank = parseInt(tr.querySelector('#rank').value)
        const id=element._id
      const res =  await updateData({name,cgpa,rank},id)
      if(res.status==200)  tr.querySelectorAll('td').forEach((td, index) => {
        if (index!=1 && index < 4) {
          const input = td.querySelector('input');
          const id = input.id;
          const value = input.value;
          const formData = new FormData();
          if (input) {
            td.innerHTML = input.value;
          }
        }
      });
      sortStudent(tbody)
        EditBtn.innerText = 'Edit';
      }
    });
    
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  return table;
};

function sortStudent(tbody){
  const studentArr = Array.from(tbody.children);
  studentArr.sort((a,b)=>{
    const cgpaA=parseFloat(a.querySelector('td:nth-child(3)').innerHTML)
    const cgpaB=parseFloat(b.querySelector('td:nth-child(3)').innerHTML)
    console.log(cgpaA,cgpaB)
    return cgpaB-cgpaA
  })
  // console.log(studentArr[0].innerHTML);
  studentArr.forEach((student)=>{
    tbody.appendChild(student)
  })
  // console.log(studentArr);
}

renderData();

