
  //Time
  function updateTime(){
    const date = new Date();
    document.getElementById("date").innerHTML = `${date.toDateString()}`;
    document.getElementById("time").innerHTML=`${date.toLocaleTimeString('en-US')}`;
  }
  setInterval(updateTime, 1000);
 //  updateTime();

  
  
 
 
// api data
 const url = "http://api.weatherapi.com/v1/current.json?key=869dedcd8c6b441e89595705242108&q=London";
 let resultdata = null;


async function getData(url) {
  try {
      const response = await fetch(url);
      resultdata = await response.json();
      console.log(resultdata);
      document.getElementById("location").innerHTML=`${resultdata.location.name}(${resultdata.location.localtime})`;
      document.getElementById("temprature").innerHTML=`Temprature : ${resultdata.current.temp_c} C`;
     document.getElementById("wind").innerHTML=`Wind : ${resultdata.current.wind_kph} m/s` ;
      document.getElementById("humadity").innerHTML=`Humidity : ${resultdata.current.humidity}%`;
     document.getElementById("envcondition").innerHTML = `${resultdata.current.condition.text}`;
     document.getElementById("image").src = `//cdn.weatherapi.com/weather/64x64/day/116.png`;
      
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}
getData(url);








