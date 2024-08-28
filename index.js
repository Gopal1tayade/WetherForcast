document.addEventListener("DOMContentLoaded", () => {
  let truefalse = false;

  //Time
  function updateTime() {
    const date = new Date();
    document.getElementById("date").innerHTML = `${date.toDateString()}`;
    document.getElementById("time").innerHTML = `${date.toLocaleTimeString(
      "en-US"
    )}`;
  }
  setInterval(updateTime, 1000);
  //  updateTime();

  const CityNames = JSON.parse(localStorage.getItem("CityName")) || [];
  console.log(CityNames);
  const dropdown = document.getElementById("citys");

  document.getElementById("cityname").addEventListener("focus", () => {
    const filteredCities = CityNames.filter((city) => city.toLowerCase());
    dropdown.innerHTML = "";
    filteredCities.forEach((city) => {
      const listItem = document.createElement("option");
      listItem.value = city;
      dropdown.appendChild(listItem);
    });
  });

  document.getElementById("cityname").addEventListener("input", () => {
    const inputValue = document.getElementById("cityname").value.toLowerCase();
    dropdown.innerHTML = "";
    if (inputValue) {
      const filteredCities = CityNames.filter((city) =>
        city.toLowerCase().includes(inputValue)
      );
      filteredCities.forEach((city) => {
        const listItem = document.createElement("option");
        listItem.value = city;
        dropdown.appendChild(listItem);
      });
    }
  });

  // create a global function to show the data through the city name

  function handleClick(e) {
    e.preventDefault();

    var city = document.getElementById("cityname").value;
    if (!city) {
      alert("enter the city Name.....!");
      return;
    }

    alert("Data will be loaded...........!");

    
    localStorage.setItem("cityName", city);  //sessionStorage.setItem("clickcityName", city);

    if (!CityNames.includes(city)) {
      CityNames.push(city);
    }

    localStorage.setItem("CityName", JSON.stringify(CityNames));
    document.getElementById("cityform").reset();

    var storedCity = localStorage.getItem("cityName");  //sessionStorage.getItem("clickcityName");
    storedCity =
      storedCity === null || storedCity.trim() === "" ? "London" : storedCity;

    console.log(`${storedCity}`);
    const cityUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${storedCity}`;
    const url = `http://api.weatherapi.com/v1/forecast.json?key=869dedcd8c6b441e89595705242108&q=${storedCity}&days=5`;
    
    
    async function executeFunctions() {
      await getData(url);;
      getPosition(cityUrl);
  }
  
  executeFunctions();

  }

  //getting the wether through cityname

  document.getElementById("btn").addEventListener("click", handleClick);

  // getting the current position

  document
    .getElementById("currentlocation")
    .addEventListener("click", function (e) {
      e.preventDefault();
      truefalse = true;
      if (navigator.geolocation) {
        alert("getting your location......... Wait for five second.......!");
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        alert("Geolocation is not supported by your browser.");
      }

      function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        

        const apiURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(apiURL)
          .then((response) => response.json())
          .then((data) => {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "Unknown location";
            localStorage.setItem("cityName", city); // storing the city name in the session storage   sessionStorage.setItem("cityName", city);
            alert(`Your current city is: ${city}`);
            localStorage.setItem("longituted", longitude);
            localStorage.setItem("lattitud", latitude);
            window.location.reload();
          })
          .catch(() =>
            alert("Failed to retrieve city name. Please try again.")
          );
      }

      function error() {
        alert("Unable to retrieve your location.");
      }
    });

  var storedCity = localStorage.getItem("cityName");  //sessionStorage.getItem("cityName");
  storedCity =
    storedCity === null || storedCity.trim() === "" ? "London" : storedCity;
  console.log(`${storedCity}`);

  // api data
  const url = `http://api.weatherapi.com/v1/forecast.json?key=869dedcd8c6b441e89595705242108&q=${storedCity}&days=5`;

  async function getData(url) {
    try {
      const response = await fetch(url);
      const resultdata = await response.json();
      console.log(resultdata);

      // current wether information
      document.getElementById(
        "location"
      ).innerHTML = `${resultdata.location.name}(${resultdata.location.localtime})`;
      document.getElementById(
        "temprature"
      ).innerHTML = `Temprature : ${resultdata.current.temp_c} C`;
      document.getElementById(
        "wind"
      ).innerHTML = `Wind : ${resultdata.current.wind_kph} m/s`;
      document.getElementById(
        "humadity"
      ).innerHTML = `Humidity : ${resultdata.current.humidity}%`;
      document.getElementById(
        "envcondition"
      ).innerHTML = `${resultdata.current.condition.text}`;
      document.getElementById(
        "image"
      ).src = `//cdn.weatherapi.com/weather/64x64/day/116.png`;

      // wether forcast for nest 5 days

      const fivedyasforcast = document.getElementById("fivedays");
      fivedyasforcast.innerHTML = "";
      resultdata.forecast.forecastday.forEach((days) => {
        const forcastSection = document.createElement("section");
        forcastSection.className =
          "bg-lime-400 hover:scale-100 text-center mt-10 ml-14 mr-14 mb-8 md:m-12 shadow-inner md:shadow-2xl shadow-lime-400/50 rounded-lg leading-8 p-2  md:p-10 md:leading-10 lg:m-4 lg:p-2 lg:leading-4";
        forcastSection.innerHTML = ` <p class="text-xl font-semibold md:text-2xl md:mt-2">Date(${days.date})</p>
                        <img src=${days.day.condition.icon} class="ml-20 mb-2 md:ml-12" width="80px" alt="wether image">
                        <p class="font-semibold md:text-lg">Temprature: ${days.day.avgtemp_c} <sup>0</sup>C</p>
                        <p class="font-semibold md:text-lg">Wind: ${days.day.maxwind_kph} m/s</p>
                        <p class="font-semibold md:text-lg">Humadity: ${days.day.avghumidity}%</p>`;
        fivedyasforcast.appendChild(forcastSection);
      });
    } catch (error) {
      console.error("Error fetching data: something enter wrong", error);
      alert("the name of the city is not correct.........!");
    }
  }
  getData(url);

  // after the session is complete , to remove the data from the localstorage
  // function checkServerStatus() {
  //   fetch("http://127.0.0.1:5500/src/")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Server is off");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Server is off: please resatrt the server", error);

  //       localStorage.clear();
  //     });
  // }
  // setInterval(checkServerStatus, 30000);
  // checkServerStatus();

  // Map implementation

  var map = L.map("map").setView([20.5937, 78.9629], 4);

  const lattitud = localStorage.getItem("lattitud");
  const longituted = localStorage.getItem("longituted");

  var marker = L.marker([lattitud, longituted]).addTo(map);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  var precipitationLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=869dedcd8c6b441e89595705242108`
  );
  var temperatureLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=869dedcd8c6b441e89595705242108`
  );
  var windLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=869dedcd8c6b441e89595705242108`
  );

  precipitationLayer.addTo(map); // Add precipitation layer to the map

  var baseMaps = {
    Precipitation: precipitationLayer,
    Temperature: temperatureLayer,
    Wind: windLayer,
  };

  L.control.layers(baseMaps).addTo(map);
  function onMapClick(e) {
    console.log(e.latlng);
    var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    localStorage.setItem("lattitud", e.latlng.lat);
    localStorage.setItem("longituted", e.latlng.lng);
    const apiURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`;

    fetch(apiURL)
      .then((response) => response.json())
      .then((data) => {
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "Unknown location";
        localStorage.setItem("cityName", city); // storing the city name in the session storage   sessionStorage.setItem("cityName", city);
        alert(`Your current city is: ${city}`);
        window.location.reload();
      })
      .catch(() => alert("Failed to retrieve city name. Please try again."));
  }

  map.on("click", onMapClick);


  async function getPosition(url) {
    try{
 const result = await fetch(url);
 const coordinat = await result.json();
 console.log(coordinat)

 const latitude = coordinat[0].lat;
 const longitude =coordinat[0].lon;
 localStorage.setItem('longituted',longitude);
 localStorage.setItem('lattitud',latitude)
window.location.reload();
    }catch(err){
      console.error("Error:", err);
    } 
        } 

   
  
});
