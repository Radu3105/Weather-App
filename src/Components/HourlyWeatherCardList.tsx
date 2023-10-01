import weatherCodes, { sunriseIcon, sunsetIcon } from "../weatherCodes";

interface HourlyWeather {
    hour: string;
    temperature: number;
    weatherCode: number;
}

interface Props {
    hourlyWeather: HourlyWeather[];
    sunrise: string;
    sunset: string;
}

const HourlyWeatherCardList: React.FC<Props> = ({ hourlyWeather, sunrise, sunset }): JSX.Element => {
    const isSunrise = (hour: string) => hour === sunrise.slice(0, 2);
    const isSunset = (hour: string) => hour === sunset.slice(0, 2);

    const displayTemperature = (card: HourlyWeather): JSX.Element => {
        if (isSunrise(card.hour)) return <p>Sunrise</p>;
        if (isSunset(card.hour)) return <p>Sunset</p>;
        return <p>{card.temperature}°</p>;
    };

    const displayHour = (card: HourlyWeather, index: number): JSX.Element => {
        if (index === 0) return <p style={{ fontWeight: "bold" }}>Now</p>;
        if (isSunrise(card.hour)) return <p>{sunrise}</p>;
        if (isSunset(card.hour)) return <p>{sunset}</p>;
        return <p>{card.hour}</p>;
    };

    const displayIcon = (card: HourlyWeather): JSX.Element => {
        const currentHour = parseInt(card.hour, 10);
        const sunriseHour = parseInt(sunrise.slice(0, 2), 10);
        const sunsetHour = parseInt(sunset.slice(0, 2), 10);
        const isDayTime = currentHour >= sunriseHour && currentHour < sunsetHour;
        let iconProps;
        if (isSunrise(card.hour))
            iconProps = { src: sunriseIcon, alt: 'sunrise' };
        else if (isSunset(card.hour))
            iconProps = { src: sunsetIcon, alt: 'sunset' };
        else if (!isDayTime && (card.weatherCode === 0 || card.weatherCode === 1 || card.weatherCode === 2)) 
            iconProps = { src: weatherCodes[card.weatherCode].iconNight, alt: `Weather icon night ${card.weatherCode}` };
        else 
            iconProps = { src: weatherCodes[card.weatherCode].icon, alt: `Weather icon ${card.weatherCode}` };
        return <img {...iconProps} />;
    }

    return (
        <div className="hourly-weather-card-list-container">
            <div className="hourly-weather-card-list-header">
                <p style={{'fontWeight': 'bold'}}>24-HOUR FORECAST</p>
            </div>
            <div className="hourly-weather-card-list">
                {hourlyWeather.map((card, index) => (
                    <div key={index} className="hourly-weather-card">
                        {displayHour(card, index)}
                        {displayIcon(card)}
                        {displayTemperature(card)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HourlyWeatherCardList;
