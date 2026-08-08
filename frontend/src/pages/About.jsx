import { useRef, useState } from 'react';
import { OFFICE_DELHI, OFFICE_IMPHAL } from '../data/navigation';
import Reveal from '../components/motion/Reveal';
import photoDada from '../assets/_unused/dada.jpeg';
import photoDadi from '../assets/_unused/dadi.jpeg';
import photoAjayHero from '../assets/aboutusi.jpeg';
import photoAjayStory from '../assets/_unused/father.jpeg';
import photoOffice from '../assets/_unused/comunityoutreach.jpeg';
import officeVideo from '../assets/officevideo.mp4';
import './About.css';

const LINEAGE = [
  {
    id: 'rs-garg',
    mark: false,
    disc: photoDada,
    discLabel: 'R.S. GARG',
    discPos: 'center 22%',
    label: 'Late Sh. R.S. Garg',
    tag: 'The bench',
    role: 'Where it began',
    name: 'Late Sh. R.S. Garg',
    sub: 'Judicial Officer, then Advocate',
    photo: photoDada,
    photoFit: 'contain',
    photoHint: 'Late Sh. R.S. Garg',
    text: 'He started his career not as a courtroom advocate, but as a Judicial Officer in Haryana, sitting quite literally on the other side of the bench, seeing firsthand how the machinery of justice moved and who it so often left behind. That early vantage point stayed with him. When he later moved to Delhi and began practicing in the District Courts and the High Court of Delhi, one thing about him never changed: he could never say no to a person in need, fee or no fee. Case after case, quietly and without fanfare, his pro bono practice became the defining part of his career.',
  },
  {
    id: 'krishna-garg',
    mark: false,
    disc: photoDadi,
    discLabel: 'KRISHNA GARG',
    discPos: 'center 22%',
    label: 'Late Smt. Krishna Garg',
    tag: 'Beside him',
    role: 'Beside him, always',
    name: 'Late Smt. Krishna Garg',
    sub: 'A woman of deep faith and quiet strength',
    photo: photoDadi,
    photoFit: 'contain',
    photoHint: 'Late Smt. Krishna Garg',
    text: 'He did not do this alone. His wife stood beside him through every one of those years, supporting his charitable work in the way that partners often do, without ever asking for recognition. The Foundation carries both their names because the work was always theirs together.',
  },
  {
    id: 'registered',
    mark: true,
    disc: null,
    discLabel: '2016',
    label: '25 Nov 2016',
    tag: 'Registered',
    role: 'A foundation born from memory',
    name: '25th November, 2016',
    sub: 'Registered as a Charitable Trust',
    photo: null,
    photoFit: 'cover',
    photoHint: 'Trust registration, 25 November 2016',
    text: 'When they passed on, their son chose to give their life’s quiet work a permanent home. He registered the Radhey Krishna Legal Aid Foundation as a Charitable Trust, named for his parents and built on the very principle they had lived by.',
  },
  {
    id: 'ajay-garg',
    mark: false,
    disc: photoAjayStory,
    discLabel: 'AJAY GARG',
    discPos: 'left center',
    label: 'Mr. Ajay Garg',
    tag: 'Chief Trustee',
    role: 'Chief Trustee and Founder',
    name: 'Mr. Ajay Garg, Advocate',
    sub: 'Supreme Court of India and Delhi High Court',
    photo: photoAjayStory,
    photoFit: 'cover',
    photoPos: 'left center',
    photoHint: 'Mr. Ajay Garg, Advocate',
    text: 'A law graduate of Campus Law Centre, Delhi University, with over 30 years of experience as a practicing Advocate before the Supreme Court of India and the Delhi High Court. He has been awarded and honoured by eminent dignitaries in Indian academia for his contributions to the legal field, and has personally conducted numerous pro bono matters before the Supreme Court and the Delhi High Court, several of which now stand as reported judgments.',
  },
  {
    id: 'ruchi-garg',
    mark: false,
    disc: null,
    discLabel: 'RUCHI GARG',
    label: 'Ms. Ruchi Garg',
    tag: 'Trustee',
    role: 'Trustee',
    name: 'Ms. Ruchi Garg',
    sub: 'Standing beside him, as his mother once stood beside his father',
    photo: null,
    photoFit: 'cover',
    photoHint: 'Ms. Ruchi Garg',
    text: 'Trustee of the Foundation, whose support has been integral to its work, standing alongside the Chief Trustee in carrying this institution forward. The same quiet partnership that began a generation ago continues into this one.',
  },
  {
    id: 'today',
    mark: true,
    disc: null,
    discLabel: 'Now',
    label: 'Today',
    tag: 'Ongoing',
    role: 'Carrying the work forward',
    name: 'The work today',
    sub: 'From one pro bono practice to a full institution',
    photo: photoOffice,
    photoFit: 'cover',
    photoHint: 'Legal aid outreach and Tihar Central Jail visits',
    text: 'What began as one man’s pro bono practice has since grown into a full-fledged institution, providing free legal aid to hundreds of poor, deprived, disabled and downtrodden persons, including inmates inside Tihar Central Jail, and arguing matters all the way up to the Supreme Court of India, several of which now stand as reported judgments. Every case we take on today is a continuation of that first instinct on the judicial bench: that no one should be denied justice simply because they cannot afford it.',
  },
];

