import { useState, useEffect } from "react";
import axios from "axios";
import weatherCodes from "../weatherCodes";
import HourlyWeatherCardList from "./HourlyWeatherCardList";
import DailyWeather from "./DailyWeather";
import DailyDetailCard from "./DailyDetailCard";

interface WeatherData {
    // TODO
}

interface searchQueryResponse {
    // TODO
}

type HourlyWeatherData = {
    hour: string,
    weatherCode: number,
    temperature: number,
}

type DailyWeatherData = {
    day: string,
    weatherCode: number,
    minTemperature: number,
    maxTemperature: number,
}

const useStateLocalStorage = (key: string, defaultValue: undefined) => {
    const [value, setValue] = useState(() => {
        try {
            const savedValue = window.localStorage.getItem(key);
            return savedValue ? JSON.parse(savedValue) : defaultValue;  
        }
        catch {
            return defaultValue;
        }
    });

    useEffect(() => {
        const rawValue = JSON.stringify(value);
        window.localStorage.setItem(key, rawValue);
    }, [value]);

    return [value, setValue];
}

const WeatherCard: React.FC = (): JSX.Element => {
    const [weatherData, setWeatherData] = useState<any | undefined>(undefined); // TODO: Change 'any' to 'WeatherData'
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchQueryResponse, setSearchQueryResponse] = useState<any | undefined>([]); // TODO: Change 'any' to 'SearchQueryResponse'
    const [selectedCity, setSelectedCity] = useState<any>(undefined);
    const [searchDropdownOpen, setSearchDropdownOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (selectedCity) {
                try {
                    const response = await axios.get(
                        `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&hourly=weathercode,temperature_2m,uv_index,cloudcover&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&current_weather=true&timezone=auto&forecast_days=16`
                    );
                    console.log(response.data);
                    setWeatherData(response.data);
                    window.localStorage.setItem('weatherData', JSON.stringify(response.data));
                } catch (error) {
                    console.error("Error fetching weather data. " + error);
                }
            }
        };
        fetchWeatherData();
    }, [selectedCity]);

    useEffect(() => {
        const fetchSearchQueryResponse = async () => {
            try {
                const response = await axios.get(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=10&language=en&format=json`
                );
                // console.log(response.data);
                setSearchQueryResponse(response.data);
            } catch (error) {
                console.error("Error fetching geolocation data. " + error);
            }
        };
        fetchSearchQueryResponse();
    }, [searchQuery]);

    const handleOnSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleOnSearchQueryClick = () => {
        setSearchDropdownOpen(true);
        // TODO: Blur everything except the dropdown menu
    };

    // TODO
    const handleOnSearchQueryFocusOut = () => {
        // setSearchDropdownOpen(false);
    }

    const handleOnSearchQueryResponseClick = (city: any): void => {
        setSelectedCity(city);
        setSearchDropdownOpen(false);
        setSearchQuery("");
    };

    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (searchQueryResponse.results) {
            setSelectedCity(searchQueryResponse.results[0]);
        }
    };

    const getHourlyWeather = (): HourlyWeatherData[] => {
        const data = new Array<HourlyWeatherData>();
        const nowHour = new Date().getHours();
        for (let i = nowHour; i <= nowHour + 23; i++) {
            data.push({
                hour: weatherData.hourly.time[i].slice(11, 13),
                
                weatherCode: weatherData.hourly.weathercode[i],
                temperature: Math.round(weatherData.hourly.temperature_2m[i]),
            });
        }
        // console.log(data);
        return data;
    }

    const getDailyWeather = (): DailyWeatherData[] => {
        const dailyWeatherData = new Array<DailyWeatherData>();
        for (let i = 0; i < 16; i++) {
            let date = new Date(weatherData.daily.time[i]);
            dailyWeatherData.push({
                // day: 'TBD',
                day: date.toLocaleDateString("en-US", { weekday: 'long' }).slice(0, 3),
                weatherCode: weatherData.daily.weathercode[i],
                minTemperature: Math.round(weatherData.daily.temperature_2m_min[i]),
                maxTemperature: Math.round(weatherData.daily.temperature_2m_max[i]),
            });
        }
        return dailyWeatherData;
    }

    const getDailySunrise = (): string => {
        return weatherData.daily.sunrise[0].slice(11, weatherData.daily.sunrise[0].length);
    }

    const getDailySunset = (): string => {
        return weatherData.daily.sunset[0].slice(11, weatherData.daily.sunset[0].length);
    }

    const getCurrentTemperature = (): number => {
        return Math.round(weatherData.current_weather.temperature);
    }

    return (
        <>
            <div className="weather-card">
                <div className="weather-card-search">
                    <form
                        className="weather-card-search-form"
                        onSubmit={handleOnSubmit}
                    >
                        <input
                            className="weather-card-search-box"
                            type="text"
                            value={searchQuery}
                            onChange={handleOnSearchQueryChange}
                            onClick={handleOnSearchQueryClick}
                            // onBlur={handleOnSearchQueryFocusOut} // TODO (maybe)
                            placeholder={"Search by city name"}
                        ></input>
                        <div className="weather-card-search-dropdown">
                            {searchDropdownOpen &&
                                searchQueryResponse?.results?.map(
                                    (result: any, index: number) => (
                                        <div
                                            className="weather-card-search-dropdown-item"
                                            key={index}
                                            onClick={() =>
                                                handleOnSearchQueryResponseClick(
                                                    result
                                                )
                                            }
                                        >
                                            {result.name}
                                            <span style={{ fontSize: "12px" }}>
                                                , {result.country}
                                            </span>
                                        </div>
                                    )
                                )}
                        </div>
                    </form>
                </div>
                {weatherData && (
                    <>
                        <div className="weather-card-current-main">
                            {selectedCity && (
                                <>
                                    <p>
                                        {selectedCity.name}
                                        <span style={{ fontSize: "12px" }}>
                                            , {selectedCity.country_code}
                                        </span>
                                    </p>
                                    {
                                        weatherData && (
                                            <>
                                                <p></p>
                                                <p style={{'fontSize': '90px'}}>{Math.round(weatherData.current_weather.temperature)}°</p>
                                                <p>{weatherCodes[weatherData.current_weather.weathercode].description}</p>
                                                <div className="weather-card-high-and-low">
                                                    <p>L: {Math.round(weatherData.daily.temperature_2m_min[0])}°</p>
                                                    <p>H: {Math.round(weatherData.daily.temperature_2m_max[0])}°</p>
                                                </div>
                                            </>
                                        )
                                    }
                                </>
                            )}
                        </div>
                        <HourlyWeatherCardList hourlyWeather={getHourlyWeather()} sunrise={getDailySunrise()} sunset={getDailySunset()} />
                        <div className="weather-16days-daily-more-group">
                            <DailyWeather dailyWeather={getDailyWeather()} currentTemperature={getCurrentTemperature()}/>
                            <div className="weather-daily-more-group">
                                <div className="weather-daily-more-subgroup">
                                    <DailyDetailCard name="UV INDEX"/>
                                    <DailyDetailCard name="SUNRISE"/>
                                </div>
                                <div className="weather-daily-more-subgroup">
                                    <DailyDetailCard name="WIND"/>
                                    <DailyDetailCard name="PRECIPITATION"/>
                                </div>
                                <div className="weather-daily-more-subgroup">
                                    <DailyDetailCard name="HUMIDITY"/>
                                    <DailyDetailCard name="VISIBILITY"/>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default WeatherCard;
