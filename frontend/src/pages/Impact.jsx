import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import CountUp from '../components/motion/CountUp';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { alsoOnRecordPdfDownloadUrl, pressMentionPdfDownloadUrl } from '../lib/pdfDownload';
import { displayText } from '../lib/displayText';
import { renderRichText } from '../lib/richText';
import impactBanner from '../assets/impactbanner2.jpeg';
import './Impact.css';

/** Turn YouTube / Vimeo watch URLs into embeddable iframe srcs (no autoplay on mosaic). */
function embedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const id = u.searchParams.get('v') || u.pathname.match(/\/embed\/([^/]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    /* not a URL */
  }
  return null;
}

const milestones = [
  {
    year: '2016',
    title: 'The Beginning',
    body: 'RKLAF is registered, giving institutional form to a longstanding commitment to providing legal aid and pro bono assistance to those who need it.',
    chip: '25 November 2016',
    side: 'up',
  },
  {
    year: '2016',
    title: 'Commencement of Legal Representation',
    body: "Our lawyers begin representing legal aid recipients across Delhi, from the city's District Courts to the Delhi High Court and the Supreme Court of India.",
    side: 'down',
  },
  {
    year: '2016–17',
    title: 'Justice Behind Prison Walls',
    body: "RKLAF begins providing free legal aid to inmates of Tihar Central Jail, establishing what would become one of the Foundation's continuing areas of work.",
    side: 'up',
  },
  {
    year: '2017',
    title: 'Legal Assistance to the Families of Indian Workers Abroad',
    body: 'RKLAF secures the first of six resolutions for families of Indian workers who died in 2016 while employed by companies in the Middle East. Across the six matters, involving families from Uttar Pradesh to Tamil Nadu, RKLAF assisted with the documentation and processes required to pursue their claims, entirely free of cost.',
    chip: '21 January 2017',
    side: 'down',
  },
  {
    year: '2018',
    title: 'Strengthening the Investigation Process',
    body: 'RKLAF develops a General Police Investigation Checklist alongside Specific Checklists for different stages and aspects of investigation, providing Investigating Officers with a structured framework from FIR registration through the filing of a chargesheet. The Delhi Police Legal Cell recognises the checklists as useful and considers them for inclusion in the Basic Training Course of the Delhi Police.',
    side: 'up',
  },
  {
    year: '2018',
    title: 'Recognition as a Delhi Prisons Legal Aid Provider',
    body: 'RKLAF is officially recognised by Delhi Prisons as an approved legal-aid provider. The recognition has continued to be renewed, including in 2022 and 2023, across Jails 1, 2, 6, 7, 8/9, 10, 14 and 16.',
    side: 'down',
  },
  {
    year: '2019',
    title: 'Ghar Ghar Nyaya and Community Legal Outreach',
    body: 'RKLAF takes legal awareness beyond the courtroom and into communities through door to door outreach, legal aid camps and on ground assistance across Delhi. Lawyers, interns and volunteers work directly with communities, bringing legal information and assistance closer to the people who need it.',
    chip: 'Ongoing',
    side: 'up',
  },
  {
    year: '2020',
    title: 'Landmark advocacy before a Constitution Bench of the Supreme Court',
    body: 'We appear before a five-judge Constitution Bench of the Supreme Court of India in Mukesh Singh vs. State (Narcotic Branch of Delhi), among the rarest and most significant forms a case can take, reflecting the Foundation\'s growing engagement with questions of constitutional and wider public importance.',
    chip: '31 August 2020',
    side: 'down',
  },
  {
    year: '2022',
    title: 'Establishment of the Imphal Office',
    body: 'RKLAF opens its first office outside Delhi in Imphal, Manipur, extending its work in free legal aid and access to justice to the North East.',
    side: 'up',
  },
  {
    year: '2023',
    title: 'Recruitment Rights and Age Relaxation',
    body: 'In Sachin & Ors. v. CRPF, the Delhi High Court grants a three-year age relaxation to candidates aspiring to recruitment as Head Constable (Ministerial) in the CRPF. The matter had implications extending far beyond the individual candidates before the Court.',
    chip: '20 January 2023',
    side: 'down',
  },
  {
    year: '2024',
    title: 'First Public Interest Litigation',
    body: "RKLAF files its first Public Interest Litigation before the Delhi High Court, marking an important step in the Foundation's evolution from individual legal representation towards addressing issues affecting wider sections of society.",
    side: 'up',
  },
  {
    year: '2025',
    title: 'Know Your Rights Goes Digital',
    body: "RKLAF's Know Your Rights campaign expands into digital spaces through practical legal guides, explainer videos, visual resources and podcasts, taking legal literacy beyond in-person sessions and making it accessible wherever people are.",
    chip: 'Ongoing',
    side: 'down',
  },
  {
    year: '2026',
    title: 'From Awareness to Accountability',
    body: 'RKLAF launches the Safe School Project, its first RTI and social-survey initiative. The project combines 86 RTI applications across 10 States/UTs and 19 districts with surveys reaching 1,700+ students, parents and teachers, examining whether legal child-safety protections are actually reaching the schools and communities they are intended to protect. The findings are compiled in The National Child Safety Audit 2026.',
    chip: '26 January 2026',
    side: 'up',
  },
  {
    year: '2026',
    title: 'A Decade of RKLAF',
    body: 'A decade of legal aid, pro-bono representation, public-interest work, legal awareness and community engagement, and a foundation for everything that lies ahead.',
    chip: 'November 2026',
    side: 'down',
  },
  {
    year: 'Next',
    title: 'International Legal Aid Programme',
    body: 'RKLAF is preparing to extend its work further, with a forthcoming international programme aimed at providing legal aid, assistance and awareness to Indians and their families abroad. The work continues, reaching more people, entering new spaces, and creating new avenues for those who need legal aid and assistance.',
    chip: 'Coming soon',
    side: 'up',
    soon: true,
  },
];