const PILLARS = [
  {
    title: 'We remove the fear',
    body: 'Too often people avoid seeking legal help because they are afraid of the process itself: the paperwork, the language, the courts, the cost. We exist to take that fear out of the way.',
  },
  {
    title: 'We keep the doors open',
    body: 'Justice must stay within reach of those who are financially constrained and at risk of being shut out entirely. No one should lose their right to be heard, to representation, or to a fair process because they cannot afford it.',
  },
  {
    title: 'We go past the courtroom',
    body: 'Through legal literacy, community outreach, youth engagement and policy advocacy, we reach people in every area of their lives, not only at their moment of crisis. Justice should reach people on their own terms, wherever they are.',
  },
];

const AIMS = [
  {
    title: 'Free, effective legal aid',
    body: 'For the poor, deprived and marginalized, from first consultation to final judgment.',
  },
  {
    title: 'Legal literacy for everyone',
    body: 'So people understand their rights long before they ever need a lawyer.',
  },
  {
    title: 'Causes of public importance',
    body: 'From civil liberties to the environment, matters that affect entire communities, not just individuals.',
  },
  {
    title: 'A generation of responsible lawyers',
    body: 'Giving practicing advocates and law students real, hands-on pro bono experience.',
  },
];

const COURTS = [
  'All District Courts of Delhi',
  'High Courts',
  'Tribunals',
  'Supreme Court of India',
];

function ScalesIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3v18M8 7h8M6 7l-3 6h6L6 7zm12 0l-3 6h6l-3-6zM5 13c0 2 1.5 3.5 3.5 3.5S12 15 12 13M12 13c0 2 1.5 3.5 3.5 3.5S19 15 19 13" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8.5 6.5v11l9-5.5-9-5.5z" />
    </svg>
  );
}

