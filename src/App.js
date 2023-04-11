import './App.css';
import { useState } from 'react';
import axios from 'axios';

const API_BE = 'http://localhost:3000/dev'

function App() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${API_BE}/weather`,
        {
          location,
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      setWeather(data);
    } catch (err) {
      console.log(err)
      setError(err.response.data.error)
    }
  }
  return (
    <div className="App">
      <h1>Weather app</h1>
      <form
        className="search-form"
        data-cy="search-form"
        onSubmit={handleSubmit}
      >
        <input
          className="location-input"
          data-cy="location-input"
          onChange={({ target: { value } }) => {
            setLocation(value)
          }}
        />
        <button
          className="search-button"
          data-cy="search-button"
        >
          Search
        </button>
      </form>
      {weather && (
        <div
          className="search-results"
          data-cy="search-results"
        >
          <hr />
          <div
            className="search-results-weather"
            data-cy="search-results-weather"
          >
            <img
              src={weather.image}
              alt="icon"
            />
            <div>
              <b>Location:</b> {weather.location} <br />
              <b>Weather:</b> {weather.weather}
            </div>
          </div>
        </div>
      )}
      {error && (
        <div
          className="search-results-error"
          data-cy="search-results-error"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
