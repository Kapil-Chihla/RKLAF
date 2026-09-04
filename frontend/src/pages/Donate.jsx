import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import { submitContact } from '../lib/submitContact';
import { startDonationCheckout } from '../lib/razorpayCheckout';
import './Donate.css';

const programs = [
  {
    id: 'needed',
    title: 'Provide Legal Aid',
    desc: 'Support individuals and families who need legal assistance and representation but may not be able to afford it.',
    icon: 'scales',
  },
  {
    id: 'camps',
    title: 'Take Legal Aid to Communities',
    desc: 'Help us conduct legal-aid camps, outreach programmes and initiatives that bring legal assistance closer to people.',
    icon: 'sprout',
  },
  {
    id: 'literacy',
    title: 'Make Legal Knowledge Accessible',
    desc: 'Support our Know Your Rights initiatives, including practical guides, legal explainers and other legal-awareness resources.',
    icon: 'grad',
  },
  {
    id: 'research',
    title: 'Research & Public Interest Work',
    desc: 'Help sustain research, RTI initiatives, social surveys and interventions that examine and address wider barriers to justice.',
    icon: 'elder',
  },
];

const amounts = [500, 1500, 5000, 10000];

const impactCopy = {
  500: (
    <>
      Every contribution helps sustain the work, whether it supports a legal-aid matter, a community camp, a
      research initiative or accessible legal resources.
    </>
  ),
  1500: (
    <>
      Every contribution helps sustain the work, whether it supports a legal-aid matter, a community camp, a
      research initiative or accessible legal resources.
    </>
  ),
  5000: (
    <>
      Every contribution helps sustain the work, whether it supports a legal-aid matter, a community camp, a
      research initiative or accessible legal resources.
    </>
  ),
  10000: (
    <>
      Every contribution helps sustain the work, whether it supports a legal-aid matter, a community camp, a
      research initiative or accessible legal resources.
    </>
  ),
};

function formatInr(n) {
  return n.toLocaleString('en-IN');
}

function ProgramIcon({ name }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.55',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (name === 'elder') {
    return (
      <svg {...common}>
        <circle cx="12" cy="7" r="3" />
        <path d="M5 20c1.2-3.5 3.8-5 7-5s5.8 1.5 7 5" />
        <path d="M15 6.2c.6-.4 1.4-.4 2 0" />
      </svg>
    );
  }
  if (name === 'sprout') {
    return (
      <svg {...common}>
        <path d="M12 21V10" />
        <path d="M12 14c-3-1-5-3.5-5-7 4 0 5 2.5 5 5" />
        <path d="M12 12c3-.8 5-3 5-6.5-3.5.2-5 2.5-5 5.5" />
      </svg>
    );
  }
  if (name === 'grad') {
    return (
      <svg {...common}>
        <path d="M3 9l9-4 9 4-9 4-9-4z" />
        <path d="M7 11.5v4.2c0 .8 2.2 2.3 5 2.3s5-1.5 5-2.3v-4.2" />
        <path d="M21 9v6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3v18M5 7h14M7 7l-3 8h6L7 7zm10 0l-3 8h6l-3-8zM8 21h8" />
    </svg>
  );
}

