'use client'

export default function Header({ tab, setTab }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '0 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 60,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8,12,16,0.92)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 13,
        color: 'var(--accent)', letterSpacing: 2,
        textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 8, height: 8,
          background: 'var(--accent)', borderRadius: '50%',
          boxShadow: '0 0 12px var(--accent)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        LeadFlow AI
      </div>

      {/* Nav Tabs */}
      <div style={{
        display: 'flex', gap: 4,
        background: 'var(--surface)',
        padding: 4, borderRadius: 8,
        border: '1px solid var(--border)',
      }}>
        {[['submit', 'Submit Lead'], ['log', 'Lead Log'], ['dashboard', 'Dashboard']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              fontFamily: 'var(--mono)', fontSize: 11,
              letterSpacing: 1, textTransform: 'uppercase',
              padding: '6px 16px', borderRadius: 5, border: 'none',
              cursor: 'pointer', transition: 'all 0.2s',
              background: tab === id ? 'var(--accent)' : 'transparent',
              color: tab === id ? '#000' : 'var(--muted)',
              fontWeight: tab === id ? 700 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chain Badge */}
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10,
        color: 'var(--muted)', border: '1px solid var(--border)',
        padding: '4px 10px', borderRadius: 4,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{
          width: 6, height: 6, background: '#00ff88',
          borderRadius: '50%', boxShadow: '0 0 8px #00ff88',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        Shardeum Testnet
      </div>
    </header>
  )
}
