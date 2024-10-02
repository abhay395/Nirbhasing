const StudentSecition = document.querySelector("#studentSection");
const getData = async () => {
  try {
    const response = await fetch("/student/getAll?examYear=${examyear}");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const deleteStudent = async(id)=>{
  try {
    const response = await fetch(`/student/delete/${id}`,{
      method:"DELETE"
    })
    return response 
  } catch (error) {
    return null
  }
}
const renderData = async () => {
  try {
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
  table.innerHTML = `  <thead>
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
    <td>${EditMode ? `<input value="${element.name}" />` : `${element.name}`}</td>
    <td>${EditMode ? `<input type="file" accept="image/*" />` : `<img src="${element.image}" >`}</td>
    <td>${EditMode ? `<input value="${element.cgpa}" />` : `${element.cgpa}`}</td>
    <td>${EditMode ? `<input value="${element.rank}" />` : `${element.rank}`}</td>
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
    EditBtn.addEventListener("click", (e) => {
      EditMode = !EditMode;
      if (EditMode) {
        tr.querySelectorAll('td').forEach((td, index) => {
          if(index==1){
            td.innerHTML=`<input type="file" accept="image/* " />`
          }
          if (index!=1 && index < 4) { // First 4 columns are editable
            const value = td.innerText;
            td.innerHTML = `<input value="${value}" />`;
          }
          
        });
        EditBtn.innerText = 'Save';
      } else {
        tr.querySelectorAll('td').forEach((td, index) => {
          if(index==1){
            const input = td.querySelector('input');
            if (input) {
              td.innerHTML = `<img src="${input.value}"/>`;
            }
          }
          if (index!=index < 4) {
            const input = td.querySelector('input');
            if (input) {
              td.innerHTML = input.value;
            }
          }
        });
        EditBtn.innerText = 'Edit';
      }
    });
    
    DeleteBtn.addEventListener("click", (e) => {
        console.log(e.target);
        // Add delete functionality here
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
};

renderData();