function SideIcon({ name }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.55',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (name === 'quote') {
    return (
      <svg {...common}>
        <path d="M5 7h7v6H8l-1 4H5V7zm9 0h7v6h-4l-1 4h-2V7z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function TrustIcon({ name }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.6',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (name === 'lock') {
    return (
      <svg {...common}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 018 0v3" />
      </svg>
    );
  }
  if (name === 'doc') {
    return (
      <svg {...common}>
        <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </svg>
    );
  }
  if (name === 'ledger') {
    return (
      <svg {...common}>
        <path d="M4 19V5a1 1 0 011-1h4l2 2h8a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1z" />
        <path d="M8 12h8M8 15h5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M4 12a8 8 0 0114.5-4.5M20 12a8 8 0 01-14.5 4.5" />
      <path d="M18.5 3.5V7.5H14.5M5.5 20.5V16.5H9.5" />
    </svg>
  );
}

export default function Donate() {
  const [program, setProgram] = useState('needed');
  const [amount, setAmount] = useState(1500);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pan, setPan] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const effectiveAmount = useMemo(() => {
    if (custom.trim()) {
      const n = Number(custom.replace(/[^\d]/g, ''));
      return Number.isFinite(n) && n > 0 ? n : amount;
    }
    return amount;
  }, [amount, custom]);

  const programMeta = programs.find((p) => p.id === program) || programs[0];

  const impact = impactCopy[effectiveAmount] ?? (
    <>
      ₹{formatInr(effectiveAmount)} goes straight to casework and camps — every rupee on the public ledger.
    </>
  );

  const onPickAmount = (amt) => {
    setAmount(amt);
    setCustom('');
  };

  const onCustomChange = (e) => {
    const v = e.target.value.replace(/[^\d]/g, '');
    setCustom(v);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payment = await startDonationCheckout({
        amountInr: effectiveAmount,
        name: name.trim(),
        email: email.trim(),
        programTitle: programMeta.title,
        pan: pan.trim(),
      });

      try {
        await submitContact({
          name: name.trim(),
          email: email.trim(),
          message: [
            `Donation received via Razorpay.`,
            `Programme: ${programMeta.title}`,
            `Amount: ₹${formatInr(effectiveAmount)}`,
            pan.trim() ? `PAN: ${pan.trim()}` : null,
            `Payment ID: ${payment.razorpay_payment_id}`,
            `Order ID: ${payment.razorpay_order_id}`,
          ]
            .filter(Boolean)
            .join('\n'),
          source: 'donate',
          subject: `[RKLAF] Donation paid — ₹${formatInr(effectiveAmount)}`,
        });
      } catch {
        /* payment already verified; inbox notify is best-effort */
      }

      setSent(true);
    } catch (err) {
      const msg = err?.message || '';
      if (msg === 'Payment cancelled') {
        setError('Payment was cancelled. You can try again when ready.');
      } else {
        setError(msg || 'Payment could not be completed. Please try again or WhatsApp us.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="donate donate--v2">
      <div className="container">
        <Reveal as="header" className="donate__intro" variant="up">
          <p className="donate__label">
            <span className="donate__label-rule" aria-hidden="true" />
            Donate
          </p>
          <h1>Help Keep Justice Within Reach.</h1>
          <p className="donate__lead">
            For many people, a legal problem is not only a question of rights, it is also a question of whether
            they can afford to pursue them. Your contribution helps RKLAF continue providing free legal aid and
            representation to people who need it, while sustaining the research, legal awareness, community
            outreach and public-interest initiatives through which we work to make justice more accessible.
          </p>
        </Reveal>

        <div className="donate__layout">
          <Reveal as="div" className="donate__main" variant="up" delay={60}>
            <form className="donate__card" onSubmit={onSubmit}>
              <h2>Your Support Helps Us</h2>
              <div className="donate__programs" role="radiogroup" aria-label="Donation programme">
                {programs.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={program === p.id}
                    className={`donate__program ${program === p.id ? 'is-active' : ''}`}
                    onClick={() => setProgram(p.id)}
                  >
                    <span className="donate__program-icon" aria-hidden="true">
                      <ProgramIcon name={p.icon} />
                    </span>
                    <span className="donate__program-text">
                      <strong>{p.title}</strong>
                      <span>{p.desc}</span>
                    </span>
                  </button>
                ))}
              </div>

              <h2 className="donate__section-title">Every Contribution Helps Sustain the Work.</h2>
              <p className="donate__amount-hint">Choose an amount that works for you.</p>
              <div className="donate__amounts" role="group" aria-label="Suggested amounts">
                {amounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className={`donate__amount ${!custom && amount === amt ? 'is-active' : ''}`}
                    onClick={() => onPickAmount(amt)}
                  >
                    ₹{formatInr(amt)}
                  </button>
                ))}
              </div>

              <label className="donate__custom">
                <span className="visually-hidden">Custom amount</span>
                <span className="donate__custom-prefix" aria-hidden="true">
                  ₹
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Or type your own amount"
                  value={custom}
                  onChange={onCustomChange}
                />
              </label>

              <div className="donate__impact" role="status">
                <span className="donate__impact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v.01M11 11h1v5h1" />
                  </svg>
                </span>
                <p>{impact}</p>
              </div>

              <div className="donate__fields">
                <label>
                  Full name
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </label>
                <label>
                  Email for receipt
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </label>
              </div>

              <label className="donate__pan">
                PAN (for 80G certificate, optional)
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  maxLength={10}
                  autoComplete="off"
                />
              </label>

              {error ? (
                <p className="donate__form-status donate__form-status--error" role="alert">
                  {error}
                </p>
              ) : null}
              {sent && !error ? (
                <p className="donate__form-status donate__form-status--ok" role="status">
                  Thank you — your donation was received. A receipt will be sent to your email.
                </p>
              ) : null}

              <button type="submit" className="donate__submit" disabled={busy || sent}>
                {busy
                  ? 'Opening secure checkout…'
                  : sent
                    ? 'Donation received →'
                    : `Donate ₹${formatInr(effectiveAmount)} securely →`}
              </button>

              <ul className="donate__trust">
                <li>
                  <TrustIcon name="lock" />
                  <span>256-bit encrypted</span>
                </li>
                <li>
                  <TrustIcon name="doc" />
                  <span>80G tax exemption</span>
                </li>
                <li>
                  <TrustIcon name="ledger" />
                  <Link to="/our-work/reports">Public ledger</Link>
                </li>
                <li>
                  <TrustIcon name="refund" />
                  <span>7-day refund window</span>
                </li>
              </ul>
            </form>
          </Reveal>

          <aside className="donate__aside">
            <Reveal as="article" className="donate__side-card" variant="up" delay={100}>
              <span className="donate__side-icon" aria-hidden="true">
                <SideIcon name="receipt" />
              </span>
              <h3>Support the Work. Strengthen Access to Justice.</h3>
              <p>
                RKLAF is built on the belief that the ability to seek justice should not depend on the ability
                to pay for it. Your contribution helps us keep that belief in practice.
              </p>
            </Reveal>

            <Reveal as="article" className="donate__side-card" variant="up" delay={160}>
              <span className="donate__side-icon" aria-hidden="true">
                <SideIcon name="quote" />
              </span>
              <h3>Donations note</h3>
              <blockquote>
                <p>
                  Donations are subject to applicable laws, regulations and RKLAF&apos;s donation policies.
                  Appropriate receipts and tax documentation, where applicable, will be provided.
                </p>
              </blockquote>
            </Reveal>

            <Reveal as="div" className="donate__photo" variant="up" delay={200}>
              <span className="donate__photo-icon" aria-hidden="true">
                📷
              </span>
              <p>Photo placeholder</p>
              <small>Client thanking case officer outside tribunal</small>
            </Reveal>
          </aside>
        </div>
      </div>
    </div>
  );
}
