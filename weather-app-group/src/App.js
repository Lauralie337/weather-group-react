import React from "react";
import "./App.css";
import Form from "./app_component/form.component";
import Weather from "./app_component/weather.component";
import "bootstrap/dist/css/bootstrap.min.css";


import "weather-icons/css/weather-icons.css";

const Api_Key = "429736441cf3572838aa10530929f7cd";



class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: null,
      temp_min: null,
      description: "",
      error: false
    };

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog"
    };
  }

  get_WeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId < 232:
        this.setState({ icon: icons.Thunderstorm });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: icons.Drizzle });
        break;
      case rangeId >= 500 && rangeId <= 521:
        this.setState({ icon: icons.Rain });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: icons.Snow });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: icons.Atmosphere });
        break;
      case rangeId === 800:
        this.setState({ icon: icons.Clear });
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon: icons.Clouds });
        break;
      default:
        this.setState({ icon: icons.Clouds });
    }
  }

  calFahrenheit(temp) {
    let converterKelvToFahr = Math.floor(temp - 273.15);
    let cell = converterKelvToFahr * 1.8 + 32; //changed name && modified for fahrenheit
    return cell;
  }

  getWeather = async e => {
    e.preventDefault();

    
    const city = e.target.elements.city.value;

    if (city) {
      const api_call = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_Key}`
        
      );

      const response = await api_call.json();

      this.setState({
        city: `${response.name}`,        
        main: response.weather[0].main,
        celsius: this.calFahrenheit(response.main.temp),
        temp_max: this.calFahrenheit(response.main.temp_max),
        temp_min: this.calFahrenheit(response.main.temp_min),
        description: response.weather[0].description,
        error: false
      });

      // seting icons
      this.get_WeatherIcon(this.weatherIcon, response.weather[0].id);

      console.log(response);
    } else {
      this.setState({
        error: true
      });
    }
  };

  render() {
    return (
      <div className="App">
        <Form loadweather={this.getWeather} error={this.state.error} />
        <Weather
          cityname={this.state.city}
          weatherIcon={this.state.icon}
          temp_celsius={this.state.celsius}
          temp_max={this.state.temp_max}
          temp_min={this.state.temp_min}
          description={this.state.description}
        />
      </div>
    );
  }
}

export default App;
