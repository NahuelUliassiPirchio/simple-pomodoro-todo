'use client'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

function CustomTooltip ({ active, payload, label, unit, valueFormatter }) {
  if (!active || !payload?.length) return null
  const display = valueFormatter ? valueFormatter(payload[0].value) : `${payload[0].value} ${unit}`
  return (
    <div style={{
      backgroundColor: 'var(--bs-body-bg)',
      border: '1px solid var(--bs-border-color)',
      borderRadius: '6px',
      padding: '8px 12px',
      fontSize: '0.85rem'
    }}>
      <p className='mb-1 fw-semibold'>{label}</p>
      <p className='mb-0'>{display}</p>
    </div>
  )
}

function RotatedTick ({ x, y, payload }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0} y={0} dy={4}
        textAnchor='end'
        fill='var(--bs-secondary-color)'
        fontSize={11}
        transform='rotate(-40)'
      >
        {payload.value}
      </text>
    </g>
  )
}

export default function ProductivityChart ({ data, dataKey, color, title, unit, period, footnote, tickFormatter, valueFormatter }) {
  const xInterval = period === 90 ? 6 : period === 30 ? 4 : 0
  const rotateLabels = period > 7

  return (
    <div className='mb-4'>
      <p className='text-muted small text-uppercase fw-semibold mb-2'>{title}</p>
      <ResponsiveContainer width='100%' height={180}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: rotateLabels ? 18 : 0 }}>
          <CartesianGrid strokeDasharray='3 3' stroke='var(--bs-border-color)' vertical={false} />
          <XAxis
            dataKey='label'
            tick={rotateLabels ? RotatedTick : { fontSize: 11, fill: 'var(--bs-secondary-color)' }}
            interval={xInterval}
            tickLine={{ stroke: 'var(--bs-border-color)' }}
            axisLine={{ stroke: 'var(--bs-border-color)' }}
          />
          <YAxis
            allowDecimals={false}
            tickFormatter={tickFormatter}
            tick={{ fontSize: 11, fill: 'var(--bs-secondary-color)' }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip content={<CustomTooltip unit={unit} valueFormatter={valueFormatter} />} cursor={{ fill: 'var(--bs-border-color)', opacity: 0.4 }} />
          <Bar dataKey={dataKey} fill={color} radius={[3, 3, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
      {footnote && <p className='text-muted' style={{ fontSize: '0.75rem' }}>{footnote}</p>}
    </div>
  )
}
