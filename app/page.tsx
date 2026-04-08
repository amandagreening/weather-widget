import WeatherWidget from './components/WeatherWidget'

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#18181B',
      }}
    >
      <WeatherWidget />
    </div>
  )
}
