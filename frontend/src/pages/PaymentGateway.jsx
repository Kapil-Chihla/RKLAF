import { useState } from 'react';
import PageShell from '../components/layout/PageShell';

const programs = [
  { id: 'tihar', name: 'Tihar Jail Undertrial Support', desc: 'Pro-bono defense for undertrials at Delhi Central Jail.' },
  { id: 'clinics', name: 'Community Mobile Clinics', desc: 'Legal awareness and counseling in underserved areas.' },
  { id: 'pil', name: 'Public Interest Litigation Fund', desc: 'PILs for disability rights, child safety, and systemic reform.' },
  { id: 'rti', name: 'National RTI & Audit Drives', desc: 'Student-led transparency and compliance campaigns.' },
  { id: 'malawi', name: 'Project Mpaka Nyaya (Malawi)', desc: 'International legal infrastructure and capacity-building.' },
  { id: 'general', name: 'General Fund', desc: 'Where need is greatest across all RKLAF programs.' },
];

export default function PaymentGateway() {
  const [program, setProgram] = useState('general');
  const [amount, setAmount] = useState(1000);

  const selected = programs.find((p) => p.id === program);

  return (
    <PageShell
      title="Donate"
      subtitle="Program-specific giving — fuel the legal defense of the vulnerable."
    >
      <div className="donate-layout">
        <section className="donate-programs">
          <h3>Select a program</h3>
          <div className="donate-program-grid">
            {programs.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`donate-program-card ${program === p.id ? 'active' : ''}`}
                onClick={() => setProgram(p.id)}
              >
                <strong>{p.name}</strong>
                <span>{p.desc}</span>
              </button>
            ))}
          </div>
        </section>
        <section className="donate-card">
          <h3>Contribution amount</h3>
          <p>Donating to: <strong>{selected?.name}</strong></p>
          <div className="amount-options">
            {[500, 1000, 2500, 5000, 10000].map((amt) => (
              <button
                key={amt}
                type="button"
                className={`amount-btn ${amount === amt ? 'active' : ''}`}
                onClick={() => setAmount(amt)}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-primary">
            Proceed to Pay ₹{amount.toLocaleString('en-IN')} via Razorpay
          </button>
          <p className="donate-note">Secure payment powered by Razorpay. Tax exemption details can be added here.</p>
        </section>
      </div>
    </PageShell>
  );
}
