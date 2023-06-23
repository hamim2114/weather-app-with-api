import { useQuery } from '@tanstack/react-query';
import './Home.scss';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useEffect, useState } from 'react';

const KEY = '5a44bf47e3b4445faec233126232206';

const Home = () => {
  const [city, setCity] = useState("");

  //get weather data
  const { isLoading, error, data } = useQuery({
    queryKey: ['weather-data'],
    queryFn: () => axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=Chittagong&days=5`).then(d => d.data)
  });

  //get local city name with ip
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("http://ip-api.com/json");
        const data = await response.json();
        setCity(data.city);
      } catch (error) {
        console.log("Error retrieving location:", error);
      }
    };

    fetchLocation();
  }, []);

  console.log(city)
  if (isLoading) return <div>loading..</div>
  return (
    <>
      {isLoading ? 'Loading..' : error ? 'Something went wrong!' : <div className="home">
        <div className="wrapper">
          <div className="left">
            <div className="top">
              <div className="search">
                <input type="text" placeholder='Search City' />
                <SearchIcon />
              </div>
              <h2>{data.location.name}</h2>
              <img src={data.current.condition.icon} alt="icon" />
              <h1>{data.current.temp_c}&deg;C / {data.current.temp_f}&deg;F</h1>
              <span>Feels Like {data.current.feelslike_c}&deg;C / {data.current.feelslike_f}&deg;F</span>
              <p>{data.current.condition.text}</p>
            </div>
            <div className="bottom">
              {
                data.forecast.forecastday.map((d, i) => (
                  <div className="forcast" key={i}>
                    <h5>{new Date(d.date).toLocaleDateString('en-US', { weekday: 'long' })}</h5>
                    <img src={d.day.condition.icon} alt="icon" />
                    <h6>{d.day.avgtemp_c}&deg;C / {d.day.avgtemp_f}&deg;F</h6>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="right">
            <div className="more-info">
              <div className="location-data">
                <div className="name">CITY: <b>{data.location.name}</b> </div>
                <div className="country">COUNTRY: <b>{data.location.country}</b> </div>
                <div className="local-time">LOCAL TIME: <b>{data.location.localtime.split(' ')[1]}</b> </div>
              </div>
              <div className="update">
                <div className="lst-update">LAST UPDATE: <b>{data.current.last_updated.split(' ')[0]}</b> </div>
                <div className="temp-c">TEMP-C: <b>{data.current.temp_c}&deg;</b> </div>
                <div className="temp-f">TEMP-F: <b>{data.current.temp_f}&deg;</b> </div>
              </div>
              <div className="wind">
                <div className="wind-mph">WIND-MPH: <b>{data.current.wind_mph}</b> </div>
                <div className="wind-kph">WIND-KPH: <b>{data.current.wind_kph}</b> </div>
                <div className="humidity">HUMADITY: <b>{data.current.humidity}</b> </div>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </>
  )
}

export default Home