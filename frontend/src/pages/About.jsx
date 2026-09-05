import { useEffect, useRef, useState } from 'react';
import { OFFICE_DELHI, OFFICE_IMPHAL } from '../data/navigation';
import Reveal from '../components/motion/Reveal';
import photoDada from '../assets/_unused/dada.jpeg';
import photoDadi from '../assets/_unused/dadi.jpeg';
import photoAjayHero from '../assets/aboutusbanner.jpeg';
import photoAjayStory from '../assets/_unused/father.jpeg';
import officeVideo from '../assets/officevideo.mp4';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { renderRichText } from '../lib/richText';
import './About.css';

const LINEAGE = [
  {
    id: 'rs-garg',
    mark: false,
    disc: photoDada,
    discLabel: 'R.S. GARG',
    discPos: 'center 30%',
    discZoom: 1.72,
    label: 'Late Sh. R.S. Garg',
    tag: 'Where it began',
    role: 'Where it began',
    name: 'Late Sh. R.S. Garg',
    sub: 'Judicial Officer · Advocate',
    photo: photoDada,
    photoFit: 'contain',
    photoHint: 'Late Sh. R.S. Garg',
    text: 'He began his career as a Judicial Officer in Haryana, gaining an early and firsthand understanding of the functioning of the justice system. He later moved to Delhi and practised in the District Courts and the High Court of Delhi. Throughout his career, he remained deeply committed to assisting people who could not afford legal representation, taking up matters on a pro bono basis whenever someone came to him in need. For him, legal practice was never only about professional work. It was also about service. That commitment became the foundation upon which RKLAF was eventually built.',
  },
  {
    id: 'krishna-garg',
    mark: false,
    disc: photoDadi,
    discLabel: 'KRISHNA GARG',
    discPos: 'center 32%',
    discZoom: 1.72,
    label: 'Late Smt. Krishna Garg',
    tag: 'Beside him',
    role: 'Beside him, always',
    name: 'Late Smt. Krishna Garg',
    sub: 'A partnership in service',
    photo: photoDadi,
    photoFit: 'contain',
    photoHint: 'Late Smt. Krishna Garg',
    text: 'Behind that work was a partnership. Smt. Krishna Garg stood beside her husband throughout his years of legal practice and charitable service, supporting his commitment to helping those in need. RKLAF carries their names because the values behind the Foundation were shaped by both of them.',
  },
  {
    id: 'registered',
    mark: true,
    disc: null,
    discLabel: '2016',
    label: '25 Nov 2016',
    tag: 'Registered',
    role: 'A Legacy in Service of Justice',
    name: '25 November 2016',
    sub: 'RKLAF was established as a registered charitable trust',
    photo: null,
    photoFit: 'cover',
    photoHint: 'Trust registration, 25 November 2016',
    text: "Following the passing of his parents, Mr. Ajay Garg, Advocate, chose to give their legacy a permanent institutional home. The Radhey Krishna Legal Aid Foundation was established in their memory, carrying forward the principle that had guided his father's professional life: that access to justice should never depend solely on one's ability to pay.",
  },
  {
    id: 'ajay-garg',
    mark: false,
    disc: photoAjayStory,
    discLabel: 'AJAY GARG',
    discPos: 'left center',
    label: 'Mr. Ajay Garg',
    tag: 'Founder',
    role: 'The people carrying it forward',
    name: 'Mr. Ajay Garg, Advocate',
    sub: 'Founder · Supreme Court of India & Delhi High Court',
    photo: photoAjayStory,
    photoFit: 'cover',
    photoPos: 'left center',
    photoHint: 'Mr. Ajay Garg, Advocate',
    text: "A graduate of the Campus Law Centre, University of Delhi, Mr. Ajay Garg has over three decades of experience as a practising Advocate before the Supreme Court of India and the Delhi High Court. Alongside his professional practice, he has personally undertaken numerous pro bono matters before the Supreme Court and the Delhi High Court, several of which have resulted in reported judgments. As Founder, he continues to guide the Foundation's work and carry forward the legacy upon which RKLAF was founded.",
  },
  {
    id: 'ruchi-garg',
    mark: false,
    disc: null,
    discLabel: 'RUCHI GARG',
    label: 'Mrs. Ruchi Garg',
    tag: 'Trustee',
    role: 'Trustee',
    name: 'Mrs. Ruchi Garg',
    sub: 'Trustee',
    photo: null,
    photoFit: 'cover',
    photoHint: 'Mrs. Ruchi Garg',
    text: "Mrs. Ruchi Garg serves as a Trustee of the Foundation and has been an integral part of carrying its work forward. Her involvement reflects the same spirit of partnership that has been part of the Foundation's story from the beginning.",
  },
  {
    id: 'today',
    mark: true,
    disc: null,
    discLabel: 'Now',
    label: 'Today',
    tag: 'Ongoing',
    role: 'From Helping One to Changing What Affects Many',
    name: 'The work has grown. The purpose has not changed.',
    sub: 'Individual Justice · Systemic Justice',
    photo: null,
    photoFit: 'cover',
    photoHint: 'Legal aid outreach and Tihar Central Jail visits',
    text: "RKLAF's work has evolved with the understanding that access to justice cannot stop at individual representation. Some matters require a lawyer beside an individual. Others require a question to be taken to a court, an institution to be held accountable, a community to understand its rights, or a systemic gap to be identified and challenged. Our work therefore operates across two connected dimensions: Individual Justice, providing legal assistance, representation and guidance to people facing barriers to justice; and Systemic Justice, taking up issues of wider public importance through litigation, research, legal awareness, institutional engagement and public interest interventions. Our lawyers have represented individuals and communities before District Courts across Delhi, the Delhi High Court and the Supreme Court of India, while our programmes and initiatives take legal awareness and research beyond the courtroom. The scale of the work has changed over the years. The principle has not.",
  },
];

