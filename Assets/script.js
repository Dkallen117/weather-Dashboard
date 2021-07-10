var cities = [];

var cityForm = document.getElementById("city-search-form");
var cityInput = document.getElementById("city");
var currentWeather = document.getElementById("current-weather-container");
var citySearch = document.getElementById("searched-city");
var forecastTitle = document.getElementById("forecast");
var forecastContainer = document.getElementById("fiveday-container");
var pastSearchButton = document.getElementById("past-search-buttons");

// Weather search function
const weatherSearch = function(event){
    
    // Prevents page from automatically reloading
    event.preventDefault();

    // Trims white from the string the user input
    var city = cityInput.value.trim();
    
    // If a city is searched
    // run grab current weather and grab 5 day functions
    // move the city the user input to the beginning of the cities array
    // reset the value of the city search input to blank
    // save what the user searched and if no city is searched in the input area 
    // then user wants a past search
    if(city){
        grabCurrentWeather(city);
        grab5Day(city);
        cities.unshift({city});
        cityInput.value = "";
    } else{
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(city);
}

// Save each search within cities array
const saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

// Grab Current Weather data
const grabCurrentWeather = function(city){
    let apiKey = "faa72e4f3283ce545b8b1cc3261eba33";
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

// Grab UV data
const grabUvIndex = function(lat,lon){
    let apiKey = "faa72e4f3283ce545b8b1cc3261eba33"
    let apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data);
        });
    });
}

// Grab 5 day forecast data
const grab5Day = function(city){
    let apiKey = "faa72e4f3283ce545b8b1cc3261eba33";
    let apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

// Displays current weather data from API callback
const displayWeather = function(weather, searchCity){
   
    // Clear old content from current weather container
   // Set text content of searched city h2 to the city the user searched
   currentWeather.textContent= "";  
   citySearch.textContent=searchCity;

   console.log(weather);

   // Create date element
   // Set text content to specified string
   // Append that element to the searched city h2
   var currentDate = document.createElement("span");
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearch.appendChild(currentDate);

   // Create an image element
   // Set attribute to corresponding icon received from API callback
   // Append that element to the searched city h2
   var weatherIcon = document.createElement("img");
   weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearch.appendChild(weatherIcon);

   // Create a span element to hold Temperature data
   // Set text content to specified string
   // Sets class as a list group item
   // Appends element to the current weather container
   var temperature = document.createElement("span");
   temperature.textContent = "Temp: " + weather.main.temp + " °F";
   temperature.classList = "list-group-item";
   currentWeather.appendChild(temperature);
  
   // Create a span element to hold Humidity data
   // Set text content to specified string
   // Sets class as a list group item
   // Appends element to the current weather container
   var humidity = document.createElement("span");
   humidity.textContent = "Humidity: " + weather.main.humidity + " %";
   humidity.classList = "list-group-item";
   currentWeather.appendChild(humidity);

   // Ceate a span element to hold Humidity data
   // Set text content to specified string
   // Sets class as a list group item
   // Appends element to the current weather container
   var wind = document.createElement("span");
   wind.textContent = "Wind Speed: " + weather.wind.speed + " mph";
   wind.classList = "list-group-item";
   currentWeather.appendChild(wind);

   // Set lat and long variables
   // Call grabUvIndex function
   let lat = weather.coord.lat;
   let lon = weather.coord.lon;
   grabUvIndex(lat,lon);

}


 // Displays UV data from API callback
const displayUvIndex = function(index){

    // Create div to hold UV data
    // Set text content to specified string
    // Set class as a list group item
    var uvIndex = document.createElement("div");
    uvIndex.textContent = "UV Index: ";
    uvIndex.classList = "list-group-item";

    // Create a span to hold UV data from API callback
    // Set text content to the value within the index
    uvIndexValue = document.createElement("span");
    uvIndexValue.textContent = index.value;

    // If UV index is below 2, then it's green/ok
    // If it's above 2 but below 8, it's yellow/moderate
    // If it's above 8, it's red/high
    if(index.value <=2){
        uvIndexValue.classList = "text-success";
    }else if(index.value >2 && index.value <=8){
        uvIndexValue.classList = "text-warning";
    }
    else if(index.value >8){
        uvIndexValue.classList = "text-danger";
    };

    // Append the index value span to the index div
    uvIndex.appendChild(uvIndexValue);

    // Append index div to current weather container
    currentWeather.appendChild(uvIndex);
}


// Displays 5 day forecast data from API callback
const display5Day = function(weather){
 
    // Resets content of 5 day container to blank
    // Sets text content of h2 to specified string
    forecastContainer.textContent = "";
    forecastTitle.textContent = "5-Day Forecast:";


    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
      
        var dailyForecast = forecast[i];
        
       
       // Create main forecast div
       // Set as a card for each date within for loop
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       //console.log(dailyForecast)

       // Create a date element
       // Set text content for each card header for each date within the for loop
       // Make text content the header of the card
       // Append date element to forecastEl div
       var forecastDate = document.createElement("h5");
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center";
       forecastEl.appendChild(forecastDate);

       
       // Create an image element
       // Set attribute to whatever icon we receive from API callback
       // Append img element to forecastEl div
       var weatherIcon = document.createElement("img");
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
       forecastEl.appendChild(weatherIcon);
       
       // Create temperature span
       // Set text content to temp data from API callback
       // Append to the forecastEl div
       var forecastTemp=document.createElement("span");
       forecastTemp.classList = "card-body text-center";
       forecastTemp.textContent ="Temp: " + dailyForecast.main.temp + " °F";
       forecastEl.appendChild(forecastTemp);

       // Create humidity span
       // Set text content to humidity data from API callback
       // Append to the forecastEl div
       var forecastHum=document.createElement("span");
       forecastHum.classList = "card-body text-center";
       forecastHum.textContent = "Humidty: " + dailyForecast.main.humidity + "  %";
       forecastEl.appendChild(forecastHum);

       // Create wind span
       // Set text content to wind data from API callback
       // Append to the forecastEl div
       var forecastWind = document.createElement("span");
       forecastWind.classList = "card-body text-center";
       forecastWind.textContent = "Wind Speed: " + dailyForecast.wind.speed + " mph";
       forecastEl.appendChild(forecastWind);

      
        // console.log(forecastEl);
       // Append forecastEl div cards to five day container
        forecastContainer.appendChild(forecastEl);
    }

}

// Displays and creates a button for each city searched
const pastSearch = function(pastSearch){
 
    // Create a button to hold the city the user searched for
    pastSearchEl = document.createElement("button");

    // Set text content to the name of the city
    pastSearchEl.textContent = pastSearch;

    // Set these classes
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";

    // Set these attributes
    pastSearchEl.setAttribute("data-city", pastSearch);
    pastSearchEl.setAttribute("type", "submit");

    // Add button to beginning of past search buttons div
    pastSearchButton.prepend(pastSearchEl);
}

// Runs whenever a past search button is clicked
const pastSearchInput = function(event){

    // Grabs data city attribute
    var city = event.target.getAttribute("data-city");

    // If element contains data city attribute
    // Run grab current weather and 5 day functions for that city
    if(city){
        grabCurrentWeather(city);
        grab5Day(city);
    }
}

// Listen for submission and activate weather search input function
cityForm.addEventListener("submit", weatherSearch);

// Listen for click on any past city button and activate past search input function
pastSearchButton.addEventListener("click", pastSearchInput);