const stats = [
  {
    label: 'Pro bono',
    end: 30000,
    suffix: '+',
    desc: 'Hours of Pro Bono Legal Service. Time spent researching, preparing, representing and assisting, provided without charge to those seeking legal aid.',
  },
  {
    label: 'Assisted',
    end: 12750,
    suffix: '+',
    desc: 'Individuals & Families Assisted. People who have received direct assistance through RKLAF’s legal representation, casework and free consultation.',
  },
  {
    label: 'Reached',
    end: 100000,
    suffix: '+',
    desc: 'People reached and benefited through our litigation, our jail visits, legal aid camps, outreach and other programmes.',
  },
];

function TornMini() {
  return (
    <svg className="impact-tornmini" viewBox="0 0 400 26" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M0 18 q20 -12 44 -4 q22 8 42 -6 q20 -12 46 -2 q24 8 46 -6 q20 -12 46 -2 q26 10 48 -6 q20 -12 44 -2 q22 8 42 -4 q18 -8 42 2 L400 26 L0 26 Z"
      />
    </svg>
  );
}

function PhotoBox({ image, label, caption, className = '', fit = 'cover', position = 'center' }) {
  if (image) {
    return (
      <div className={`impact-phbox impact-phbox--media ${className}`.trim()}>
        <img src={image} alt="" loading="lazy" style={{ objectFit: fit, objectPosition: position }} />
      </div>
    );
  }

  return (
    <div className={`impact-phbox ${className}`.trim()}>
      <span>{label || 'Photo'}</span>
      {caption ? <small>{caption}</small> : null}
    </div>
  );
}

function ParRows({ rows }) {
  return (
    <div className="impact-par">
      {rows.map(([label, text]) =>
        text ? (
          <div key={label}>
            <b>{label}</b>
            <span>{renderRichText(text)}</span>
          </div>
        ) : null
      )}
    </div>
  );
}

