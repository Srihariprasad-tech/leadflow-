'use client'

import { useState } from 'react'
import ScoreRing from './ScoreRing'
import { truncateHash } from './blockchain'

export default function LeadLogTab({ leads }) {
  const [expanded, setExpanded] = useState(null)

  const timeSaved = leads.length * 12

  if (leads.length === 0) {
    return (
      <div>
        <SectionHeader title="Lead Log" sub="All classified leads with blockchain proof" count={0} />
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.2 }}>📭</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>No leads classified yet. Submit your first lead.</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SectionHeader title="Lead Log" sub="All classified leads with blockchain proof" count={leads.length} />

      {/* Time saved banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)',
        borderRadius: 8, padding: '10px 16px', marginBottom: 20,
      }}>
        <span style={{ fontSize: 18 }}>⏱</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#00ff88' }}>
          You saved ~{timeSaved} minutes vs manual review
        </span>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '48px 1fr 1fr 100px 120px 100px',
        gap: 16, padding: '8px 20px',
        fontFamily: 'var(--mono)', fontSize: 10,
        letterSpacing: '1.5px', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: 8,
      }}>
        <span>#</span><span>Name</span><span>Company</span><span>Tier</span><span>Score</span><span>Value</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {leads.map((lead, idx) => {
          const isExp = expanded === lead.id
          const barColor = lead.tier === 'HOT' ? 'var(--hot)' : lead.tier === 'WARM' ? 'var(--warm)' : 'var(--cold)'
          const tierColors = {
            HOT: { bg: 'rgba(255,61,113,0.15)', color: '#ff3d71', border: 'rgba(255,61,113,0.3)' },
            WARM: { bg: 'rgba(255,170,0,0.15)', color: '#ffaa00', border: 'rgba(255,170,0,0.3)' },
            COLD: { bg: 'rgba(77,208,225,0.15)', color: '#4dd0e1', border: 'rgba(77,208,225,0.3)' },
          }
          const tc = tierColors[lead.tier]

          return (
            <div
              key={lead.id}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${isExp ? 'rgba(0,229,255,0.3)' : 'var(--border)'}`,
                borderRadius: 10, overflow: 'hidden',
                cursor: 'pointer', transition: 'border-color 0.2s',
              }}
              onClick={() => setExpanded(isExp ? null : lead.id)}
            >
              {/* Row */}
              <div style={{
                padding: '14px 20px',
                display: 'grid',
                gridTemplateColumns: '48px 1fr 1fr 100px 120px 100px',
                alignItems: 'center', gap: 16,
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
                  {String(leads.length - idx).padStart(2, '0')}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{lead.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{lead.email}</div>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>{lead.company}</div>
                <div style={{
                  display: 'inline-flex', padding: '4px 10px', borderRadius: 6,
                  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: 2,
                  textTransform: 'uppercase', background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
                }}>
                  {lead.tier}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${lead.score}%`, height: '100%', background: barColor, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', minWidth: 24 }}>{lead.score}</span>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#00ff88' }}>{lead.estimated_value}</div>
              </div>

              {/* Expanded */}
              {isExp && (
                <div
                  style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}
                  onClick={e => e.stopPropagation()}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    {[
                      { label: 'Reason', value: lead.reason },
                      { label: 'Next Action', value: lead.next_action },
                    ].map(({ label, value }) => (
                      <div key={label} style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 8, padding: 14,
                      }}>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
                        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chain proof */}
                  <div style={{
                    borderRadius: 8, padding: '16px',
                    background: 'rgba(0,229,255,0.02)',
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent)' }}>
                        ⛓ Blockchain Proof
                      </span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)',
                        color: '#00ff88', fontFamily: 'var(--mono)', fontSize: 10,
                        letterSpacing: 1, padding: '3px 8px', borderRadius: 4,
                      }}>✓ Tamper-Proof</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      {[
                        { label: 'TX Hash', val: truncateHash(lead.txHash, 22) },
                        { label: 'Block #', val: lead.blockNum },
                        { label: 'Timestamp', val: new Date(lead.timestamp).toLocaleTimeString() },
                      ].map(({ label, val }) => (
                        <div key={label} style={{
                          background: 'var(--bg)', border: '1px solid var(--border)',
                          borderRadius: 6, padding: '10px 12px',
                        }}>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)' }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SectionHeader({ title, sub, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>{title}</h1>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{sub}</p>
      </div>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)',
        padding: '4px 12px', borderRadius: 20,
      }}>
        {count} records
      </div>
    </div>
  )
}
