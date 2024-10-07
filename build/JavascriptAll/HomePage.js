const newsevent = document.getElementById("news-event");
const news = document.getElementById('news')
const events= document.getElementById('events')
const certificates= document.getElementById('certificates')

const getData=async()=>{
  try {
    const response = await fetch('/headline')
    const data = await response.json()
     return  data
  } catch (error) {
    return null;
  }
}

const titles = {
  NewsHeadline: 'News',
  Event: 'Events',
  Reqrutement: 'Certificates'
};




const renderData = async()=>{
 try {
   const data = await getData(); 
   
  Object.entries(data[0])?.forEach(([key, value]) => {
   const div = document.createElement('div');
   div.className="col-md-4"
   div.innerHTML= `
   <h5 class="bg-primary text-white text-center p-2">
  ${titles[key] || 'Default Title'}
  </h5>
   <div class="news-box p-2">
   ${value.length==0 ? `<p class='border p-2'>${titles[key] || 'Default Title'} not available</p>` : value.map((data) => `<p class='border p-2'> <span class="badge bg-danger new-badge">NEW</span> ${data.description}</p>`).join("")}
   </div>`;
  newsevent.appendChild(div);
  });
 } catch (error) {
  console.error(error)

 }
}

renderData();


