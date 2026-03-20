import { useState } from "react";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState<null | {
    country: string;
    temperature: number;
    location: string;
    icon: string;
  }>(null);

  const [city, setCity] = useState("");

  const allIcons: Record<string, string> = {
    "01d": "/Assets/clear.png",
    "01n": "/Assets/clear.png",
    "02d": "/Assets/cloud.png",
    "02n": "/Assets/cloud.png",
    "03d": "/Assets/cloud.png",
    "03n": "/Assets/cloud.png",
    "04d": "/Assets/drizzle.png",
    "04n": "/Assets/drizzle.png",
    "09d": "/Assets/rain.png",
    "09n": "/Assets/rain.png",
    "10d": "/Assets/rain.png",
    "10n": "/Assets/rain.png",
    "13d": "/Assets/snow.png",
    "13n": "/Assets/snow.png",
  };

  const search = async (cityName: string) => {
    if (!cityName.trim()) return;

    try {
      const apiKey = "cf2b2386a2aa1bb5aa3e115ec0b52de0";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cityName,
      )}&appid=${apiKey}&units=metric&lang=pt_br`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Cidade não encontrada");
      }

      const data = await response.json();
      const icon = allIcons[data.weather[0].icon] || "/Assets/clear.png";

      const regionNames = new Intl.DisplayNames(["pt-BR"], { type: "region" });

      const countryName = regionNames.of(data.sys.country) ?? "";

      setWeatherData({
        country: countryName,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon,
      });
    } catch (error) {
      console.error(error);
      setWeatherData(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    search(city);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="search-box">
        <input
          type="text"
          placeholder="Write a city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="collumn">
        <img
          src={weatherData?.icon || "/Assets/clear.png"}
          alt="icon of wheather!"
        />
        <p>{weatherData?.temperature ?? "--"}°C</p>
        <span>
          {weatherData && `País: ${weatherData.country}, Cidade: ${weatherData.location}`}
        </span>
      </div>
    </div>
  );
}

export default App;
