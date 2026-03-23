'use client'

import { useState } from 'react'
import Header from '../components/Header'
import SubmitTab from '../components/SubmitTab'
import LeadLogTab from '../components/LeadLogTab'
import DashboardTab from '../components/DashboardTab'

export default function Home() {
  const [tab, setTab] = useState('submit')
  const [leads, setLeads] = useState([])

  function handleLeadClassified(lead) {
    setLeads(prev => [lead, ...prev])
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      backgroundImage: `
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,229,255,0.07) 0%, transparent 60%),
        linear-gradient(180deg, transparent 0%, rgba(0,229,255,0.02) 100%)
      `,
    }}>
      <Header tab={tab} setTab={setTab} />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
        {tab === 'submit' && <SubmitTab onLeadClassified={handleLeadClassified} />}
        {tab === 'log' && <LeadLogTab leads={leads} />}
        {tab === 'dashboard' && <DashboardTab leads={leads} />}
      </main>
    </div>
  )
}
