'use client'

import { useState } from 'react'
import ScoreRing from './ScoreRing'
import { genTxHash, genBlockNumber, genDecisionHash, truncateHash } from './blockchain'

const THINKING_STEPS = [
  'Parsing lead data...',
  'Analyzing intent signals...',
  'Scoring lead quality...',
  'Generating recommendation...',
  'Logging to Shardeum testnet...',
  'Awaiting block confirmation...',
]

export default function SubmitTab({ onLeadClassified }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [thinkStep, setThinkStep] = useState(-1)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const updateForm = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function classifyLead() {
    if (!form.name || !form.email || !form.company || !form.message) {
      setError('Please fill in all fields.')
      return
    }
    setError('')
    setLoading(true)
    setThinkStep(0)
    setResult(null)

    // Animate thinking steps
    for (let i = 0; i < 4; i++) {
      await new Promise(r => setTimeout(r, 600))
      setThinkStep(i + 1)
    }

    let aiResult = null
    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      aiResult = await res.json()
      if (aiResult.error) throw new Error(aiResult.error)
    } catch (e) {
      setError(e.message || 'Classification failed. Please try again.')
      setLoading(false)
      setThinkStep(-1)
      return
    }

    setThinkStep(4)
    await new Promise(r => setTimeout(r, 700))
    setThinkStep(5)
    await new Promise(r => setTimeout(r, 800))

    const lead = {
      id: Date.now(),
      ...form,
      ...aiResult,
      txHash: genTxHash(),
      blockNum: genBlockNumber(),
      decisionHash: genDecisionHash(form.name, aiResult.tier, aiResult.score),
      timestamp: new Date().toISOString(),
    }

    setResult(lead)
    onLeadClassified(lead)
    setLoading(false)
    setThinkStep(-1)
    setForm({ name: '', email: '', company: '', message: '' })
  }

  const s = {
    panel: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      overflow: 'hidden',
    },
    panelHeader: {
      padding: '14px 24px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    panelTitle: {
      fontFamily: 'var(--mono)', fontSize: 11,
      letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent)',
    },
    panelBody: { padding: 24 },
    label: {
      fontFamily: 'var(--mono)', fontSize: 10,
      letterSpacing: 1.5, textTransform: 'uppercase',
      color: 'var(--muted)', display: 'block', marginBottom: 8,
    },
    input: {
      width: '100%', background: 'var(--bg)',
      border: '1px solid var(--border)', borderRadius: 6,
      padding: '10px 14px', fontFamily: 'var(--mono)',
      fontSize: 13, color: 'var(--text)', outline: 'none',
    },
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>Classify a Lead</h1>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
          AI-powered scoring + immutable blockchain audit trail
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Form */}
        <div style={s.panel}>
          <div style={s.panelHeader}>
            <span style={s.panelTitle}>Lead Input</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>INBOUND CONTACT</span>
          </div>
          <div style={s.panelBody}>
            {error && (
              <div style={{
                background: 'rgba(255,61,113,0.08)', border: '1px solid rgba(255,61,113,0.25)',
                borderRadius: 8, padding: '12px 16px', fontFamily: 'var(--mono)',
                fontSize: 12, color: 'var(--hot)', marginBottom: 16,
              }}>⚠ {error}</div>
            )}
            {[
              { key: 'name', label: 'Full Name', placeholder: 'Jane Smith', type: 'text' },
              { key: 'email', label: 'Email Address', placeholder: 'jane@company.io', type: 'email' },
              { key: 'company', label: 'Company', placeholder: 'Acme Corp', type: 'text' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={s.label}>{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => updateForm(key, e.target.value)}
                  placeholder={placeholder}
                  style={s.input}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,229,255,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>Message</label>
              <textarea
                value={form.message}
                onChange={e => updateForm('message', e.target.value)}
                placeholder="Hi, we're looking to integrate your platform across our 500-person sales team..."
                style={{ ...s.input, resize: 'vertical', minHeight: 90 }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,229,255,0.08)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            <button
              onClick={classifyLead}
              disabled={loading}
              style={{
                width: '100%', padding: 14,
                background: loading ? 'rgba(0,229,255,0.4)' : 'var(--accent)',
                color: '#000', border: 'none', borderRadius: 8,
                fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700,
                letterSpacing: 2, textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 14, height: 14,
                    border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000',
                    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                  }} />
                  Processing...
                </>
              ) : '⚡ Classify with AI'}
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading && (
            <div style={{ ...s.panel, padding: 24 }}>
              <div style={{ ...s.panelTitle, marginBottom: 16 }}>AI Processing</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {THINKING_STEPS.map((step, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    fontFamily: 'var(--mono)', fontSize: 12,
                    color: i < thinkStep ? 'var(--text)' : i === thinkStep ? 'var(--accent)' : 'var(--muted)',
                    opacity: i > thinkStep ? 0.3 : 1,
                    transition: 'all 0.4s',
                  }}>
                    <span style={{ width: 16, textAlign: 'center' }}>
                      {i < thinkStep ? '✓' : i === thinkStep ? '▶' : '·'}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && !loading && (
            <div style={{ ...s.panel, animation: 'slideIn 0.5s ease forwards' }}>
              {/* Hero */}
              <div style={{
                padding: 24, display: 'flex', alignItems: 'center', gap: 20,
                borderBottom: '1px solid var(--border)',
              }}>
                <ScoreRing score={result.score} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{result.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>
                    {result.company} · {result.email}
                  </div>
                </div>
                <TierBadge tier={result.tier} />
              </div>

              {/* Details */}
              <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <DetailBox label="Reason" value={result.reason} span={2} />
                <DetailBox label="Next Action" value={result.next_action} />
                <DetailBox label="Estimated Value" value={result.estimated_value} money />
              </div>

              {/* Blockchain Proof */}
              <div style={{
                borderTop: '1px solid var(--border)',
                padding: '18px 24px',
                background: 'rgba(0,229,255,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ ...s.panelTitle }}>⛓ Blockchain Proof</span>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 10, color: '#00ff88',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{ width: 6, height: 6, background: '#00ff88', borderRadius: '50%', display: 'inline-block' }} />
                    Confirmed
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                  {[
                    { label: 'TX Hash', val: truncateHash(result.txHash) },
                    { label: 'Block', val: `#${result.blockNum}` },
                    { label: 'Decision Hash', val: truncateHash(result.decisionHash, 14) },
                  ].map(({ label, val }) => (
                    <div key={label} style={{
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: 6, padding: '10px 12px',
                    }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', wordBreak: 'break-all' }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)',
                  color: '#00ff88', fontFamily: 'var(--mono)', fontSize: 10,
                  letterSpacing: 1, padding: '4px 10px', borderRadius: 4,
                }}>
                  ✓ Tamper-Proof Record · Shardeum Sphinx
                </div>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div style={{ ...s.panel, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.2 }}>⚡</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
                Fill in the lead form and click<br />
                <span style={{ color: 'var(--accent)' }}>Classify with AI</span> to get started
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TierBadge({ tier }) {
  const colors = {
    HOT: { bg: 'rgba(255,61,113,0.15)', color: '#ff3d71', border: 'rgba(255,61,113,0.3)' },
    WARM: { bg: 'rgba(255,170,0,0.15)', color: '#ffaa00', border: 'rgba(255,170,0,0.3)' },
    COLD: { bg: 'rgba(77,208,225,0.15)', color: '#4dd0e1', border: 'rgba(77,208,225,0.3)' },
  }
  const c = colors[tier]
  return (
    <div style={{
      padding: '6px 16px', borderRadius: 6,
      fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700,
      letterSpacing: 3, textTransform: 'uppercase',
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {tier}
    </div>
  )
}

function DetailBox({ label, value, span, money }) {
  return (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: 8, padding: 14,
      gridColumn: span ? `1 / -1` : undefined,
    }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{
        fontSize: money ? 15 : 13,
        fontFamily: money ? 'var(--mono)' : 'var(--sans)',
        color: money ? '#00ff88' : 'var(--text)',
        fontWeight: money ? 700 : 400,
        lineHeight: 1.5,
      }}>
        {value}
      </div>
    </div>
  )
}
