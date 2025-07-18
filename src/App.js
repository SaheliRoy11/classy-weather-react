import React from "react";

function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

class App extends React.Component {

  //class fields
  state = {
      location: "",
      isLoading: false,
      displayLocation: "",
      weather: {},
    };

  fetchWeather = async() => {

    if(this.state.location.length < 2) return this.setState({weather: {}});//if name of search location has less than 2 characters then dont start fetching data

    try {
      this.setState({ isLoading: true }); //loading indicator.In the setState() we only need to mention properties we want to change

      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();
      console.log(geoData);

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);
      this.setState({
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      });

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  setLocation = (e) => this.setState({ location: e.target.value })

  //This lifecycle method is called immediately after the component has been rendered, it is the closest thing to useEffect hook on [] dependency. It will run only on mount but not on re-render
  //performs initial side effects as the component loads
  componentDidMount() {

    this.setState({location: localStorage.getItem('location') || ''})//as the component mounts it will read the data from local storage and set the state, if there is no data then set it to empty string.Hence it will re-render the component and after the re-render, componentDidUpdate method will be called
  }

  //React gives this lifecycle method access to previous state and props.Similar to useEffect with variable dependency array, like we can use prevState of location to check if it has changed.The difference is that this method is not called on mount, only on re-render.
  //We can also choose not to do anything with prevProps or prevState
  componentDidUpdate(prevProps, prevState) {
    if(this.state.location !== prevState.location) {
      this.fetchWeather();//enables to search for the weather as we type

      localStorage.setItem("location", this.state.location);//store the name of location being searched
    }
  }

  render() {
    return (
      <div className="app">
        <h1>Classy Weather</h1>

        <Input location={this.state.location} onChangeLocation={this.setLocation}/>

        {this.state.isLoading && <p className="loader">Loading...</p>}

        {this.state.weather.weathercode && (
          <Weather
            weather={this.state.weather}
            location={this.state.displayLocation}
          />
        )}
      </div>
    );
  }
}

export default App;

class Input extends React.Component {
  render() {

    return <div>
          <input
            type="text"
            placeholder="Search from location..."
            value={this.props.location}
            onChange={this.props.onChangeLocation}
          ></input>
        </div>
  }
}


//Create a new component for displaying the full weather
//There is no constructor method in Weather and Day component, this is because if we dont have to initialize state or explicitly bind the 'this' keyword to some event handler method, then we dont need the constructor method in that component
class Weather extends React.Component {

  //the Weather component will unmount if the search location input field is empty
  //This lifecycle method is very similar to returning a clean up function from useEffect.The only difference is that this function will not run in between re-renders
  // componentWillUnmount() {
  //   console.log('Weather unmount');//Just for understanding example.
  // }

  render() {
    //console.log(this.props); //the props received
    const {
      temperature_2m_max: max,
      temperature_2m_min: min,
      time: dates,
      weathercode: codes,
    } = this.props.weather;

    return (
      <div>
        <h2>Weather {this.props.location}</h2>
        <ul className="weather">
          {dates.map((date, i) => (
            <Day
              date={date}
              max={max.at(i)}
              min={min.at(i)}
              code={codes.at(i)}
              key={date}
              isToday={i === 0}
            />
          ))}
        </ul>
      </div>
    );
  }
}

//component for displaying weather of each day
class Day extends React.Component {
  render() {
    const { date, max, min, code, isToday } = this.props;

    return (
      <li className="day">
        <span>{getWeatherIcon(code)}</span>
        <p>{isToday ? "Today" : formatDay(date)}</p>
        <p>
          {Math.floor(min)}&deg; &mdash; <strong>{Math.ceil(max)}&deg;</strong>
        </p>
      </li>
    );
  }
}
