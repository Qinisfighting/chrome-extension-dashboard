/* eslint-disable prettier/prettier */
// netlify/functions/weather.ts
import {Handler} from '@netlify/functions';

const handler: Handler = async event => {
  const {lat, lon} = event.queryStringParameters as {lat: string; lon: string};

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Failed to fetch weather data.'}),
    };
  }
};

export {handler};
