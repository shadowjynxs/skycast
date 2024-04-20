
var data;
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchButton").addEventListener("click", async function () {
        const cityName = document.getElementById("cityName").value.trim();
        if (cityName) {
            const coordinates = await getCityCoordinates(cityName);
            if (coordinates) {

                document.getElementById('currentUpdate').innerHTML = "";
                document.getElementById('hourUpdate').innerHTML = "";
                document.getElementById('dailyUpdate').innerHTML = "";

                const weatherData = await getWeatherForecast(coordinates.latitude, coordinates.longitude, cityName);
                if (weatherData) {
                    console.log("Weather forecast data:", weatherData);
                } else {
                    console.log("Failed to fetch weather forecast data");
                }
            } else {
                console.log("Coordinates not found");
            }
        } else {
            console.log("Please enter a city name");
        }
    });
});

async function getCityCoordinates(city) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
        const data = await response.json();
        if (data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon)
            };
        } else {
            throw new Error("City not found");
        }
    } catch (error) {
        console.error("Error fetching city coordinates:", error);
        return null;
    }
}

async function getWeatherForecast(latitude, longitude, city) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }
        data = await response.json();

        var box = document.getElementById('weatherBox');
        box.classList.remove("invisible")

        var searchBar = document.getElementById('searchBar');
        searchBar.classList.remove('top-1/4')
        searchBar.classList.remove('absolute')

        var navbar = document.getElementById('footer');
        navbar.classList.remove("bottom-0")
        navbar.classList.remove("absolute")

        var currentUpdate = document.getElementById('currentUpdate')
        var hourUpdate = document.getElementById('hourUpdate')
        var dailyUpdate = document.getElementById('dailyUpdate')

        currentUpdate.innerHTML = `
        
        <div class="flex flex-col">
            <span class="text-6xl font-bold" >${data.current.temperature_2m} ${data.current_units.temperature_2m}</span>
            <span class="font-semibold mt-1 text-gray-500 uppercase">${city}</span>
          </div>
          <svg class="h-24 w-24 fill-current text-yellow-400" xmlns="http://www.w3.org/2000/svg" height="24"
            viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79zM1 10.5h3v2H1zM11 .55h2V3.5h-2zm8.04 2.495l1.408 1.407-1.79 1.79-1.407-1.408zm-1.8 15.115l1.79 1.8 1.41-1.41-1.8-1.79zM20 10.5h3v2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-1 4h2v2.95h-2zm-7.45-.96l1.41 1.41 1.79-1.8-1.41-1.41z" />
          </svg>
        
        `

        for (let i = 0; i < 5; i++) {
            hourUpdate.innerHTML += `
            
            <div class="flex flex-col items-center">
      <span class="font-semibold text-lg">${data.hourly.temperature_2m[i]} ${data.hourly_units.temperature_2m}</span>
      <img class="h-10 w-10" src="${getWeatherInfo(data.hourly.weather_code[i]).day.image}">
      <span class="font-semibold mt-1 text-sm">${parseTimeString(data.hourly.time[i]).time}</span>
      <span class="text-xs font-semibold text-gray-400">${parseTimeString(data.hourly.time[i]).ap}</span>
    </div>
            
            `;

            dailyUpdate.innerHTML += `
            
            <div class="flex justify-between items-center">
    <span class="font-semibold text-lg w-1/4" >${fparseDateString(data.daily.time[i])}</span>
    <div class="flex items-center justify-end w-1/4 pr-10">
      <span class="font-semibold" id="prec1">${data.daily.precipitation_probability_max[i]} ${data.daily_units.precipitation_probability_max}</span>
      <svg class="w-6 h-6 fill-current ml-1" viewBox="0 0 16 20" version="1.1" xmlns="http://www.w3.org/2000/svg" >
        <g transform="matrix(1,0,0,1,-4,-2)">
          <path d="M17.66,8L12.71,3.06C12.32,2.67 11.69,2.67 11.3,3.06L6.34,8C4.78,9.56 4,11.64 4,13.64C4,15.64 4.78,17.75 6.34,19.31C7.9,20.87 9.95,21.66 12,21.66C14.05,21.66 16.1,20.87 17.66,19.31C19.22,17.75 20,15.64 20,13.64C20,11.64 19.22,9.56 17.66,8ZM6,14C6.01,12 6.62,10.73 7.76,9.6L12,5.27L16.24,9.65C17.38,10.77 17.99,12 18,14C18.016,17.296 14.96,19.809 12,19.74C9.069,19.672 5.982,17.655 6,14Z" style="fill-rule:nonzero;"/>
        </g>
      </svg>
    </div>
    <img class="h-10 w-10" src="${getWeatherInfo(data.daily.weather_code[i]).day.image}">
    <span class="font-semibold text-lg w-1/4 text-right" id="temp1">${data.daily.temperature_2m_min[i]} ${data.daily_units.temperature_2m_min} / ${data.daily.temperature_2m_max[i]} ${data.daily_units.temperature_2m_max}</span>
  </div>
            
            `
        }


        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