const PILLARS = [
  {
    title: 'We remove the fear.',
    body: 'Legal systems can be overwhelming: unfamiliar language, complex procedures, paperwork, costs and the uncertainty of not knowing what comes next. We work to make that process more understandable and approachable.',
  },
  {
    title: 'We keep the doors open.',
    body: 'The ability to afford a lawyer should never determine whether a person can be heard, represented or seek a legal remedy. We provide free legal assistance to people who may otherwise be unable to access it.',
  },
  {
    title: 'We go beyond the courtroom.',
    body: 'Some barriers to justice cannot be resolved through litigation alone. Through legal literacy, community outreach, research, public-interest work and institutional interventions, we work to address problems before and beyond the courtroom.',
  },
  {
    title: 'We stay with the issue.',
    body: 'Whether the matter concerns an individual, a family, a community or a larger public question, our work is guided by the same commitment: to pursue meaningful access to justice.',
  },
];

const AIMS = [
  {
    title: 'Providing free, effective legal aid',
    body: 'Supporting people who face financial or other barriers to legal representation.',
  },
  {
    title: 'Building legal literacy',
    body: 'Helping people understand their rights and available remedies before they reach a moment of crisis.',
  },
  {
    title: 'Pursuing causes of public importance',
    body: 'Addressing issues whose consequences extend beyond individual clients and into wider communities.',
  },
  {
    title: 'Strengthening institutions through research and engagement',
    body: 'Identifying gaps between legal safeguards and their implementation through evidence based initiatives.',
  },
  {
    title: 'Building a culture of service among young legal professionals',
    body: 'Giving lawyers, law students, interns and volunteers meaningful opportunities to contribute to public interest work.',
  },
];

const WORK_MODES = [
  {
    title: 'Preventive',
    body: 'Helping people understand their rights before a legal problem becomes a crisis through legal literacy, awareness and community outreach.',
  },
  {
    title: 'Remedial',
    body: 'Providing legal assistance and representation to people who are already facing a legal difficulty and may otherwise be unable to access a remedy.',
  },
  {
    title: 'Public Interest',
    body: 'Taking up issues that extend beyond individual disputes through public interest litigation, representations and other interventions concerning matters of wider public importance.',
  },
  {
    title: 'Reformative',
    body: 'Using research, RTIs, social surveys and institutional engagement to identify gaps between legal safeguards and their implementation and work towards better systems.',
  },
];

