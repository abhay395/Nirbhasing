const tableSection = document.getElementById('table-section')
const newName = document.getElementById('newName');
const newCompany= document.getElementById('newCompany')
const newPassOutYear = document.getElementById('newPass-out-year')
const newAnnualPackage = document.getElementById('newAnnual-package')
const newPlacedImage = document.getElementById('newPlacedImage')
const submitDataButton = document.getElementById('submitDataButton')
const form = document.querySelector('form');


// fetch all data
const getData=async()=>{
    try {
        const response = await fetch('/placementStudent')
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error)
        return []
    }
}

// delete data
const deleteData=async(id)=>{
    try {
        const response = await fetch(`/placementStudent/${id}`,{
            method: 'DELETE',
        })
        return response
    } catch (error) {
        console.error("Error deleting data:", error);
        return null
    }
}

// post data 
const postData=async({ name,image,package, passoutYear,company })=>{
    const formData = new FormData();
    formData.append('name',name);
    formData.append('image',image);
    formData.append('package',package);
    formData.append('passoutYear',passoutYear);
    formData.append('company',company);
    try {
        const response = await fetch('/placementStudent',{
            method:'POST',
            body: formData,
        })
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

// render data
const renderData = async()=>{
    const data = await getData();

    const table = document.createElement('table');
    table.className='table table-hover table-bordered table-striped',
    table.innerHTML = `
    <thead class="table-dark">
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Image</th>
        <th>Company Name</th>
        <th>Post </th>
        <th>Package</th>
        <th>Passout Year</th>
        <th>Action</th>
      </tr>
    </thead>
    `;

    const tableBody = document.createElement('tbody');
    data.forEach((student,index) => {
        const tr = document.createElement('tr');
        tr.innerHTML=`
        <th scope="row">${index + 1}</th>
      <td>${student.name}</td>
      <td><img src="${student.image}" class="img-thumbnail"></td>
      <td>${student.company}</td>
      <td>${student.post}</td>
      <td>${student.package}</td>
      <td>${student.passoutYear-1}-${student.passoutYear}</td>
      <td>
        <button class="btn btn-sm btn-danger delete-btn" id="${student._id}">Delete</button>
      </td>
        `
        // delete button 
        const deleteBtn = tr.querySelector('.delete-btn')
        deleteBtn.addEventListener('click',async()=>{
            try {
                const responce = await deleteData(student._id);
                if(responce && responce.ok){
                    renderData(); 
                }
                
              } catch (error) {
                console.error(error);
                alert("data not deleted please try again");
              }
        })
        tableBody.appendChild(tr);
        tableSection.innerHTML=''
    });
    table.appendChild(tableBody)
    tableSection.appendChild(table);
}


// submit data
form.addEventListener('submit',async(event)=>{
    event.preventDefault();
    const name = newName.value;
    const company = newCompany.value;
    const passoutYear = parseInt(newPassOutYear);
    const package = newAnnualPackage.value;
    const image = newPlacedImage.files[0]

    newName.disabled=true;
    newCompany.disabled=true;
    newPassOutYear.disabled=true;
    newAnnualPackage.disabled=true;
    newPlacedImage.disabled=true;

    const response = await postData({  name,image,package, passoutYear,company });
    if(response && response.ok){
        alert("Placement student data added !")
        newName.disabled=false;
        newCompany.disabled=false;
        newPassOutYear.disabled=false;
        newAnnualPackage.disabled=false;
        newPlacedImage.disabled=false;
        form.reset();
        renderData();
    }else{
        alert('Failed to add student data !')
    }
})
window.onload = renderData();