'use client'

export default function ScoreRing({ score }) {
  const r = 26
  const circumference = 2 * Math.PI * r
  const fill = (score / 100) * circumference
  const color = score >= 70 ? '#ff3d71' : score >= 40 ? '#ffaa00' : '#4dd0e1'

  return (
    <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
      <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="32" cy="32" r={r} fill="none" stroke="#1e2d3a" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${fill} ${circumference - fill}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: '#00e5ff'
      }}>
        {score}
      </div>
    </div>
  )
}