function getWeatherInfo(wmoCode) {
    if (wmo.hasOwnProperty(wmoCode)) {
        return wmo[wmoCode];
    } else {
        return null;
    }
}



function parseTimeString(timeString) {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${hours12}:${formattedMinutes} ${amOrPm}`;

    return {
        time: hours12,
        ap: amOrPm
    };
}



function fparseDateString(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;
    return formattedDate;
}


function parseDateTime(datetimeString) {
    const date = new Date(datetimeString);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[date.getDay()];

    const dayOfMonth = date.getDate();

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];

    return {
        dayOfWeek: dayOfWeek,
        dayOfMonth: dayOfMonth,
        month: month
    };
}



wmo = {
    "0": {
        "day": {
            "description": "Sunny",
            "image": "/images/sunny.svg"
        },
        "night": {
            "description": "Clear",
            "image": "/images/sunny.svg"
        }
    },
    "1": {
        "day": {
            "description": "Mainly Sunny",
            "image": "/images/sunny.svg"
        },
        "night": {
            "description": "Mainly Clear",
            "image": "http://openweathermap.org/img/wn/01n@2x.png"
        }
    },
    "2": {
        "day": {
            "description": "Partly Cloudy",
            "image": "/images/cloudy.svg"
        },
        "night": {
            "description": "Partly Cloudy",
            "image": "/images/cloudy.svg"
        }
    },
    "3": {
        "day": {
            "description": "Cloudy",
            "image": "/images/cloudy.svg"
        },
        "night": {
            "description": "Cloudy",
            "image": "/images/cloudy.svg"
        }
    },
    "45": {
        "day": {
            "description": "Foggy",
            "image": "http://openweathermap.org/img/wn/50d@2x.png"
        },
        "night": {
            "description": "Foggy",
            "image": "http://openweathermap.org/img/wn/50n@2x.png"
        }
    },
    "48": {
        "day": {
            "description": "Rime Fog",
            "image": "http://openweathermap.org/img/wn/50d@2x.png"
        },
        "night": {
            "description": "Rime Fog",
            "image": "http://openweathermap.org/img/wn/50n@2x.png"
        }
    },
    "51": {
        "day": {
            "description": "Light Drizzle",
            "image": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "night": {
            "description": "Light Drizzle",
            "image": "http://openweathermap.org/img/wn/09n@2x.png"
        }
    },
    "53": {
        "day": {
            "description": "Drizzle",
            "image": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "night": {
            "description": "Drizzle",
            "image": "http://openweathermap.org/img/wn/09n@2x.png"
        }
    },
    "55": {
        "day": {
            "description": "Heavy Drizzle",
            "image": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "night": {
            "description": "Heavy Drizzle",
            "image": "http://openweathermap.org/img/wn/09n@2x.png"
        }
    },
    "56": {
        "day": {
            "description": "Light Freezing Drizzle",
            "image": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "night": {
            "description": "Light Freezing Drizzle",
            "image": "http://openweathermap.org/img/wn/09n@2x.png"
        }
    },
    "57": {
        "day": {
            "description": "Freezing Drizzle",
            "image": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "night": {
            "description": "Freezing Drizzle",
            "image": "http://openweathermap.org/img/wn/09n@2x.png"
        }
    },
    "61": {
        "day": {
            "description": "Light Rain",
            "image": "http://openweathermap.org/img/wn/10d@2x.png"
        },
        "night": {
            "description": "Light Rain",
            "image": "http://openweathermap.org/img/wn/10n@2x.png"
        }
    },
    "63": {
        "day": {
            "description": "Rain",
            "image": "http://openweathermap.org/img/wn/10d@2x.png"
        },
        "night": {
            "description": "Rain",
            "image": "http://openweathermap.org/img/wn/10n@2x.png"
        }
    },
    "65": {
        "day": {
            "description": "Heavy Rain",
            "image": "http://openweathermap.org/img/wn/10d@2x.png"
        },
        "night": {
            "description": "Heavy Rain",
            "image": "http://openweathermap.org/img/wn/10n@2x.png"
        }
    },
    "66": {
        "day": {
            "description": "Light Freezing Rain",
            "image": "http://openweathermap.org/img/wn/10d@2x.png"
        },
        "night": {
            "description": "Light Freezing Rain",
            "image": "http://openweathermap.org/img/wn/10n@2x.png"
        }
    },
    "67": {
        "day": {
            "description": "Freezing Rain",
            "image": "http://openweathermap.org/img/wn/10d@2x.png"
        },
        "night": {
            "description": "Freezing Rain",
            "image": "http://openweathermap.org/img/wn/10n@2x.png"
        }
    },
    "71": {
        "day": {
            "description": "Light Snow",
            "image": "http://openweathermap.org/img/wn/13d@2x.png"
        },
        "night": {
            "description": "Light Snow",
            "image": "http://openweathermap.org/img/wn/13n@2x.png"
        }
    },
    "73": {
        "day": {
            "description": "Snow",
            "image": "http://openweathermap.org/img/wn/13d@2x.png"
        },
        "night": {
            "description": "Snow",
            "image": "http://openweathermap.org/img/wn/13n@2x.png"
        }
    },
    "75": {
        "day": {
            "description": "Heavy Snow",
            "image": "http://openweathermap.org/img/wn/13d@2x.png"
        },
        "night": {
            "description": "Heavy Snow",
            "image": "http://openweathermap.org/img/wn/13n@2x.png"
        }
    },
    "77": {
        "day": {
            "description": "Snow Grains",
            "image": "http://openweathermap.org/img/wn/13d@2x.png"
        },
        "night": {
            "description": "Snow Grains",
            "image": "http://openweathermap.org/img/wn/13n@2x.png"
        }
    },
    "80": {
        "day": {
            "description": "Light Showers",
            "image": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "night": {
            "description": "Light Showers",
            "image": "http://openweathermap.org/img/wn/09n@2x.png"
        }
    },
    "81": {
        "day": {
            "description": "Showers",
            "image": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "night": {
            "description": "Showers",
            "image": "http://openweathermap.org/img/wn/09n@2x.png"
        }
    },
    "82": {
        "day": {
            "description": "Heavy Showers",
            "image": "http://openweathermap.org/img/wn/09d@2x.png"
        },
        "night": {
            "description": "Heavy Showers",
            "image": "http://openweathermap.org/img/wn/09n@2x.png"
        }
    },
    "85": {
        "day": {
            "description": "Light Snow Showers",
            "image": "http://openweathermap.org/img/wn/13d@2x.png"
        },
        "night": {
            "description": "Light Snow Showers",
            "image": "http://openweathermap.org/img/wn/13n@2x.png"
        }
    },
    "86": {
        "day": {
            "description": "Snow Showers",
            "image": "http://openweathermap.org/img/wn/13d@2x.png"
        },
        "night": {
            "description": "Snow Showers",
            "image": "http://openweathermap.org/img/wn/13n@2x.png"
        }
    },
    "95": {
        "day": {
            "description": "Thunderstorm",
            "image": "http://openweathermap.org/img/wn/11d@2x.png"
        },
        "night": {
            "description": "Thunderstorm",
            "image": "http://openweathermap.org/img/wn/11n@2x.png"
        }
    },
    "96": {
        "day": {
            "description": "Light Thunderstorms With Hail",
            "image": "http://openweathermap.org/img/wn/11d@2x.png"
        },
        "night": {
            "description": "Light Thunderstorms With Hail",
            "image": "http://openweathermap.org/img/wn/11n@2x.png"
        }
    },
    "99": {
        "day": {
            "description": "Thunderstorm With Hail",
            "image": "http://openweathermap.org/img/wn/11d@2x.png"
        },
        "night": {
            "description": "Thunderstorm With Hail",
            "image": "http://openweathermap.org/img/wn/11n@2x.png"
        }
    }
}