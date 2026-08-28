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
    title: 'The Trust is registered',
    body: 'Registered as a Charitable Trust on 25 November, named after Late Sh. R.S. Garg and Late Smt. Krishna Garg.',
    chip: 'Registered · 25 November 2016',
    side: 'up',
  },
  {
    year: '2016',
    title: "Presence established across Delhi's courts",
    body: "Our lawyers establish a presence across Delhi's major District Courts as well as the Delhi High Court and the Supreme Court of India.",
    side: 'down',
  },
  {
    year: '2016',
    title: 'Legal aid inside Tihar Central Jail',
    body: 'RKLAF begins one of its most significant initiatives: free legal aid for inmates of Tihar Central Jail.',
    side: 'up',
  },
  {
    year: '2017',
    title: 'Compensation secured for families of workers who never came home',
    body: 'Within about a year of our founding, RKLAF secures the first of six resolutions in a case for the families of Indian workers who died in 2016 while employed at companies in the UAE. Across all six cases, spanning families from Uttar Pradesh to Tamil Nadu, RKLAF helps secure a combined INR 3.5 crore in compensation, entirely free of cost.',
    chip: '21 January 2017',
    side: 'down',
  },
  {
    year: '2017',
    title: 'RKLAF proposes the Checklist to Delhi Police',
    body: 'RKLAF writes to the Government of India and the Commissioner of Delhi Police, proposing that every Investigating Officer be equipped with a Checklist for Police Investigation.',
    side: 'up',
  },
  {
    year: '2017',
    title: 'Delhi Police requests our Checklist',
    body: 'Delhi Police writes back to RKLAF, requesting that the checklist be shared for consideration in officer training.',
    chip: '18 December 2017',
    side: 'down',
  },
  {
    year: '2018',
    title: 'Checklist shared with Delhi Police',
    body: 'RKLAF shares its completed General and Specific Checklists with Delhi Police for consideration in officer training.',
    chip: '19 February 2018',
    side: 'up',
  },
  {
    year: '2018',
    title: 'Checklist recognized by Delhi Police',
    body: "The Delhi Police Legal Cell confirms receipt of RKLAF's checklist, calls its suggestions useful, and notes it is being analysed for inclusion in the Basic Training Course of Delhi Police — appreciating RKLAF's effort.",
    chip: '26 March 2018',
    side: 'down',
  },
  {
    year: '2018',
    title: 'Recognized by Delhi Prisons',
    body: 'RKLAF is officially recognized by Delhi Prisons as an approved legal aid provider, a recognition renewed every year since, including 2022 and 2023, across Jails 1, 2, 6, 7, 8/9, 10, 14 & 16.',
    side: 'up',
  },
  {
    year: '2019',
    title: 'Ghar Ghar Nyaya, Legal Aid Camps & Community Outreach',
    body: 'The offline arm of our Know Your Rights campaign begins — door-to-door legal awareness, legal aid camps, and on-ground community outreach, carried out by our interns and volunteers, taking legal literacy and on-the-spot legal aid directly to homes and communities across Delhi.',
    chip: 'Ongoing',
    side: 'down',
  },
  {
    year: '2020',
    title: 'Landmark advocacy before a Constitution Bench of the Supreme Court',
    body: 'We appear before a five-judge Constitution Bench of the Supreme Court of India in Mukesh Singh vs. State (Narcotic Branch of Delhi), among the rarest and most significant forms a case can take, reserved for questions of genuine national importance.',
    chip: '31 August 2020',
    side: 'up',
  },
  {
    year: 'Ongoing',
    title: 'Major court representations',
    body: "Alongside this landmark matter, RKLAF's litigation record includes 1,315+ vacancies for job-seekers, 50+ recruitment rights cases won at the Delhi High Court, and 100+ bails secured — a sample of the case record, not the full picture, which continues to grow with every matter we take on.",
    chip: 'Ongoing',
    side: 'down',
  },
  {
    year: '2022',
    title: 'Branch office opens in Imphal',
    body: 'RKLAF opens its first office outside Delhi, in Imphal, extending free legal aid into the North East.',
    side: 'up',
  },
  {
    year: '2025',
    title: 'Digital Know Your Rights',
    body: 'Our Know Your Rights Campaign goes digital — an ongoing stream of practical guides, explainer videos, condensed visual guides, and podcasts published on our social media channels, taking legal literacy beyond in-person sessions.',
    chip: 'Ongoing',
    side: 'down',
  },
  {
    year: '2026',
    title: 'The Safe School Project: our first RTI & social survey initiative',
    body: "Launched on Republic Day, this two-pronged institutional accountability drive combined 86 RTI applications across 10 States/UTs and 19 districts with offline and digital social surveys reaching 1,700+ students, parents, and teachers, examining whether legal child-safety protections actually reach the schools and communities meant to use them. Findings were compiled into the Foundation's report, The National Child Safety Audit 2026.",
    chip: '26 January 2026',
    side: 'up',
  },
  {
    year: '2026',
    title: '10 years completed',
    body: "A decade since RKLAF's founding in November 2016 — a decade of free, pro bono legal aid, and the foundation for everything still ahead.",
    chip: '10 years',
    side: 'down',
  },
  {
    year: 'Ongoing',
    title: "People we've reached, across every program",
    body: '1,000+ individuals and families directly assisted through case representation; 100,000+ people reached and helped through our dedicated programs and free phone consultations; 25,000+ hours of free legal aid dedicated in defense of the underserved; and officially recognized by Delhi Prisons as an approved legal aid provider since 2018.',
    chip: 'Ongoing',
    side: 'up',
  },
  {
    year: 'Next',
    title: 'International programme',
    body: 'Extending the same model of free legal aid and legal awareness to Indians and their families abroad.',
    chip: 'Launching soon',
    side: 'down',
    soon: true,
  },
];