function Strand({ label, note }) {
  return (
    <div className="impact-strand">
      <b>{label}</b>
      <span>{note}</span>
    </div>
  );
}

export default function Impact() {
  const [stories, setStories] = useState([]);
  const [runningNow, setRunningNow] = useState([]);
  const [alsoOnRecord, setAlsoOnRecord] = useState([]);
  const [pressMentions, setPressMentions] = useState([]);

  useEffect(() => {
    publicApi.get('/success-stories').then((r) => {
      if (Array.isArray(r.data)) setStories(r.data);
    }).catch(() => {});
    publicApi.get('/running-now').then((r) => {
      if (Array.isArray(r.data)) setRunningNow(r.data);
    }).catch(() => {});
    publicApi.get('/also-on-record').then((r) => {
      if (Array.isArray(r.data)) setAlsoOnRecord(r.data);
    }).catch(() => {});
    publicApi.get('/press-mentions').then((r) => {
      if (Array.isArray(r.data)) setPressMentions(r.data);
    }).catch(() => {});
  }, []);

  return (
    <div className="impact">
      <header
        className="impact-hero impact-hero--photo"
        style={{ '--impact-hero-image': `url(${impactBanner})` }}
      >
        <div className="impact-hero__photo" aria-hidden="true" />
        <div className="container impact-hero__inner">
          <Reveal as="div" className="impact-hero__copy" variant="up">
            <span className="impact-dash" aria-hidden="true" />
            <h1>Our Impact</h1>
            <p className="impact-hero__leadline">The Work. The Cases. The Difference.</p>
            <p>
              Since 2016, RKLAF has worked across courtrooms, prisons, communities and institutions to make
              justice more accessible. This is our record.
            </p>
          </Reveal>
        </div>
        <svg className="impact-tear" viewBox="0 0 1240 120" preserveAspectRatio="none" aria-hidden="true">
          <path
            fill="currentColor"
            d="M0 92 q30 -26 70 -10 q28 12 52 -8 q20 -18 54 -6 q30 12 58 -14 q22 -20 60 -4 q34 14 66 -10 q26 -20 62 -2 q36 16 70 -12 q24 -18 58 -4 q40 16 74 -10 q26 -18 60 -2 q36 16 72 -14 q24 -18 56 -2 q38 16 74 -10 q28 -18 62 0 q34 16 70 -12 q26 -18 60 -2 q30 14 62 -6 L1240 120 L0 120 Z"
          />
        </svg>
      </header>

      <section id="milestones" className="impact-mapzone">
        <svg className="impact-brush impact-brush--l" viewBox="0 0 200 300" aria-hidden="true">
          <path
            fill="#8A7A63"
            opacity=".85"
            d="M10 300 q-18 -60 8 -96 q22 -30 10 -64 q-10 -30 14 -48 q20 -14 12 -40 l14 4 q10 26 -8 46 q-16 20 -4 48 q14 30 -6 58 q-18 26 -4 58 q8 20 2 34 z"
          />
          <path
            fill="#B49B72"
            opacity=".7"
            d="M52 300 q-10 -40 8 -66 q16 -24 6 -50 q-8 -22 10 -36 l10 8 q6 20 -8 36 q-12 16 -2 40 q10 26 -6 46 q-12 14 -8 22 z"
          />
        </svg>
        <div className="container">
          <Reveal as="div" className="impact-mhead" variant="up">
            <div>
              <span className="impact-dash" aria-hidden="true" />
              <h2>Our Journey</h2>
            </div>
            <div>
              <h3 className="impact-mhead__decade">A Decade of Legal Aid, Advocacy and Public Service</h3>
              <p>
                What began in November 2016 as an institutional expression of a commitment to legal aid has
                grown across courtrooms, prisons, communities, schools and institutions.
              </p>
              <p className="impact-mstamp">Registered 25 November 2016</p>
            </div>
          </Reveal>

          <div className="impact-hrail">
            <div className="impact-htrack">
              {milestones.map((m, i) => (
                <div key={`${m.year}-${m.title}-${i}`} className={`impact-hitem ${m.side}${m.soon ? ' soon' : ''}`}>
                  <div className="impact-hcard">
                    <b>{m.title}</b>
                    <span>{m.body}</span>
                    {m.chip ? <em>{m.chip}</em> : null}
                  </div>
                  <div className="impact-hnode">
                    <span className="impact-hstem" />
                    <i />
                    <span className="impact-hyear">{m.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="impact-hhint">Scroll the timeline sideways →</p>
        </div>
      </section>

      <section id="counted" className="impact-numbers">
        <div className="container">
          <Reveal as="header" className="impact-numbers__head" variant="up">
            <span className="impact-dash impact-dash--gold" aria-hidden="true" />
            <h2>A Decade of Work. Measured in People, Matters and Hours</h2>
          </Reveal>
          <div className="impact-numgrid">
            {stats.map((s, i) => (
              <Reveal key={s.label} as="div" className="impact-num" variant="up" delay={i * 40}>
                <em>{s.label}</em>
                <CountUp
                  as="b"
                  end={s.end}
                  suffix={s.suffix}
                  duration={1600 + i * 120}
                />
                <span>{s.desc}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="litigation" className="impact-litigation">
        <div className="container">
          <Reveal as="header" variant="up">
            <span className="impact-dash" aria-hidden="true" />
            <h2>Impact through litigation</h2>
            <p className="impact-lead">
              Since 2016, RKLAF has represented matters concerning individual rights to questions of wider
              public importance and pursued their legal issues across courts and tribunals.
            </p>
            <p className="impact-lead">
              This section brings together that record across three categories: matters currently pending
              before the Hon&apos;ble Courts, cases documented in full, and additional orders preserved as
              part of RKLAF&apos;s wider legal record.
            </p>
            <p className="impact-lead">
              Some matters are still ongoing. Some have changed the course of an individual&apos;s life.
              Others are recorded simply because they mattered.
            </p>
            <p className="impact-aside-note">
              <strong>Confidentiality &amp; Publication Note.</strong> Client confidentiality remains central
              to our work. Therefore, certain case details, client identities and documents may be withheld or
              anonymised. Where a matter is not in the public domain, names may be changed and identifying
              details omitted. Court orders and judgments are reproduced or linked only where they are publicly
              available or where publication is otherwise appropriate.
            </p>
          </Reveal>

          <Strand
            label="Ongoing Matters · Cases Pending Before the Hon’ble Courts"
            note="Matters in which proceedings are currently ongoing and the legal issues remain before the court."
          />
          <p className="impact-aside-note impact-aside-note--tight">
            RKLAF does not describe a pending matter as a success or outcome until the court has passed an
            order.
          </p>
          {runningNow.length ? (
            <div className="impact-live-grid">
              {runningNow.map((item, i) => (
                <Reveal key={item.id} as="article" className="impact-live" variant="up" delay={i * 40}>
                  <span className="impact-live__status">
                    <i /> {item.status || 'In trial'}
                  </span>
                  <h3>{displayText(item.title)}</h3>
                  <ParRows
                    rows={[
                      ['Allegation', item.allegation],
                      ['Relief sought', item.reliefSought],
                      ['Stage', item.stage],
                    ]}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="impact-empty">No pending matters published yet.</p>
          )}

          <div id="stories">
            <Strand
              label="Beyond the Order · The Complete Legal Record"
              note="Some matters illustrate questions of greater legal or public importance and merit a fuller account. These cases are presented from beginning to end, the issue, the proceedings, the legal intervention and the final order, to show not only the outcome, but the legal journey that led to it."
            />
            <p className="impact-aside-note impact-aside-note--tight">
              Client identities are withheld unless disclosure has been expressly authorised or the legal
              record is under public domain.
            </p>
            {stories.length ? (
              <div className="impact-story-grid">
                {stories.map((story, i) => {
                  const href = story.slug ? `/impact/stories/${story.slug}` : null;
                  const photo = story.heroImage ? assetUrl(story.heroImage) : null;
                  const inner = (
                    <>
                      <PhotoBox
                        image={photo}
                        label="Portrait"
                        caption={story.caption}
                        className="impact-phbox--flush impact-phbox--story"
                        fit="contain"
                        position="center center"
                      />
                      <TornMini />
                      <div className="impact-sbody">
                        {story.tag ? <span className="impact-tag">{story.tag}</span> : null}
                        <h3>{displayText(story.title)}</h3>
                        {story.caseLine ? <span className="impact-caseline">{story.caseLine}</span> : null}
                        <ParRows
                          rows={[
                            ['Problem', story.problem],
                            ['Action', story.action],
                            ['Result', story.result],
                          ]}
                        />
                        {href ? <span className="impact-readmore">Read more →</span> : null}
                      </div>
                    </>
                  );
                  return (
                    <Reveal key={story.id || story.title} variant="up" delay={i * 40}>
                      {href ? (
                        <Link to={href} className="impact-story">
                          {inner}
                        </Link>
                      ) : (
                        <article className="impact-story">{inner}</article>
                      )}
                    </Reveal>
                  );
                })}
              </div>
            ) : (
              <p className="impact-empty">No argued-in-full stories published yet.</p>
            )}
          </div>

          <Strand
            label="Also on Record · Every Matter Has a Place in the Record"
            note="Not every matter requires a detailed case study. Some are best preserved through the orders and judgments that form their official record. This section provides access to such matters, allowing the work to speak through the documents themselves."
          />
          {alsoOnRecord.length ? (
            <div className="impact-ledger">
              {alsoOnRecord.map((row) => {
                const href = row.file ? alsoOnRecordPdfDownloadUrl(row.id) : null;
                const Row = href ? 'a' : 'div';
                const rowProps = href
                  ? { href, className: 'impact-lrow', target: '_blank', rel: 'noreferrer' }
                  : { className: 'impact-lrow' };
                return (
                  <Row key={row.id} {...rowProps}>
                    <span className="impact-lrow__yr">{row.year}</span>
                    <span className="impact-lrow__frm">{row.header}</span>
                    <span>{renderRichText(row.description)}</span>
                    {row.statusChip ? <span className="impact-chip">{row.statusChip}</span> : <span />}
                  </Row>
                );
              })}
            </div>
          ) : (
            <p className="impact-empty">No records published yet.</p>
          )}
        </div>
      </section>

      <section id="press" className="impact-press">
        <svg className="impact-brush impact-brush--r" viewBox="0 0 200 300" aria-hidden="true">
          <path
            fill="#8A7A63"
            opacity=".7"
            d="M10 0 q-18 60 8 96 q22 30 10 64 q-10 30 14 48 q20 14 12 40 l14 -4 q10 -26 -8 -46 q-16 -20 -4 -48 q14 -30 -6 -58 q-18 -26 -4 -58 q8 -20 2 -34 z"
          />
        </svg>
        <div className="container">
          <Reveal as="header" variant="up">
            <span className="impact-dash" aria-hidden="true" />
            <h2>Beyond Litigation</h2>
            <p className="impact-kicker">Taking the work beyond the courtroom.</p>
            <p className="impact-intro">
              RKLAF&apos;s work extends beyond litigation into public conversations, professional forums and
              wider communities.
            </p>
            <p className="impact-intro">
              This section brings together podcasts, webinars, panels, interviews and other institutional
              engagements involving RKLAF, its founder and members, alongside media coverage and instances where
              the Foundation&apos;s work, research or initiatives have been featured, cited or recognised.
            </p>
            <p className="impact-intro impact-intro--cue">
              Explore our public engagements, features and appearances.
            </p>
          </Reveal>
          {pressMentions.length ? (
            <div className="impact-press-grid">
              {pressMentions.map((item, i) => {
                if (item.layout === 'quote') {
                  return (
                    <Reveal key={item.id} variant="up" delay={i * 30}>
                      <blockquote className="impact-vquote">
                        <p>{item.quote || item.title}</p>
                        {item.quoteAttribution ? <span>{item.quoteAttribution}</span> : null}
                      </blockquote>
                    </Reveal>
                  );
                }

                if (item.layout === 'image') {
                  return (
                    <Reveal key={item.id} variant="up" delay={i * 30}>
                      <PhotoBox
                        image={item.image ? assetUrl(item.image) : null}
                        label="Clipping scan"
                        caption={item.imageCaption || item.title}
                        className="impact-phbox--tall"
                      />
                    </Reveal>
                  );
                }

                if (item.layout === 'video') {
                  const yt = embedUrl(item.youtubeUrl);
                  const file = item.video ? assetUrl(item.video) : null;
                  const thumb = item.thumbnail ? assetUrl(item.thumbnail) : null;
                  return (
                    <Reveal key={item.id} variant="up" delay={i * 30}>
                      <article className="impact-press-media">
                        <div className="impact-press-media__frame">
                          {yt ? (
                            <iframe
                              src={yt}
                              title={item.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : file ? (
                            <video controls preload="metadata" poster={thumb || undefined} src={file}>
                              <track kind="captions" />
                            </video>
                          ) : (
                            <PhotoBox image={thumb} label="Video" caption={item.title} />
                          )}
                        </div>
                        <div className="impact-press-media__body">
                          {item.outlet ? <span className="impact-clip__outlet">{item.outlet}</span> : null}
                          <h3>{displayText(item.title)}</h3>
                          {item.meta ? <span className="impact-clip__meta">{item.meta}</span> : null}
                        </div>
                      </article>
                    </Reveal>
                  );
                }

                if (item.layout === 'pdf') {
                  const pdfHref = item.pdf ? pressMentionPdfDownloadUrl(item.id) : item.url || null;
                  return (
                    <Reveal key={item.id} variant="up" delay={i * 30}>
                      {pdfHref ? (
                        <a
                          href={pdfHref}
                          className="impact-clip impact-clip--pdf"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div>
                            {item.outlet ? <span className="impact-clip__outlet">{item.outlet}</span> : null}
                            <h3>{displayText(item.title)}</h3>
                          </div>
                          <div>
                            {item.meta ? <span className="impact-clip__meta">{item.meta}</span> : null}
                            <div className="impact-clip__read">Download PDF ↗</div>
                          </div>
                        </a>
                      ) : (
                        <article className="impact-clip impact-clip--pdf">
                          <div>
                            {item.outlet ? <span className="impact-clip__outlet">{item.outlet}</span> : null}
                            <h3>{displayText(item.title)}</h3>
                          </div>
                          {item.meta ? <span className="impact-clip__meta">{item.meta}</span> : null}
                        </article>
                      )}
                    </Reveal>
                  );
                }

                // clip + link (and any unknown) — outlet / headline / external URL
                const href = item.url || null;
                const clipInner = (
                  <>
                    <div>
                      {item.outlet ? <span className="impact-clip__outlet">{item.outlet}</span> : null}
                      <h3>{displayText(item.title)}</h3>
                    </div>
                    <div>
                      {item.meta ? <span className="impact-clip__meta">{item.meta}</span> : null}
                      {href ? (
                        <div className="impact-clip__read">
                          {item.layout === 'link' ? 'Open link →' : 'Read the report →'}
                        </div>
                      ) : null}
                    </div>
                  </>
                );
                return (
                  <Reveal key={item.id} variant="up" delay={i * 30}>
                    {href ? (
                      <a href={href} className="impact-clip" target="_blank" rel="noreferrer">
                        {clipInner}
                      </a>
                    ) : (
                      <article className="impact-clip">{clipInner}</article>
                    )}
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <p className="impact-empty">No press mentions published yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
