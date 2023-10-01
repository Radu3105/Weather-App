interface HourlyWeatherCard {
    hour: number,
    statusIcon: string,
    temperature: number,
}

const HourlyWeatherCard: React.FC<HourlyWeatherCard> = () => {
    return (
        <div className="weather-card-hourly">
            
        </div>
    )
};

export default HourlyWeatherCard;