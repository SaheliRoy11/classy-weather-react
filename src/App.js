import React from "react";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = { location: "lisbon" };
    this.fetchWeather = this.fetchWeather.bind(this);
  }

  fetchWeather() {
    console.log('Loading data...');
    console.log(this);
  }

  render() {
    return (
      <div className="app">
        <h1>Classy Weather</h1>
        <div>
          <input
            type="text"
            placeholder="Search from location..."
            value={this.state.location}
            onChange={
              //we did not have to manually bind 'this' to the event handler here because we do that only when the event handler is defined as outside method.
              (e) => this.setState({location: e.target.value})
            }
          ></input>
        </div>
        <button onClick={this.fetchWeather}>Get Weather</button>
      </div>
    );
  }
}

export default App;
