import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/motion/Reveal';
import publicApi from '../lib/publicApi';
import { assetUrl } from '../lib/api';
import { renderRichText } from '../lib/richText';
import photoAjayStory from '../assets/_unused/father.jpeg';
import './About.css';

const FALLBACK_TEAM = [
  {
    id: 'ajay-garg',
    name: 'Mr. Ajay Garg, Advocate',
    role: 'Founder',
    subtitle: 'Founder · Supreme Court of India & Delhi High Court',
    bio: "A graduate of the Campus Law Centre, University of Delhi, Mr. Ajay Garg has over three decades of experience as a practising Advocate before the Supreme Court of India and the Delhi High Court.",
    image: photoAjayStory,
    photoPos: '28% 20%',
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

export default function TeamPage() {
  const [team, setTeam] = useState(FALLBACK_TEAM);

  useEffect(() => {
    publicApi
      .get('/team')
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length) setTeam(r.data.map(mapTeamMember));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="about about--v3 about-team-page">
      <section className="about-team about-team--full" id="team">
        <div className="container">
          <Reveal as="header" className="about-team__head" variant="up">
            <Link to="/about#team" className="about-team__back">
              ← Back to About
            </Link>
            <span className="about-kicker">Our Team</span>
            <h1>All team members</h1>
            <p className="about-team__lede">
              Every profile published from the admin CMS appears here. Add or edit people under Admin → Team.
            </p>
          </Reveal>
          <div className="about-team__grid">
            {team.map((person, i) => (
              <Reveal
                key={person.id || person.name}
                as="article"
                className="about-team__card"
                variant="up"
                delay={Math.min(i, 11) * 30}
              >
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
                <h2>{person.name}</h2>
                {person.subtitle ? <p className="about-team__sub">{person.subtitle}</p> : null}
                {person.bio ? <p>{renderRichText(person.bio)}</p> : null}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