const stats = [
  {
    label: 'Since 2016',
    end: 1000,
    suffix: '+',
    desc: 'individuals and families directly assisted through case representation',
  },
  {
    label: 'Reach',
    end: 100000,
    suffix: '+',
    desc: 'people reached and helped through our dedicated programs and free phone consultations',
  },
  {
    label: 'Pro bono',
    end: 25000,
    suffix: '+',
    desc: 'hours of free legal aid dedicated in defense of the underserved',
  },
  {
    label: 'Since 2018',
    end: 2018,
    suffix: '',
    desc: 'officially recognized by Delhi Prisons as an approved legal aid provider',
  },
];

const prisonStats = [
  { value: '318', desc: 'undertrials interviewed inside the wards since 2021' },
  { value: '127', desc: 'released on bail after we filed and argued the application' },
  { value: '46', desc: 'freed under Section 479 BNSS for time already served' },
  { value: '0', desc: 'rupees charged to any prisoner or their family, ever' },
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
  const [toldInFull, setToldInFull] = useState([]);
  const [alsoOnRecord, setAlsoOnRecord] = useState([]);
  const [pressMentions, setPressMentions] = useState([]);

  useEffect(() => {
    publicApi.get('/success-stories').then((r) => {
      if (Array.isArray(r.data)) setStories(r.data);
    }).catch(() => {});
    publicApi.get('/running-now').then((r) => {
      if (Array.isArray(r.data)) setRunningNow(r.data);
    }).catch(() => {});
    publicApi.get('/told-in-full').then((r) => {
      if (Array.isArray(r.data)) setToldInFull(r.data);
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
            <h1>The Impact</h1>
            <p>
              Twelve years, thirty-eight districts, one promise kept: nobody loses a case because they could
              not afford to fight it. This is what that looks like on the ground.
            </p>
            <a href="#litigation" className="impact-film">
              <i aria-hidden="true">▶</i> Watch our story
            </a>
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
              <h2>Key Milestones</h2>
            </div>
            <div>
              <p>
                From registration in 2016 to a decade of free legal aid — courts, prisons, police reform,
                community outreach, and the work still ahead.
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
          <Reveal as="header" variant="up">
            <span className="impact-dash impact-dash--gold" aria-hidden="true" />
            <h2>Who we helped, counted honestly</h2>
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
              Every matter here sits in a physical register at the office. Three kinds of work: the cases we
              argue and document in full, the smaller ones we simply put on record, and the ones still running
              in court.
            </p>
          </Reveal>

          <Strand
            label="Running now · criminal relief sought"
            note="Pending matters where the prosecution is live. Nothing here is claimed as a win until the order is on paper."
          />
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

          <Strand
            label="Delhi prisons programme · relief secured"
            note="Legal aid inside Tihar and Mandoli. Undertrials who had no lawyer, no bail application and often no idea what they were charged with."
          />
          <div className="impact-prison">
            <div className="impact-pgrid">
              {prisonStats.map((s) => (
                <div key={s.value + s.desc} className="impact-pstat">
                  <b>{s.value}</b>
                  <span>{s.desc}</span>
                </div>
              ))}
            </div>

            <div className="impact-psub" id="told">
              <b>Told in full</b>
              <span>Matters where the person agreed to have their story recorded.</span>
            </div>
            {toldInFull.length ? (
              <div className="impact-pcases">
                {toldInFull.map((story, i) => {
                  const href = story.slug ? `/impact/told/${story.slug}` : null;
                  const inner = (
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
                  );
                  return (
                    <Reveal key={story.id} variant="up" delay={i * 40}>
                      {href ? (
                        <Link to={href} className="impact-pstory impact-pstory--link">
                          {inner}
                        </Link>
                      ) : (
                        <article className="impact-pstory">{inner}</article>
                      )}
                    </Reveal>
                  );
                })}
              </div>
            ) : (
              <p className="impact-empty">No prison stories published yet.</p>
            )}

            <p className="impact-pnote">
              Weekly legal aid desk inside the jail, run with the prison legal aid clinic. Photography is not
              permitted inside, so this section stays on the record alone.
            </p>
          </div>

          <div id="stories">
            <Strand
              label="Argued in full"
              note="The complete record: what walked in, what we filed, what the order finally said."
            />
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
            label="Also on record"
            note="Smaller matters that ended without a fight worth retelling. Listed because they still counted for someone."
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
          <p className="impact-ledger-note">
            Full list of 1,390+ files available on request. Names withheld unless the client asked for them to
            appear.
          </p>
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
            <h2>Press mentions</h2>
            <p className="impact-intro">
              Coverage of our filings, camps and orders in national and regional press. Clippings are archived
              at the office and linked here where the paper keeps an online edition.
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
