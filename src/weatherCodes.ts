/* 
WMO Weather interpretation codes (WW)

0	Clear sky
1, 2, 3	Mainly clear, partly cloudy, and overcast
45, 48	Fog and depositing rime fog
51, 53, 55	Drizzle: Light, moderate, and dense intensity
56, 57	Freezing Drizzle: Light and dense intensity
61, 63, 65	Rain: Slight, moderate and heavy intensity
66, 67	Freezing Rain: Light and heavy intensity
71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
77	Snow grains
80, 81, 82	Rain showers: Slight, moderate, and violent
85, 86	Snow showers slight and heavy
95 *	Thunderstorm: Slight or moderate
96, 99 *	Thunderstorm with slight and heavy hail
*/

declare var require: {
    (path: string): any;
    context: (directory: string, useSubdirectories?: boolean, regExp?: RegExp, mode?: string) => {
        keys: () => string[];
        (id: string): any;
    };
};

const imageContext = require.context('./Assets/Images', false, /\.(png|jpe?g)$/);

const weatherCodes: any = {
    0:  {description: 'Clear Sky', icon: '', iconNight: './0-night.png'},
    1:  {description: 'Mainly Clear', icon: '', iconNight: './1-night.png'},
    2:  {description: 'Partly Cloudy', icon: '', iconNight: './2-night.png'},
    3:  {description: 'Overcast', icon: ''},
    45: {description: 'Fog', icon: ''},
    48: {description: 'Depositing Rime Fog', icon: ''},
    51: {description: 'Light Drizzle', icon: ''},
    53: {description: 'Moderate Drizzle', icon: ''},
    55: {description: 'Heavy Drizzle', icon: ''},
    56: {description: 'Light Freezing Drizzle', icon: ''},
    57: {description: 'Heavy Freezing Drizzle', icon: ''},
    61: {description: 'Slight Rain', icon: ''},
    63: {description: 'Moderate Rain', icon: ''},
    67: {description: 'Heavy Rain', icon: ''},
    71: {description: 'Slight Snow Fall', icon: ''},
    73: {description: 'Moderate Snow Fall', icon: ''},
    75: {description: 'Heavy Snow Fall', icon: ''},
    77: {description: 'Snow Grains', icon: ''},
    80: {description: 'Slight Rain Shower', icon: ''},
    81: {description: 'Moderate Rain Shower', icon: ''},
    82: {description: 'Violent Rain Shower', icon: ''},
    85: {description: 'Slight Snow Shower', icon: ''},
    86: {description: 'Heavy Snow Shower', icon: ''},
    95: {description: 'Thunderstorm', icon: ''},
    96: {description: 'Thunderstorm with Slight Hail', icon: ''},
    97: {description: 'Thunderstorm with Heavy Hail', icon: ''},
};

Object.keys(weatherCodes).forEach((code) => {
    try {
        const image = imageContext(`./${code}.png`);
        weatherCodes[Number(code)].icon = image;
        const nightImage = imageContext(`./${code}-night.png`);
        weatherCodes[Number(code)].iconNight = nightImage;
    } catch (e) {
        console.warn(`Image for code ${code} not found.`);
    }
});

export const sunriseIcon = imageContext(`./sunrise.png`);
export const sunsetIcon = imageContext(`./sunset.png`);

export default weatherCodes;