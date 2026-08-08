import { useEffect, useState } from 'react';
import Reveal from '../components/motion/Reveal';
import WorkBrowse from '../components/our-work/WorkBrowse';
import { WorkPageBanner } from '../components/our-work/WorkParts';
import publicApi from '../lib/publicApi';
import { reportPdfDownloadUrl } from '../lib/pdfDownload';
import './OurWork.css';

const FALLBACK_REPORTS = [
  {
    id: 'fb-r1',
    year: '2025–26',
    title: 'Annual Report 2025–26',
    summary: 'Impact, audited financials & ledger',
    file: null,
  },
  {
    id: 'fb-r2',
    year: '2024–25',
    title: 'Annual Report 2024–25',
    summary: 'Impact, audited financials & ledger',
    file: null,
  },
];

export default function AnnualReports() {
  const [annualReports, setAnnualReports] = useState(FALLBACK_REPORTS);

  useEffect(() => {
    publicApi
      .get('/reports')
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length) setAnnualReports(r.data.slice(0, 2));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="work work--v2">
      <WorkPageBanner title="Annual Reports" />
      <WorkBrowse activeId="reports" />

      <section id="reports" className="work-reports">
        <div className="container">
          <Reveal as="p" className="work-section-label" variant="up">
            <span className="work-section-label__rule" aria-hidden="true" />
            Annual reports
          </Reveal>

          <div className="work-reports__grid">
            {annualReports.map((r, i) => {
              const hasPdf = Boolean(r.file);
              return (
                <Reveal key={r.id || r.year} as="article" className="work-report" variant="up" delay={i * 50}>
                  <span className="work-report__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 3h8l4 4v14H7V3z" />
                      <path d="M15 3v4h4M9 12h6M9 16h4" />
                    </svg>
                  </span>
                  <div className="work-report__text">
                    <h3>{r.title || `Annual Report ${r.year}`}</h3>
                    <p>{r.summary || r.label || 'Impact, audited financials & ledger'}</p>
                  </div>
                  {hasPdf ? (
                    <a
                      href={reportPdfDownloadUrl(r.id)}
                      className="work-report__pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pdf ↓
                    </a>
                  ) : (
                    <span className="work-report__pdf work-report__pdf--muted">Pdf ↓</span>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
