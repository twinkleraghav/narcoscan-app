/* ============================================================
   NarcoScan AI — Dashboard Page
   ============================================================ */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTests, getTestStats } from '../services/storage';
import { TestRecord } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, inconclusive: 0, evidenceRecords: 0 });
  const [recentTests, setRecentTests] = useState<TestRecord[]>([]);

  useEffect(() => {
    setStats(getTestStats());
    setRecentTests(getAllTests().slice(0, 5));
  }, []);

  const getResultBadgeClass = (label?: string) => {
    switch (label) {
      case 'Positive': return 'badge badge-positive';
      case 'Negative': return 'badge badge-negative';
      case 'Inconclusive': return 'badge badge-inconclusive';
      default: return 'badge badge-prototype';
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Field screening operations overview and recent evidence</p>
      </div>

      {/* Operational Header */}
      <div className="hero-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3>Digital Field Testing System</h3>
            <p>
              Standard operating procedure workflow: document case metadata, capture presumptive colour-reaction
              test images, evaluate colour measurements, and generate tamper-evident digital records.
            </p>
          </div>
          <div className="status-pill">
            <span className="pulse-dot"></span>
            Prototype • Offline-Ready
          </div>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Tests</div>
          <div className="kpi-value">{stats.total}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Inconclusive</div>
          <div className="kpi-value">{stats.inconclusive}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Evidence Records</div>
          <div className="kpi-value">{stats.evidenceRecords}</div>
        </div>
      </div>

      {/* Primary Action */}
      <div style={{ marginBottom: '20px' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/new-test')}
        >
          Start New Field Test
        </button>
      </div>

      {/* Recent Tests Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Recent Field Tests</h3>
          {recentTests.length > 0 && (
            <button className="btn btn-ghost" onClick={() => navigate('/history')} style={{ fontSize: '12px' }}>
              View All
            </button>
          )}
        </div>

        {recentTests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3>No Field Tests Recorded</h3>
            <p>Start a new field test to initiate screening and generate traceable records.</p>
            <button className="btn btn-primary" onClick={() => navigate('/new-test')}>
              Start First Test
            </button>
          </div>
        ) : (
          <div style={{ padding: '6px' }}>
            {recentTests.map((record) => (
              <div
                key={record.test.testId}
                className="history-item"
                onClick={() => {
                  navigate(`/history`);
                }}
              >
                <div>
                  <div className="col-label">Case ID</div>
                  <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{record.test.caseId}</div>
                </div>
                <div>
                  <div className="col-label">Reagent</div>
                  <div>{record.test.reagentName}</div>
                </div>
                <div>
                  <span className={getResultBadgeClass(record.result?.label)}>
                    {record.result?.label || 'Pending'}
                  </span>
                </div>
                <div>
                  <div className="col-label">Date</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {formatDate(record.test.createdAt)}
                  </div>
                </div>
                <div>
                  {record.evidence ? (
                    <span className="badge badge-evidence">Saved</span>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prototype Disclaimer */}
      <div className="prototype-disclaimer" style={{ marginTop: '20px' }}>
        <span className="disclaimer-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </span>
        <span>
          <strong>Prototype Demonstration Only.</strong> NarcoScan is not a validated forensic instrument.
          Outputs are presumptive screening indications based on demonstration algorithms and must not be used for
          definitive legal identification. Confirmation requires certified laboratory GC-MS or HPLC testing.
        </span>
      </div>
    </div>
  );
}
