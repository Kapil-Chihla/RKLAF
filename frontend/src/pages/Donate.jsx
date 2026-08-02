import { useMemo, useState } from 'react';
import CountUp from '../components/motion/CountUp';
import Reveal from '../components/motion/Reveal';
import './Donate.css';

const programs = [
  {
    id: 'needed',
    title: "Where it's needed most",
    desc: "We route funds to the month's most urgent cases.",
    icon: 'scales',
  },
  {
    id: 'seniors',
    title: 'Senior Citizens Desk',
    desc: 'Elder maintenance and property protection.',
    icon: 'elder',
  },
  {
    id: 'camps',
    title: 'Legal Aid Camps',
    desc: 'On-the-spot advice where no lawyer practices.',
    icon: 'sprout',
  },
  {
    id: 'literacy',
    title: 'Literacy & RTI Drives',
    desc: 'Modules, videos and student-led RTI work.',
    icon: 'grad',
  },
];

const amounts = [500, 1500, 5000, 10000];

const impactCopy = {
  500: (
    <>
      ₹500 covers <strong>one hour of a village rights camp</strong> — intake desk, forms, and follow-up.
    </>
  ),
  1500: (
    <>
      ₹1,500 covers <strong>one complete case filing</strong>, from drafting to court fee.
    </>
  ),
  5000: (
    <>
      ₹5,000 funds <strong>three case filings</strong> or a full day of camp counsel.
    </>
  ),
  10000: (
    <>
      ₹10,000 sustains <strong>a week of Senior Citizens Desk</strong> casework and hearings.
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

  const effectiveAmount = useMemo(() => {
    if (custom.trim()) {
      const n = Number(custom.replace(/[^\d]/g, ''));
      return Number.isFinite(n) && n > 0 ? n : amount;
    }
    return amount;
  }, [amount, custom]);

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

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="donate donate--v2">
      <div className="container">
        <Reveal as="header" className="donate__intro" variant="up">
          <p className="donate__label">
            <span className="donate__label-rule" aria-hidden="true" />
            Donate
          </p>
          <h1>Fund someone&apos;s day in court</h1>
          <p className="donate__lead">
            100% of public donations go to casework and camps. Every receipt links to our public
            ledger.
          </p>
        </Reveal>

        <div className="donate__layout">
          <Reveal as="div" className="donate__main" variant="up" delay={60}>
            <form className="donate__card" onSubmit={onSubmit}>
              <h2>Choose where your gift goes</h2>
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

              <h2 className="donate__section-title">Choose an amount</h2>
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

              <button type="submit" className="donate__submit">
                {sent
                  ? 'Thank you — we will confirm shortly →'
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
                  <span>Public ledger</span>
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
              <h3>Where the money went last year</h3>
              <p>
                <CountUp as="span" end={62} suffix="%" duration={1400} className="donate__pct" />{' '}
                direct casework ·{' '}
                <CountUp as="span" end={24} suffix="%" duration={1400} className="donate__pct" />{' '}
                camps and helpline ·{' '}
                <CountUp as="span" end={14} suffix="%" duration={1400} className="donate__pct" />{' '}
                literacy hub. Audited statements published every April.
              </p>
            </Reveal>

            <Reveal as="article" className="donate__side-card" variant="up" delay={160}>
              <span className="donate__side-icon" aria-hidden="true">
                <SideIcon name="quote" />
              </span>
              <h3>A donor&apos;s note</h3>
              <blockquote>
                <p>
                  “I sponsored 12 filings last year. RKLAF sent me the outcome of each one. I have
                  never seen giving feel this concrete.”
                </p>
                <footer>— Priya S., monthly member since 2023</footer>
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
