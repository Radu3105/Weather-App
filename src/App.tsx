import "./App.css";
import React from "react";
import WeatherCard from "./Components/WeatherCard";

const App: React.FC = () => {
    return (
        <>
            {/* Displaying weather card for Craiova */}
            <WeatherCard />
        </>
    );
};

export default App;
