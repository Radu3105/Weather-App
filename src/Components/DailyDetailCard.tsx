interface Props {
    name: string;
};

const boldStyle = { fontWeight: 'bold' };

const DailyDetailCard: React.FC<Props> = ({ name }): JSX.Element => {
    return (
        <div className="uvindex-container">
            <div className="daily-weather-card-list-header">
                <p style={boldStyle}>{name}</p>
            </div>
        </div>
    );
}

export default DailyDetailCard;