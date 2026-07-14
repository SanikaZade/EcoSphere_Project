import { useState } from 'react'
import { useEco } from '../context/EcoContext'
import { Pill } from '../components/UI'

export default function MasterData() {
  const { productProfiles, badges, rewards } = useEco()
  const [tab, setTab] = useState('products')

  const emptyState = (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px',
      color: 'var(--ink-soft)',
      fontSize: 14
    }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
      <div style={{ fontWeight: 500, marginBottom: 6 }}>No data yet</div>
      <div style={{ fontSize: 12.5 }}>Add your first entry using the form.</div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Master Configuration</span>
          <h1 className="page-title">Master Data</h1>
          <p className="page-desc">Product ESG profiles, badges and rewards catalog. Departments, Categories and Emission Factors live under Environmental / Settings.</p>
        </div>
      </div>

      <div className="tabs">
        {['products', 'badges', 'rewards'].map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ products: 'Product ESG Profiles', badges: 'Badges', rewards: 'Rewards' }[t]}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div className="card">
          {productProfiles.length === 0 ? emptyState : (
            <table>
              <thead><tr><th>Product</th><th>Sustainable Material</th><th>Recycled Content</th><th>Carbon Footprint</th></tr></thead>
              <tbody>
                {productProfiles.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.productName}</td>
                    <td>{p.sustainableMaterial ? <Pill tone="green">Yes</Pill> : <Pill tone="gray">No</Pill>}</td>
                    <td>{p.recycledContent}</td>
                    <td>{p.carbonFootprint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'badges' && (
        <div className="card">
          {badges.length === 0 ? emptyState : (
            <table>
              <thead><tr><th>Icon</th><th>Name</th><th>Description</th><th>Unlock Rule</th></tr></thead>
              <tbody>
                {badges.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontSize: 20 }}>{b.icon}</td>
                    <td style={{ fontWeight: 500 }}>{b.name}</td>
                    <td>{b.description}</td>
                    <td>
                      {b.unlockRule ? (
                        <Pill tone="blue">{b.unlockRule.type} ≥ {b.unlockRule.value}</Pill>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'rewards' && (
        <div className="card">
          {rewards.length === 0 ? emptyState : (
            <table>
              <thead><tr><th>Name</th><th>Description</th><th>Points Required</th><th>Stock</th><th>Status</th></tr></thead>
              <tbody>
                {rewards.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    <td>{r.description}</td>
                    <td>{r.pointsRequired}</td>
                    <td>{r.stock}</td>
                    <td><Pill tone={r.status === 'Active' ? 'green' : 'gray'}>{r.status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
