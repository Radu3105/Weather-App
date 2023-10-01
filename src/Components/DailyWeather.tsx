import weatherCodes from "../weatherCodes";
import TemperatureBar from "./TemperatureBar";

interface DailyWeather {
    day: string;
    weatherCode: number;
    minTemperature: number;
    maxTemperature: number;
}

interface Props {
    dailyWeather: DailyWeather[];
    currentTemperature: number;
}

const boldStyle = { fontWeight: 'bold' };

const DailyWeather: React.FC<Props> = ({ dailyWeather, currentTemperature }): JSX.Element => {
    const minTemp = Math.min(...dailyWeather.map(d => d.minTemperature));
    const maxTemp = Math.max(...dailyWeather.map(d => d.maxTemperature));    

    const displayDay = (card: DailyWeather, index: number): JSX.Element => {
        return index !== 0 ? <p>{card.day}</p> : <p style={boldStyle}>Today</p>
    }

    return (
        <div className="daily-weather-card-list-container">
            <div className="daily-weather-card-list-header">
                <p style={{'fontWeight': 'bold'}}>16-DAY FORECAST</p>
            </div>
            <div className="daily-weather-card-list">
                {dailyWeather.map((card, index) => (
                    <div key={index} className="daily-weather-card">
                        <div className="daily-weather-card-day">
                            {displayDay(card, index)}
                        </div>
                        <div className="daily-weather-card-icon">
                            <img src={weatherCodes[card.weatherCode].icon} alt={`Weather icon ${card.weatherCode}`}></img>
                        </div>
                        <TemperatureBar 
                            minTemp={minTemp} 
                            maxTemp={maxTemp} 
                            currMinTemp={dailyWeather[index].minTemperature} 
                            currMaxTemp={dailyWeather[index].maxTemperature} 
                            currTemp={currentTemperature}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DailyWeather;