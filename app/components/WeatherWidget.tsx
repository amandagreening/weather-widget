'use client'

import { useEffect, useState } from 'react'

interface WeatherData {
  temperature: number
  day: string
  time: string
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function getRainDrops() {
  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.6 + Math.random() * 0.4,
    opacity: 0.3 + Math.random() * 0.4,
  }))
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [drops] = useState(getRainDrops)

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=68.2&longitude=14.4&current=temperature_2m&timezone=Europe%2FOslo'
        )
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()

        const now = new Date(data.current.time)
        const day = DAYS[now.getDay()]
        const time = now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
        const temperature = Math.round(data.current.temperature_2m)

        setWeather({ temperature, day, time })
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: 400,
        height: 400,
        borderRadius: 16,
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
        flexShrink: 0,
      }}
    >
      {/* Background */}
      <img
        src="/background.png"
        alt="Lofoten"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
        }}
      />

      {/* Rain drops */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {drops.map((drop) => (
          <div
            key={drop.id}
            style={{
              position: 'absolute',
              top: '-10px',
              left: `${drop.left}%`,
              width: 1,
              height: 12,
              background: 'rgba(255,255,255,0.5)',
              borderRadius: 1,
              opacity: drop.opacity,
              animation: `rain ${drop.duration}s ${drop.delay}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', inset: 0, padding: 32 }}>
        {/* Top left: day + time */}
        <div style={{ position: 'absolute', top: 32, left: 32 }}>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 600, lineHeight: '22px' }}>
            {loading ? '—' : error ? 'Error' : weather?.day}
          </div>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 600, lineHeight: '22px', marginTop: 2 }}>
            {loading ? '—' : error ? '—' : weather?.time}
          </div>
        </div>

        {/* Top right: temperature */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            right: 32,
            color: '#fff',
            fontSize: 72,
            fontWeight: 900,
            lineHeight: '72px',
            letterSpacing: '-2px',
          }}
        >
          {loading ? '—' : error ? '?' : `${weather?.temperature}°`}
        </div>

        {/* Bottom left: location */}
        <div style={{ position: 'absolute', bottom: 32, left: 32 }}>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 600, lineHeight: '22px' }}>
            Lofoten
          </div>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 600, lineHeight: '22px', marginTop: 2 }}>
            Norway
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rain {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(420px); opacity: 0.1; }
        }
      `}</style>
    </div>
  )
}
