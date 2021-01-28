import { useState, useEffect, useCallback } from 'react'

const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`)
    .then(response => response.json())
    .then(data => {
      const locationData = data.records.location[0]
      console.log('location data', locationData)

      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['WDSD', 'TEMP'].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue
          }
          return neededElements
        }, {}
      )

      console.log('weatherElements', weatherElements)

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
      }
    })
    .catch(error => console.log('error', error))
}

const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
    .then(response => response.json())
    .then(data => {
      const locationData = data.records.location[0]

      console.log('another set of location data', locationData)

      const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
        if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
          neededElements[item.elementName] = item.time[0].parameter
        }
        return neededElements
      }, {})


      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    })
    .catch(error => console.log('error', error))
}

const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    description: '',
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    comfortability: '',
    weatherCode: 0,
    isLoading: true
  })

  const fetchData = useCallback(async () => {
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather({ authorizationKey, locationName }),
      fetchWeatherForecast({ authorizationKey, cityName })
    ])

    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false
    })
  }, [authorizationKey, cityName, locationName])

  useEffect(() => { fetchData() }, [fetchData])

  return [weatherElement, fetchData]
}

export default useWeatherAPI