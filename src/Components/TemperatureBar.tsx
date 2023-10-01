import React, { useEffect, useRef, useState } from "react";

interface Props {
    minTemp: number;
    maxTemp: number;
    currMinTemp: number;
    currMaxTemp: number;
    currTemp: number;
}

const TemperatureBar: React.FC<Props> = ({ minTemp, maxTemp, currMinTemp, currMaxTemp, currTemp}): JSX.Element => {
    const temperatureBarFullElementRef = useRef<HTMLDivElement>(null);
    const [paddingLeft, setPaddingLeft] = useState(0);
    const [currBarWidth, setCurrBarWidth] = useState(0);

    useEffect(() => {
        if (temperatureBarFullElementRef.current) {
            const fullBarWidth = temperatureBarFullElementRef.current.offsetWidth;
            setPaddingLeft(((currMinTemp - minTemp) * fullBarWidth) / (maxTemp - minTemp));
            setCurrBarWidth(((currMaxTemp - currMinTemp) * fullBarWidth) / (maxTemp - minTemp));
        }   
    }, []);

    return (
        <div className="temperature-bar-container">
            <p>{currMinTemp}°</p>
            <div className="temperature-bar-full" ref={temperatureBarFullElementRef}>
                <div className="temperature-bar-current" style={{width: currBarWidth, marginLeft: paddingLeft}}></div>
            </div>
            <p>{currMaxTemp}°</p>
        </div>
    )
}

export default TemperatureBar;