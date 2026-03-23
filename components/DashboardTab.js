'use client'

export default function DashboardTab({ leads }) {
  const total = leads.length
  const hot = leads.filter(l => l.tier === 'HOT').length
  const warm = leads.filter(l => l.tier === 'WARM').length
  const cold = leads.filter(l => l.tier === 'COLD').length
  const avgScore = total ? Math.round(leads.reduce((a, l) => a + l.score, 0) / total) : 0
  const timeSaved = total * 12
  const hotRate = total ? Math.round((hot / total) * 100) : 0

  const statCards = [
    { label: 'Total Leads', value: total, color: 'var(--accent)', accent: 'var(--accent)' },
    { label: '🔥 Hot', value: hot, color: 'var(--hot)', accent: 'var(--hot)' },
    { label: '🌤 Warm', value: warm, color: 'var(--warm)', accent: 'var(--warm)' },
    { label: '❄️ Cold', value: cold, color: 'var(--cold)', accent: 'var(--cold)' },
  ]

  const kpis = [
    { label: 'Avg Lead Score', value: total ? `${avgScore}/100` : '—', color: 'var(--accent)' },
    { label: 'Time Saved', value: total ? `~${timeSaved} min` : '—', color: '#00ff88' },
    { label: 'Blockchain Records', value: total || '—', color: 'var(--accent)' },
    { label: 'Hot Lead Rate', value: total ? `${hotRate}%` : '—', color: 'var(--hot)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>Dashboard</h1>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Lead pipeline overview</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map(({ label, value, color, accent }) => (
          <div key={label} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10, padding: 20,
            borderTop: `2px solid ${accent}`,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 36, fontWeight: 700, color, lineHeight: 1, marginBottom: 6 }}>
              {value}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 24px', borderBottom: '1px solid var(--border)',
            background: 'var(--surface2)',
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 2,
            textTransform: 'uppercase', color: 'var(--accent)',
          }}>
            Lead Quality Distribution
          </div>
          <div style={{ padding: 24 }}>
            {total === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>
                No data yet
              </div>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'flex-end', gap: 12,
                height: 140, padding: '0 8px',
                background: 'var(--bg)', borderRadius: 8,
                border: '1px solid var(--border)',
              }}>
                {[
                  { label: 'HOT', count: hot, color: 'var(--hot)' },
                  { label: 'WARM', count: warm, color: 'var(--warm)' },
                  { label: 'COLD', count: cold, color: 'var(--cold)' },
                ].map(({ label, count, color }) => {
                  const pct = total ? (count / total) * 100 : 0
                  return (
                    <div key={label} style={{
                      flex: 1, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end',
                      padding: '8px 0',
                    }}>
                      <div style={{
                        width: '60%', borderRadius: '3px 3px 0 0',
                        height: `${Math.max(pct, 4)}%`,
                        background: color,
                        boxShadow: `0 0 8px ${color}`,
                        transition: 'height 0.8s ease',
                      }} />
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--muted)' }}>{label}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)' }}>{count}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 24px', borderBottom: '1px solid var(--border)',
            background: 'var(--surface2)',
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 2,
            textTransform: 'uppercase', color: 'var(--accent)',
          }}>
            Pipeline Summary
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {kpis.map(({ label, value, color }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 12, background: 'var(--bg)', borderRadius: 6,
                border: '1px solid var(--border)',
              }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase' }}>
                  {label}
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent leads table */}
      {leads.length > 0 && (
        <div style={{ marginTop: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 24px', borderBottom: '1px solid var(--border)',
            background: 'var(--surface2)',
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 2,
            textTransform: 'uppercase', color: 'var(--accent)',
          }}>
            Recent Activity
          </div>
          <div style={{ padding: '8px 0' }}>
            {leads.slice(0, 5).map((lead, idx) => {
              const tc = {
                HOT: '#ff3d71', WARM: '#ffaa00', COLD: '#4dd0e1'
              }[lead.tier]
              return (
                <div key={lead.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 80px 80px',
                  alignItems: 'center', gap: 16,
                  padding: '10px 24px',
                  borderBottom: idx < 4 ? '1px solid var(--border)' : 'none',
                }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{lead.name}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginLeft: 10 }}>{lead.company}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: tc, fontWeight: 700, letterSpacing: 2 }}>{lead.tier}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)' }}>{lead.score}/100</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
