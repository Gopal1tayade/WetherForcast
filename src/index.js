
document.addEventListener('DOMContentLoaded', () => {

  //Time
  function updateTime(){
    const date = new Date();
    document.getElementById("date").innerHTML = `${date.toDateString()}`;
    document.getElementById("time").innerHTML=`${date.toLocaleTimeString('en-US')}`;
  }
  setInterval(updateTime, 1000);
 //  updateTime();
 // getting the current position

 document.getElementById('currentlocation').addEventListener('click',function (e){
      e.preventDefault();
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success ,error);
      }else{
        alert('Geolocation is not supported by your browser.');
      }
 });
 
 function success(position){
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  
  const apiURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  
  fetch(apiURL).then(response => response.json()).then(data =>{
    const city =  data.address.city || data.address.town || data.address.village || 'Unknown location';
    sessionStorage.setItem('cityName', city);
    alert(`Your current city is: ${city}`);
    window.location.reload();
  }).catch(() => alert('Failed to retrieve city name. Please try again.'));

 }

 function error() {
  alert('Unable to retrieve your location.');
}

let storedCity = sessionStorage.getItem('cityName');
storedCity = (storedCity === null || storedCity.trim() === '') ? 'London' : storedCity;
console.log(`${storedCity}`);


// api data
 const url =`http://api.weatherapi.com/v1/forecast.json?key=869dedcd8c6b441e89595705242108&q=${storedCity}&days=5`;


async function getData(url) {
  try {
      const response = await fetch(url);
     const resultdata = await response.json();
      console.log(resultdata);

      // current wether information
      document.getElementById("location").innerHTML=`${resultdata.location.name}(${resultdata.location.localtime})`;
      document.getElementById("temprature").innerHTML=`Temprature : ${resultdata.current.temp_c} C`;
     document.getElementById("wind").innerHTML=`Wind : ${resultdata.current.wind_kph} m/s` ;
      document.getElementById("humadity").innerHTML=`Humidity : ${resultdata.current.humidity}%`;
     document.getElementById("envcondition").innerHTML = `${resultdata.current.condition.text}`;
     document.getElementById("image").src = `//cdn.weatherapi.com/weather/64x64/day/116.png`;
      

     // wether forcast for nest 5 days

     const fivedyasforcast = document.getElementById("fivedays");
     fivedyasforcast.innerHTML="";
     resultdata.forecast.forecastday.forEach(days => {
      const forcastSection = document.createElement("section");
      forcastSection.className="bg-lime-400 text-center mt-10 ml-14 mr-14 mb-8 shadow-inner md:shadow-2xl shadow-lime-400/50 rounded-lg leading-8 p-2 md:ml-14 md:p-10 md:leading-10 lg:m-4 lg:p-2 lg:leading-4";
      forcastSection.innerHTML=` <p class="text-xl font-semibold md:text-2xl md:mt-2">Date(${days.date})</p>
                        <img src=${days.day.condition.icon} class="ml-20 mb-2 md:ml-12" width="80px" alt="wether image">
                        <p class="font-semibold md:text-lg">Temprature: ${days.day.avgtemp_c} <sup>0</sup>C</p>
                        <p class="font-semibold md:text-lg">Wind: ${days.day.maxwind_kph} m/s</p>
                        <p class="font-semibold md:text-lg">Humadity: ${days.day.avghumidity}%</p>`;
                        fivedyasforcast.appendChild(forcastSection);

     });
     
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}
getData(url);













  
})
  