import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'
import { useState, useEffect, useMemo } from 'react'
import { getMoment } from './utils/helpers.js'
import useWeatherAPI from './hooks/useWeatherAPI.js'
import WeatherCard from './views/WeatherCard.js'


const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center; 
`

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  }
}

const AUTHORIZATION_KEY = 'CWB-6F9A08E3-0806-4406-A992-F157B05FE585'
const LOCATION_NAME = '臺北'
const LOCATION_NAME_FORECAST = '臺北市'

function App() {
  const [currentTheme, setCurrentTheme] = useState('light')
  const moment = useMemo(() => getMoment(LOCATION_NAME_FORECAST), [])
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName: LOCATION_NAME,
    cityName: LOCATION_NAME_FORECAST,
    authorizationKey: AUTHORIZATION_KEY
  })

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark')
  }, [moment])

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData} />
      </Container>
    </ThemeProvider >
  );
}

export default App;
