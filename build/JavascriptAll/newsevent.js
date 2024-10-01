const newsevent = document.getElementById("news-event");
const getData=async()=>{
  try {
    const response = await fetch('/headline')
    const data = await response.json()

     return  data
  } catch (error) {
    return null;
  }
}
getData();
const data= [
  {
      "News": [
          {
              "description": "akka",
              "type": "NEWS"
          }
      ],
      "Event": [
          {
              "description": "akka",
              "type": "EVENT"
          }
      ],
      "Reqrutement": [
          {
              "description": "akka",
              "type": "REQURITMENT"
          }
      ]
  }
]
const renderData = async()=>{
 try {
   const data = await getData(); 
  Object.entries(data[0])?.forEach(([key, value]) => {
   const div = document.createElement('div');
   div.className="col-md-4"
  //  console.log(value);
   div.innerHTML= `
   <h5 class="bg-primary text-white text-center p-2">${key}</h5>
   <div class="news-box p-2">
       ${value.map((data) => `<p class='border p-2'>${data.description}</p>`).join("")}
   </div>
  `;
  newsevent.appendChild(div);
  });
 } catch (error) {
  console.log(error)
 }
}

renderData();