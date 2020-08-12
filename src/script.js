function getForecast(cityID) {
    var xhr = new XMLHttpRequest();
    var search = 'http://api.openweathermap.org/data/2.5/forecast?id=' + cityID + '&units=metric&appid=9c050d972bd063785104cfa9e295143b';

    xhr.open('GET', search);
    xhr.addEventListener('load', function() {
        hideElements();
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            todayData(response);
            for (let i=0; i<4; i++) {
                nextDaysData(response, i+1);
            }
        } else if (xhr.status != 200) {
            document.getElementById('weather').classList.remove('hide');
            document.getElementById('weather').innerHTML = '404 Error!'
        }
    });
    xhr.send(null);
}

function getForecastByCity(city) {
    var xhr = new XMLHttpRequest();
    var search = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&appid=9c050d972bd063785104cfa9e295143b';

    xhr.open('GET', search);
    xhr.addEventListener('load', function() {
        hideElements();
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            todayData(response);
            for (let i=0; i<4; i++) {
                nextDaysData(response, i+1);
            }
        } else if (xhr.status != 200) {
            xhr.abort;
        }
    });  
    xhr.send(null);
}

function timeToDay(timestamp) {
    let a = new Date(timestamp*1000);
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[a.getDay()];
}

function todayData(object) {
    let todayWeather = document.getElementById('weather');
    todayWeather.classList.remove('hide');
    todayWeather.innerHTML = '';
    //add City Name
    let cityName = document.createElement('p');
    cityName.innerHTML = object.city.name;
    cityName.className = 'big';
    todayWeather.appendChild(cityName);
    //Convert Unix time to Day and add
    let todayDay = document.createElement('p');
    todayDay.innerHTML = timeToDay(object.list[0].dt);
    todayWeather.appendChild(todayDay);
    todayDay.className = 'medium';
    //add Weather Icon
    let icon = 'http://openweathermap.org/img/wn/' + object.list[0].weather[0].icon + '@2x.png'
    let todayIcon = document.createElement('p');
    todayIcon.innerHTML = '<img src="' + icon + '" alt="weather icon">';
    todayWeather.appendChild(todayIcon);
    //add Temperature
    let todayTemp = document.createElement('p');
    todayTemp.innerHTML = object.list[0].main.temp + '\xB0';
    todayTemp.className = 'big';
    todayWeather.appendChild(todayTemp);
    //add Weather Description
    let todayWeatherDescription = document.createElement('p');
    todayWeatherDescription.innerHTML = object.list[0].weather[0].description;
    todayWeatherDescription.className = 'medium';
    todayWeather.appendChild(todayWeatherDescription);

    //add new Div for wind and pressure
    let newDiv1 = document.createElement('div');
    todayWeather.appendChild(newDiv1);
    //add Wind Speed
    let windSpeed = document.createElement('p');
    windSpeed.innerHTML = 'Wind: ' + object.list[0].wind.speed + ' m/s';
    windSpeed.className = 'inline';
    newDiv1.appendChild(windSpeed);
    //add Pressure
    let pressure = document.createElement('p');
    pressure.innerHTML = 'Pressure: ' + object.list[0].main.pressure + ' hPa';
    pressure.className = 'inline';
    newDiv1.appendChild(pressure);

    //add new Div for humidity and cloudiness
    let newDiv2 = document.createElement('div');
    todayWeather.appendChild(newDiv2);
    //add Humidity
    let humidity = document.createElement('p');
    humidity.innerHTML = 'Humidity: ' + object.list[0].main.humidity + '%';
    humidity.className = 'inline';
    newDiv2.appendChild(humidity);
    //add Cloudiness
    let cloudiness = document.createElement('p');
    cloudiness.innerHTML = 'Cloudiness: ' + object.list[0].clouds.all + '%';
    cloudiness.className = 'inline';
    newDiv2.appendChild(cloudiness);
}

function nextDaysData(object, day) {
    let id = 'day' + day
    let today = document.getElementById(id);
    today.classList.remove('hide');
    today.innerHTML = '';
    let index = day*8;
    //Convert Unix time to Day and add
    let todayDay = document.createElement('p')
    todayDay.innerHTML = timeToDay(object.list[index].dt);
    todayDay.className = 'medium';
    today.appendChild(todayDay);
    //add Weather Icon
    let icon = 'http://openweathermap.org/img/wn/' + object.list[index].weather[0].icon + '@2x.png'
    let todayIcon = document.createElement('p')
    todayIcon.innerHTML = '<img src="' + icon + '" alt="weather icon">';
    today.appendChild(todayIcon);
    //add Temperature
    let todayTemp = document.createElement('p')
    todayTemp.innerHTML = object.list[index].main.temp + '\xB0';
    todayTemp.className = 'big';
    today.appendChild(todayTemp);
    //add Weather Description
    let todayWeatherDescription = document.createElement('p')
    todayWeatherDescription.innerHTML = object.list[index].weather[0].description;
    todayWeatherDescription.className = 'medium';
    today.appendChild(todayWeatherDescription);
}

function hideElements() {
    let divs = document.querySelectorAll('div');
    for (let i=0, c=divs.length; i<c; i++) {
        divs[i].classList.add('hide');
    }
}
//////////////////////////////////////////////////////////////

function search(value) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "city_list.json");
    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            results = JSON.parse(xhr.responseText);
            var resultsArray = [];
            for (let i=0, c=results.length; i<c; i++) {
                var myRegex = new RegExp("^" + value, "i");
                    if (resultsArray.length > 9) {
                        break;
                    } else if (myRegex.test(results[i].name)) {
                        resultsArray.push(results[i]);
                    }
            }
            display(resultsArray);
        }
    });
    xhr.send(null);
}

function display(array) {
    let mainDiv = document.getElementById('results');
    mainDiv.classList.remove('hide');
    mainDiv.innerHTML = '';
    for (let i=0; i<10; i++) {
        if (array[i]) {
            newDiv = document.createElement('div');
            newDiv.textContent = array[i].name + ', ' + array[i].country + ' ' + array[i].state;
            newDiv.tabIndex = i+1;
            mainDiv.appendChild(newDiv);
            addEvents(newDiv, array[i].id);
        } 
    }
}

var input = document.querySelector('input');
input.addEventListener('keyup', function(e) {
    const enterCity = document.getElementById('enterCity');
    enterCity.classList.add('hide');
    if (e.keyCode === 40) {
        e.target.nextElementSibling.firstElementChild.focus();
    } else if (e.keyCode === 13) {
        getForecastByCity(input.value);
        input.focus();
    } else if (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode == 8 && input.value != '') {
        search(input.value);
    }
});

function addEvents(element, id) {
    element.addEventListener('click', function(e) {
        getForecast(id);
        input.value = e.target.textContent;
    });
    element.addEventListener('keyup', function(e) {
        if (e.keyCode == '13') {
            input.value = e.target.textContent;
            getForecast(id);
        } else if (e.keyCode == '40' && e.target.nextElementSibling != null) {
            e.target.nextElementSibling.focus();
        } else if (e.keyCode == '38' && e.target.previousElementSibling != null) {
            e.target.previousElementSibling.focus();
        } else {
            input.focus();
        }
    });
}

document.addEventListener('keydown', function(e) {
    if (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode == 8) {
        input.focus();
    }
});





///////////////////////////////////////////////////////

hideElements();