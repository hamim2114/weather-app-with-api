import { useMutation, useQuery } from '@tanstack/react-query';
import './Home.scss';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useEffect, useState } from 'react';

const KEY = '5a44bf47e3b4445faec233126232206';

const Home = () => {
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');
  const [searched, setSearched] = useState(false); // Track if search has been performed
  const [cityFound, setCityFound] = useState(false); // Track if city state is found

  // Get weather data
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['weather-data', city], // Include city as a query key
    queryFn: () =>
      axios
        .get(`https://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${city}&days=5`)
        .then((d) => d.data),
    enabled: searched || cityFound, // Enable the query when search has been performed or city state is found
  });
  console.log(data)
  // Get local city name with IP
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('http://ip-api.com/json');
        const data = await response.json();
        setCity(data.city);
        setCityFound(true); // Mark that city state is found
      } catch (error) {
        console.log(error);
      }
    };

    fetchLocation();
  }, []);

  const handleSearch = () => {
    setCity(search);
    setSearched(true); // Mark that the search has been performed
  };

  useEffect(() => {
    if (city !== '' && !searched) {
      refetch(); // Trigger refetch when city state is found
    }
  }, [city, refetch, searched]);

  // if (isLoading) return <div>loading..</div>;
  return (
    <>
      <div className="home">
        <div className="wrapper">
          <div className="search">
            <input type="text" placeholder="Search City" onChange={(e) => setSearch(e.target.value)} />
            <div className="search-icon" onClick={handleSearch}>
              <SearchIcon />
            </div>
          </div>
          <div className="left">
            <div className="top">
              {
                isLoading ? 'Loading..' : error ? 'City Not found!' : <>
                  <h2>{data.location.name}</h2>
                  <img src={data.current.condition.icon} alt="icon" />
                  <h1>{data.current.temp_c}&deg;C / {data.current.temp_f}&deg;F</h1>
                  <span>Feels Like {data.current.feelslike_c}&deg;C / {data.current.feelslike_f}&deg;F</span>
                  <p>{data.current.condition.text}</p>
                </>
              }
            </div>
            {
              data &&
              <div className="bottom">
                {data &&
                  data.forecast.forecastday.map((d, i) => (
                    <div className="forecast" key={i}>
                      <h5>{new Date(d.date).toLocaleDateString('en-US', { weekday: 'long' })}</h5>
                      <img src={d.day.condition.icon} alt="icon" />
                      <h6>{d.day.avgtemp_c}&deg;C / {d.day.avgtemp_f}&deg;F</h6>
                    </div>
                  ))}
              </div>
            }
          </div>
          {data && (
            <div className="right">
              <div className="more-info">
                {
                  data &&
                  <>
                    <div className="location-data">
                      <div className="name">CITY: <b>{data.location.name}</b> </div>
                      <div className="country">COUNTRY: <b>{data.location.country}</b> </div>
                      <div className="local-time">LOCAL TIME: <b>{data.location.localtime.split(' ')[1]}</b> </div>
                    </div>
                    <div className="update">
                      <div className="last-update">LAST UPDATE: <b>{data.current.last_updated.split(' ')[0]}</b> </div>
                      <div className="temp-c">TEMP-C: <b>{data.current.temp_c}&deg;</b> </div>
                      <div className="temp-f">TEMP-F: <b>{data.current.temp_f}&deg;</b> </div>
                    </div>
                    <div className="wind">
                      <div className="wind-mph">WIND-MPH: <b>{data.current.wind_mph}</b> </div>
                      <div className="wind-kph">WIND-KPH: <b>{data.current.wind_kph}</b> </div>
                      <div className="humidity">HUMIDITY: <b>{data.current.humidity}</b> </div>
                    </div>
                  </>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
