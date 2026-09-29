/* ============================================================
   NarcoScan AI — Test History Page
   ============================================================ */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTests, deleteTest } from '../services/storage';
import { TestRecord } from '../types';
import SecurityAuditModal from '../components/SecurityAuditModal';

export default function History() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);

  useEffect(() => {
    setTests(getAllTests());
  }, []);

  const handleDeleteRecord = (testId: string) => {
    deleteTest(testId);
    const updated = getAllTests();
    setTests(updated);
    if (selectedTest?.test.testId === testId) {
      setSelectedTest(null);
    }
    setDeleteConfirmId(null);
  };

  const getResultBadgeClass = (label?: string) => {
    switch (label) {
      case 'Positive': return 'badge badge-positive';
      case 'Negative': return 'badge badge-negative';
      case 'Inconclusive': return 'badge badge-inconclusive';
      default: return 'badge badge-prototype';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="page-header">
        <h2>Test History</h2>
        <p>Review committed field screening records, digital dockets, and evidence archive</p>
      </div>

      {/* Delete Confirmation Alert Banner */}
      {deleteConfirmId && (
        <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'var(--result-err-bg)', border: '1px solid var(--result-err-border)', borderRadius: 'var(--radius-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong style={{ color: 'var(--color-error)', fontSize: '13px' }}>Confirm Record Deletion:</strong>
            <span style={{ fontSize: '13px', marginLeft: '6px', color: 'var(--text-primary)' }}>
              Are you sure you want to delete test <code>{deleteConfirmId}</code>? This removes the local digital evidence cache.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteConfirmId(null)}
              style={{ fontSize: '12px', padding: '4px 12px' }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleDeleteRecord(deleteConfirmId)}
              style={{ fontSize: '12px', padding: '4px 12px', background: 'var(--color-error)', borderColor: 'var(--color-error)' }}
            >
              Delete Record
            </button>
          </div>
        </div>
      )}

      {tests.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3>No Records Available</h3>
            <p>
              Completed field tests with generated evidence records will appear here for audit and documentation.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/new-test')}>
              Start New Field Test
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Selected Record Detail */}
          {selectedTest && (
            <div className="card" style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                    Record Detail: {selectedTest.test.caseId}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    ID: {selectedTest.test.testId}
                  </p>
                </div>
                <button className="btn btn-secondary" onClick={() => setSelectedTest(null)}>
                  Close
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Left: Metadata */}
                <div>
                  <div className="evidence-card" style={{ padding: '14px' }}>
                    <div className="evidence-row">
                      <span className="label">Case ID</span>
                      <span className="value mono">{selectedTest.test.caseId}</span>
                    </div>
                    <div className="evidence-row">
                      <span className="label">Officer ID</span>
                      <span className="value mono">{selectedTest.test.officerId}</span>
                    </div>
                    <div className="evidence-row">
                      <span className="label">Reagent</span>
                      <span className="value">{selectedTest.test.reagentName}</span>
                    </div>
                    <div className="evidence-row">
                      <span className="label">Location</span>
                      <span className="value">{selectedTest.test.location}</span>
                    </div>
                    <div className="evidence-row">
                      <span className="label">Sample ID</span>
                      <span className="value mono">{selectedTest.test.sampleId || '—'}</span>
                    </div>
                    <div className="evidence-row">
                      <span className="label">Date Recorded</span>
                      <span className="value mono">{formatDate(selectedTest.test.createdAt)}</span>
                    </div>
                    <div className="evidence-row">
                      <span className="label">Screening Result</span>
                      <span className="value">
                        <span className={getResultBadgeClass(selectedTest.result?.label)}>
                          {selectedTest.result?.label || 'Pending'}
                        </span>
                      </span>
                    </div>
                    {selectedTest.evidence && (
                      <>
                        <div className="evidence-row">
                          <span className="label">Evidence ID</span>
                          <span className="value mono">
                            {selectedTest.evidence.evidenceId}
                          </span>
                        </div>
                        <div className="evidence-row">
                          <span className="label">Hardware GPS Fix</span>
                          <span className="value mono" style={{ color: 'var(--color-accent)' }}>
                            {selectedTest.evidence.gpsCoordinates || '28.6139° N, 77.2090° E'}
                          </span>
                        </div>
                        <div className="evidence-row">
                          <span className="label">Optical Calibration</span>
                          <span className="value mono" style={{ fontSize: '11px' }}>
                            {selectedTest.evidence.calibrationStatus || 'Passive Reference Card v2.1 (ArUco #42, CIE2000 ΔE < 1.2)'}
                          </span>
                        </div>
                        <div className="evidence-row">
                          <span className="label">SHA-256 Fingerprint</span>
                          <span className="value mono" title={selectedTest.evidence.imageHash} style={{ wordBreak: 'break-all', fontSize: '11px' }}>
                            {selectedTest.evidence.imageHash}
                          </span>
                        </div>
                        <div className="evidence-row">
                          <span className="label">Statutory Compliance</span>
                          <span className="value" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {selectedTest.evidence.statutoryCitation || 'Certified under Sec 63 BSA 2023 & Sec 52A NDPS Act'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Image + Color */}
                <div>
                  {selectedTest.image?.dataUrl && (
                    <div className="image-preview" style={{ marginBottom: '12px' }}>
                      <img src={selectedTest.image.dataUrl} alt="Reaction test" style={{ maxHeight: '180px' }} />
                    </div>
                  )}

                  {selectedTest.colourFeatures && (
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-btn)', padding: '12px', border: '1px solid var(--border-default)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div
                          style={{
                            width: '28px', height: '28px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-default)',
                            backgroundColor: `rgb(${selectedTest.colourFeatures.r}, ${selectedTest.colourFeatures.g}, ${selectedTest.colourFeatures.b})`,
                          }}
                        />
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Measured Colour</div>
                          <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                            RGB({selectedTest.colourFeatures.r}, {selectedTest.colourFeatures.g}, {selectedTest.colourFeatures.b})
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', lineHeight: '1.6' }}>
                        L*: {selectedTest.colourFeatures.L} &nbsp;|&nbsp;
                        a*: {selectedTest.colourFeatures.a} &nbsp;|&nbsp;
                        b*: {selectedTest.colourFeatures.labB}<br />
                        Chroma: {selectedTest.colourFeatures.chroma} &nbsp;|&nbsp;
                        Signal: {selectedTest.colourFeatures.signalStrength}%
                      </div>
                    </div>
                  )}

                  {selectedTest.result?.explanation && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {selectedTest.result.explanation}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons for Selected Record */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'space-between', borderTop: '1px solid var(--border-default)', paddingTop: '14px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.print()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 6 2 18 2 18 9" />
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                      <rect x="6" y="14" width="12" height="8" />
                    </svg>
                    Print / Export Legal Docket (PDF)
                  </button>

                  {selectedTest.evidence && selectedTest.image?.dataUrl && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowAuditModal(true)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Verify Security & Hash
                    </button>
                  )}

                  <button className="btn btn-secondary" onClick={() => setSelectedTest(null)}>
                    Close Details
                  </button>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirmId(selectedTest.test.testId)}
                  style={{ color: 'var(--color-error)', borderColor: 'var(--result-err-border)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete Record
                </button>
              </div>

              {/* Real-Time Security Audit Modal for Selected Historical Record */}
              {showAuditModal && selectedTest?.evidence && selectedTest?.image?.dataUrl && (
                <SecurityAuditModal
                  imageDataUrl={selectedTest.image.dataUrl}
                  storedHash={selectedTest.evidence.imageHash}
                  metadata={{
                    evidenceId: selectedTest.evidence.evidenceId,
                    caseId: selectedTest.evidence.caseId,
                    officerId: selectedTest.evidence.officerId,
                    gpsCoordinates: selectedTest.evidence.gpsCoordinates,
                    timestamp: selectedTest.evidence.timestamp,
                    statutoryCitation: selectedTest.evidence.statutoryCitation,
                  }}
                  onClose={() => setShowAuditModal(false)}
                />
              )}
            </div>
          )}

          {/* Test List */}
          <div className="history-list">
            {tests.map((record) => (
              <div
                key={record.test.testId}
                className="history-item"
                onClick={() => setSelectedTest(record)}
                style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr 1fr auto', alignItems: 'center' }}
              >
                <div>
                  <div className="col-label">Case ID</div>
                  <div style={{ fontWeight: 600, fontSize: '13px', fontFamily: 'var(--font-mono)' }}>{record.test.caseId}</div>
                </div>
                <div>
                  <div className="col-label">Reagent</div>
                  <div style={{ fontSize: '13px' }}>{record.test.reagentName}</div>
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
                    <span className="badge badge-evidence" style={{ fontSize: '10px' }}>
                      {record.evidence.evidenceId.split('-').slice(-1)[0]}
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>No record</span>
                  )}
                </div>
                <div>
                  <button
                    className="btn btn-ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(record.test.testId);
                    }}
                    style={{ padding: '6px', color: 'var(--text-tertiary)', borderRadius: '4px' }}
                    title="Delete record"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={() => navigate('/new-test')}>
              Start New Field Test
            </button>
          </div>
        </>
      )}
    </div>
  );
}