/** Fallback when CMS team list is empty */
const FALLBACK_TEAM = [
  {
    id: 'ajay-garg',
    name: 'Mr. Ajay Garg, Advocate',
    role: 'Founder',
    subtitle: 'Founder · Supreme Court of India & Delhi High Court',
    bio: "A graduate of the Campus Law Centre, University of Delhi, Mr. Ajay Garg has over three decades of experience as a practising Advocate before the Supreme Court of India and the Delhi High Court. Alongside his professional practice, he has personally undertaken numerous pro bono matters before the Supreme Court and the Delhi High Court, several of which have resulted in reported judgments. As Founder, he continues to guide the Foundation's work and carry forward the legacy upon which RKLAF was founded.",
    image: photoAjayStory,
    photoPos: 'left center',
  },
  {
    id: 'ruchi-garg',
    name: 'Mrs. Ruchi Garg',
    role: 'Trustee',
    subtitle: 'Trustee',
    bio: "Mrs. Ruchi Garg serves as a Trustee of the Foundation and has been an integral part of carrying its work forward. Her involvement reflects the same spirit of partnership that has been part of the Foundation's story from the beginning.",
    image: null,
  },
];

function mapTeamMember(m) {
  return {
    id: m.id,
    name: m.name,
    role: m.role,
    subtitle: m.subtitle || m.role || '',
    bio: m.bio || '',
    image: m.image ? assetUrl(m.image) : null,
    photoPos: 'center center',
  };
}