function PhBox({ label, hint, dark, image, fit = 'cover', position, className = '' }) {
  if (image) {
    return (
      <div className={`about-ph about-ph--photo about-ph--${fit} ${className}`.trim()}>
        <img
          src={image}
          alt={hint || label || ''}
          style={position ? { objectPosition: position } : undefined}
        />
      </div>
    );
  }
  return (
    <div className={`about-ph ${dark ? 'about-ph--dark' : ''} ${className}`.trim()}>
      <span>{label}</span>
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

function VideoCard({ tag, label, hint, image, src }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const el = videoRef.current;
    if (!el || !src) return;
    el.muted = false;
    el.play()
      .then(() => setPlaying(true))
      .catch(() => {
        el.muted = true;
        el.play()
          .then(() => {
            setPlaying(true);
            el.muted = false;
          })
          .catch(() => {});
      });
  };

  const onEnded = () => setPlaying(false);
  const onPause = () => {
    const el = videoRef.current;
    if (el && el.paused && !el.ended) setPlaying(false);
  };

  if (src) {
    return (
      <div className={`about-vid about-vid--player${playing ? ' is-playing' : ''}`}>
        {tag && !playing ? <span className="about-vid__tag">{tag}</span> : null}
        <div className="about-vid__frame">
          <video
            ref={videoRef}
            className="about-vid__video"
            src={src}
            poster={image || undefined}
            controls={playing}
            controlsList="nodownload"
            playsInline
            preload="auto"
            onEnded={onEnded}
            onPause={onPause}
            onPlay={() => setPlaying(true)}
          />
        </div>
        {!playing ? (
          <button type="button" className="about-vid__play" onClick={start} aria-label={label || 'Play video'}>
            <span>
              <PlayIcon />
            </span>
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="about-vid">
      {tag ? <span className="about-vid__tag">{tag}</span> : null}
      <PhBox label={label} hint={hint} dark image={image} />
      <div className="about-vid__play" aria-hidden="true">
        <span>
          <PlayIcon />
        </span>
      </div>
    </div>
  );
}

export default function About() {
  const [cur, setCur] = useState(0);
  const chapter = LINEAGE[cur];

  const step = (d) => setCur((i) => (i + d + LINEAGE.length) % LINEAGE.length);

  return (
    <div className="about about--v3">
      {/* 1 · HERO */}
      <section className="about-hero" id="about-hero">
        <div className="about-hero__left">
          <h1 className="about-hero__title">About Us</h1>
          <p className="about-epigraph">One man’s quiet compassion became a promise:</p>
          <p className="about-promise">
            “no one, however poor or powerless, would ever have to face the law alone.”
          </p>
          <h2 className="about-tagline">
            With You.
            <br />
            For You.
            <i>Nyaya Tak.</i>
          </h2>
          <p className="about-carry">
            That promise is what we carry forward, for every person who still needs someone in their
            corner.
          </p>
          <div className="about-stamp">
            <span className="about-stamp__seal" aria-hidden="true">
              <ScalesIcon />
            </span>
            <span>
              Radhey Krishna Legal Aid Foundation
              <br />
              Charitable Trust · registered 25 November 2016
            </span>
          </div>
        </div>
        <div className="about-hero__right">
          <PhBox
            className="about-hero__photo"
            label="Photo"
            hint="Advocate with a client outside court"
            dark
            image={photoAjayHero}
          />
          <span className="about-hero__vcap">Delhi · since 2016</span>
        </div>
      </section>

      {/* 2 · CHIEF TRUSTEE MESSAGE */}
      <section className="about-message" id="message">
        <Reveal as="div" variant="up">
          <VideoCard
            tag="A MESSAGE FROM OUR CHIEF TRUSTEE"
            label="Video"
            hint="Mr. Ajay Garg, Advocate"
            image={photoAjayHero}
          />
        </Reveal>
        <Reveal as="div" variant="up" delay={80}>
          <span className="about-kicker">Hear it first</span>
          <h2>Before you read our story in words, hear it in his own voice.</h2>
          <p>
            In this short message, our Chief Trustee shares why Radhey Krishna Legal Aid Foundation
            exists, what it stands for, and what it does for the people who come to us.
          </p>
          <div className="about-nameplate">
            <b>Mr. Ajay Garg, Advocate</b>
            <span>Chief Trustee and Founder</span>
          </div>
          <a className="about-watch" href="#message">
            Watch the message →
          </a>
        </Reveal>
      </section>

      {/* 3 · PHILOSOPHY */}
      <section className="about-phil" id="philosophy">
        <span className="about-kicker">Our philosophy</span>
        <h2 className="about-phil__conviction">
          To fight for people, not just represent them. And to stay by their side{' '}
          <em>until the fight is won.</em>
        </h2>
        <p className="about-phil__sub">
          That is the one conviction that guides us. Everything below follows from it: the law should
          never feel distant, intimidating, or out of reach, for anyone.
        </p>
        <div className="about-pillars">
          {PILLARS.map((p) => (
            <div className="about-pillar" key={p.title}>
              <b>{p.title}</b>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 · LINEAGE */}
      <section className="about-story" id="story">
        <div className="about-story__head">
          <span className="about-kicker">Our story</span>
          <h2>One thread, two generations</h2>
          <p>
            Long before it became a registered institution, this story began in the life of one man,
            and the woman who stood beside him. The same partnership carries it today.
          </p>
        </div>

        <div className="about-lineage">
          <div className="about-brackets" aria-hidden="true">
            <div className="about-bracket">
              <span>Where it began</span>
              <i />
            </div>
            <div className="about-bracket about-bracket--two">
              <span>Carrying it forward</span>
              <i />
            </div>
          </div>

          <div className="about-rail" role="tablist" aria-label="Family lineage">
            <div className="about-rail__thread" aria-hidden="true" />
            {LINEAGE.map((node, i) => (
              <button
                key={node.id}
                type="button"
                role="tab"
                aria-selected={i === cur}
                className={`about-node${node.mark ? ' about-node--mark' : ''}${i === cur ? ' is-on' : ''}`}
                onClick={() => setCur(i)}
              >
                <span className="about-node__disc">
                  {node.mark ? (
                    <span className="about-node__mark-glyph" aria-hidden="true">
                      {node.discLabel}
                    </span>
                  ) : node.disc ? (
                    <img
                      src={node.disc}
                      alt=""
                      style={node.discPos ? { objectPosition: node.discPos } : undefined}
                    />
                  ) : (
                    <span className="about-node__initials">{node.discLabel}</span>
                  )}
                </span>
                <b>{node.label}</b>
                <em>{node.tag}</em>
              </button>
            ))}
          </div>
        </div>

        <article className="about-chapter" key={chapter.id}>
          <PhBox
            className="about-chapter__photo"
            label="Photo"
            hint={chapter.photoHint}
            image={chapter.photo}
            fit={chapter.photoFit || 'cover'}
            position={chapter.photoPos}
          />
          <div className="about-chapter__body">
            <span className="about-chapter__role">{chapter.role}</span>
            <h3>{chapter.name}</h3>
            <span className="about-chapter__sub">{chapter.sub}</span>
            <p>{chapter.text}</p>
            <div className="about-chapter__nav">
              <button type="button" onClick={() => step(-1)} aria-label="Previous">
                ←
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next">
                →
              </button>
            </div>
          </div>
        </article>
        <p className="about-hint">Click a face or a marker to follow the thread</p>
      </section>

      {/* 5 · OFFICE */}
      <section className="about-office" id="office">
        <Reveal as="div" variant="up">
          <span className="about-kicker">Inside our office</span>
          <h2>Where the work actually happens</h2>
          <p>
            A short tour of the space, and the team behind every case we take on. The Foundation is
            run and managed voluntarily by practicing lawyers and law students, working together so
            that the poor, deprived, needy, downtrodden and differently-abled can protect their
            rights.
          </p>
        </Reveal>
        <Reveal as="div" variant="up" delay={80}>
          <VideoCard
            tag="INSIDE OUR OFFICE"
            label="Office tour"
            src={officeVideo}
          />
        </Reveal>
      </section>

      {/* 6 · WHAT WE DO + MISSION */}
      <section className="about-work" id="work">
        <div>
          <span className="about-kicker">What we do</span>
          <h2>Legal aid that is preventive, remedial, activist and reformative</h2>
          <p>
            We assist people who would otherwise be unable to afford legal representation or access
            to the court system, with particular focus on senior citizens, women, children, and other
            underprivileged and marginalized groups, while generating public awareness on issues that
            concern everyone.
          </p>
          <div className="about-modes">
            <span>Preventive</span>
            <span>Remedial</span>
            <span>Activist</span>
            <span>Reformative</span>
          </div>
        </div>
        <div>
          <span className="about-kicker">Our mission</span>
          <p className="about-work__mission-lead">
            Our mission goes beyond winning cases. It is about making sure legal aid actually reaches
            the people who need it.
          </p>
          <div className="about-aims">
            {AIMS.map((aim) => (
              <div className="about-aim" key={aim.title}>
                <i aria-hidden="true">✦</i>
                <span>
                  <b>{aim.title}</b>
                  {aim.body}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · WHERE WE WORK */}
      <section className="about-where" id="where">
        <div>
          <span className="about-kicker">Where we work</span>
          <h2>Two offices, one jurisdiction that keeps widening</h2>
          <p className="about-where__intro">
            We appear wherever the matter is listed, and we run awareness work far beyond the courts
            we practice in.
          </p>
          <div className="about-soon">
            <span className="about-soon__icon" aria-hidden="true">
              ✦
            </span>
            <div>
              <b>International programme</b>
              <span>Launching soon, to extend the same support to Indians and families abroad.</span>
            </div>
          </div>
        </div>
        <div>
          <div className="about-offices">
            <div className="about-off">
              <em>{OFFICE_DELHI.title}</em>
              <b>{OFFICE_DELHI.city}</b>
              <span>
                {OFFICE_DELHI.lines.map((line) => (
                  <span key={line} className="about-off__line">
                    {line}
                  </span>
                ))}
              </span>
              <a
                className="about-off__map"
                href={OFFICE_DELHI.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open map →
              </a>
            </div>
            <div className="about-off">
              <em>{OFFICE_IMPHAL.title}</em>
              <b>{OFFICE_IMPHAL.city}</b>
              <span>
                {OFFICE_IMPHAL.lines.map((line) => (
                  <span key={line} className="about-off__line">
                    {line}
                  </span>
                ))}
              </span>
              <a className="about-off__map" href={`tel:${OFFICE_IMPHAL.phoneTel}`}>
                {OFFICE_IMPHAL.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="about-appear">
            <p>We appear before</p>
            <div className="about-courts">
              {COURTS.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
          <div className="about-reach">
            <div>
              <b>Awareness across India</b>
              <span>
                Legal literacy drives, camps and outreach initiatives run nationwide, not only where
                our offices sit.
              </span>
            </div>
            <div>
              <b>Wherever the need is</b>
              <span>
                Case work is taken up on merit and need, whichever forum it belongs before.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8 · CLOSING */}
      <section className="about-closing" id="closing">
        <p className="about-closing__line">One case, one person, and one right restored at a time.</p>
        <p>
          Radhey Krishna Legal Aid Foundation continues to grow, extending free legal aid and support
          to an ever-increasing number of impoverished and underprivileged people.
        </p>
        <p className="about-closing__echo">With You. For You. Nyaya Tak.</p>
      </section>
    </div>
  );
}
