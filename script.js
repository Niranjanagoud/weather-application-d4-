
function getDescription(code) {
    if (code === 0) return "Clear Sky ☀️";
    if ([1, 2, 3].includes(code)) return "Partly Cloudy ⛅";
    if ([45, 48].includes(code)) return "Foggy 🌫️";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle 🌦️";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy 🌧️";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy ❄️";
    if ([95, 96, 99].includes(code)) return "Thunderstorm ⛈️";
    return "Weather information available";
}

async function getWeather() {
    let city = document.getElementById("city").value.trim();

if (city.toLowerCase() === "bangalore") {
    city = "Bengaluru";
}
    const result = document.getElementById("result");
    const button = document.querySelector("button");

    if (!city) {
        result.textContent = "Please enter a city name!";
        return;
    }

    button.disabled = true;
    result.textContent = "Loading weather...";

    try {
        // Step 1: Search only in India
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json&countryCode=IN`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("City search failed");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            result.textContent = "City not found! Try Bengaluru.";
            return;
        }

        // Step 2: Select the city
        const place = geoData.results[0];

        // Step 3: Get weather data
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Weather request failed");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        if (!current) {
            throw new Error("Weather data unavailable");
        }

        // Step 4: Display weather
        result.innerHTML = `
            <h2>${place.name}, ${place.admin1 || ""}, ${place.country}</h2>
            <h1>${current.temperature_2m}°C</h1>
            <h3>${getDescription(current.weather_code)}</h3>
            <p>Feels Like: ${current.apparent_temperature}°C</p>
            <p>Humidity: ${current.relative_humidity_2m}%</p>
            <p>Wind Speed: ${current.wind_speed_10m} km/h</p>
        `;

    } catch (error) {
        console.error(error);
        result.textContent = "Unable to get weather. Check your internet.";
    } finally {
        button.disabled = false;
    }
}

document.getElementById("city").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