const COURTS = [
  'District Courts of Delhi',
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
  const [team, setTeam] = useState(FALLBACK_TEAM);
  const chapter = LINEAGE[cur];

  useEffect(() => {
    publicApi
      .get('/team')
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length) {
          setTeam(r.data.map(mapTeamMember));
        }
      })
      .catch(() => {});
  }, []);

  const step = (d) => setCur((i) => (i + d + LINEAGE.length) % LINEAGE.length);

  return (
    <div className="about about--v3">
      {/* 1 · HERO */}
      <section className="about-hero" id="about-hero">
        <div className="about-hero__left">
          <h1 className="about-hero__title">About Us</h1>
          <p className="about-epigraph">A belief, carried forward</p>
          <p className="about-promise">
            “No one, however poor or powerless, should ever have to face the law alone.”
          </p>
          <h2 className="about-tagline">
            With You.
            <br />
            For You.
            <i>Nyaya Tak.</i>
          </h2>
          <p className="about-carry">
            That belief lies at the heart of the Radhey Krishna Legal Aid Foundation (RKLAF). Established on
            25 November 2016, in memory of Late Sh. R.S. Garg, Advocate, and Late Smt. Krishna Garg, the
            Foundation carries forward a legacy of service that began with individual pro bono representation
            and has grown into work spanning legal aid, litigation, legal literacy, community outreach,
            research and public-interest intervention.
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
            position="center 72%"
          />
          <span className="about-hero__vcap">Delhi · since 2016</span>
        </div>
      </section>

      {/* 2 · PHILOSOPHY */}
      <section className="about-phil" id="philosophy">
        <span className="about-kicker">Our philosophy</span>
        <h2 className="about-phil__conviction">
          To fight for people, not simply represent them.
        </h2>
        <p className="about-phil__sub">
          For us, legal aid is not limited to appearing in court. It means standing alongside a person when
          the law feels unfamiliar, inaccessible or intimidating, and helping them understand, navigate and
          exercise their rights.
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
          <h2>One thread. Two generations.</h2>
          <p>
            RKLAF began with a family belief that law carries a responsibility to serve those who need it the
            most. That belief first took shape in the professional life of one man, was sustained by the woman
            who stood beside him, and was carried forward by the next generation.
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
                      className={node.discZoom ? 'about-node__disc-img--zoom' : undefined}
                      style={{
                        ...(node.discPos && { objectPosition: node.discPos }),
                        ...(node.discZoom && { '--disc-zoom': String(node.discZoom) }),
                      }}
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

        <article
          className={`about-chapter${chapter.photo ? '' : ' about-chapter--text'}`}
          key={chapter.id}
        >
          {chapter.photo ? (
            <PhBox
              className="about-chapter__photo"
              label="Photo"
              hint={chapter.photoHint}
              image={chapter.photo}
              fit={chapter.photoFit || 'cover'}
              position={chapter.photoPos}
            />
          ) : null}
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

      {/* 4b · OUR TEAM — CMS-driven, 4 per row, grows with uploads */}
      <section className="about-team" id="team">
        <Reveal as="header" className="about-team__head" variant="up">
          <span className="about-kicker">Our Team</span>
          <h2>The people carrying it forward</h2>
        </Reveal>
        <div className="about-team__grid">
          {team.map((person, i) => (
            <Reveal key={person.id || person.name} as="article" className="about-team__card" variant="up" delay={Math.min(i, 7) * 40}>
              {person.image ? (
                <div
                  className="about-team__photo"
                  style={{
                    backgroundImage: `url(${person.image})`,
                    backgroundPosition: person.photoPos || 'center center',
                  }}
                  role="img"
                  aria-label={person.name}
                />
              ) : (
                <div className="about-team__photo about-team__photo--empty" aria-hidden="true">
                  <span>{(person.name || '?').split(' ').slice(0, 2).join(' ')}</span>
                </div>
              )}
              <p className="about-team__role">{person.role}</p>
              <h3>{person.name}</h3>
              {person.subtitle ? <p className="about-team__sub">{person.subtitle}</p> : null}
              {person.bio ? <p>{renderRichText(person.bio)}</p> : null}
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5 · OFFICE */}
      <section className="about-office" id="office">
        <Reveal as="div" variant="up">
          <span className="about-kicker">Inside our office</span>
          <h2>Where the work actually happens</h2>
          <p>
            Behind every case, programme and initiative is a team of people working to make it happen. RKLAF
            brings together trustees, practising advocates, law students, interns, volunteers and collaborators
            who contribute their time, knowledge and skills across legal aid, litigation, research, outreach and
            public-interest work.
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
          <span className="about-kicker">How we work</span>
          <h2>Legal aid that is preventive, remedial, public interest and reformative.</h2>
          <p>
            Our work operates across different stages of a person&apos;s relationship with the law.
          </p>
          <div className="about-modes">
            {WORK_MODES.map((mode) => (
              <article className="about-mode" key={mode.title}>
                <b>{mode.title}</b>
                <p>{mode.body}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <span className="about-kicker">Our mission</span>
          <p className="about-work__mission-lead">
            To make justice more accessible, understandable and meaningful for those who need it most.
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
          <h2>From courtrooms to communities.</h2>
          <p className="about-where__intro">
            RKLAF&apos;s work is not confined to the location of its offices. Alongside litigation, our legal
            awareness, research and outreach initiatives extend beyond our physical offices and into
            communities and institutions across India.
          </p>
          <div className="about-soon">
            <span className="about-soon__icon" aria-hidden="true">
              ✦
            </span>
            <div>
              <b>International programme</b>
              <span>
                Coming soon, expanding our reach and creating new avenues of legal aid, assistance and
                awareness for people and communities who need support, wherever they may be.
              </span>
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
        </div>
      </section>

      {/* 8 · VISION + LOOKING AHEAD */}
      <section className="about-outlook" id="outlook">
        <Reveal as="article" className="about-outlook__card" variant="up">
          <span className="about-kicker">Our vision</span>
          <h2>A society where justice is within reach of everyone.</h2>
          <p>
            We envision a justice system in which legal rights are not merely written into law, but are
            understood, accessible and capable of being meaningfully exercised. Our aim is to continue
            building an institution that connects people, law and public interest, through legal assistance,
            knowledge, research and action.
          </p>
        </Reveal>
        <Reveal as="article" className="about-outlook__card" variant="up" delay={80}>
          <span className="about-kicker">Looking ahead</span>
          <h2>The promise continues.</h2>
          <p>
            RKLAF continues to grow, but growth for us is not simply about reaching more people. It is about
            finding new ways to make justice more accessible, more understandable and more responsive to the
            realities people face. From free legal aid and community outreach to research, digital legal
            literacy and public-interest interventions, the next chapter of RKLAF will continue to build on
            the same foundation with which it began.
          </p>
        </Reveal>
      </section>

      {/* 9 · CLOSING */}
      <section className="about-closing" id="closing">
        <div className="about-closing__inner">
          <p className="about-closing__line">One case. One person. One right at a time.</p>
          <p className="about-closing__body">
            The work continues. From free legal aid and community outreach to research, digital legal literacy
            and public-interest interventions, the next chapter of RKLAF will continue to build on the same
            foundation with which it began.
          </p>
          <p className="about-closing__echo">With You. For You. Nyaya Tak.</p>
        </div>
      </section>
    </div>
  );
}
