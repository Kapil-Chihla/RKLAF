import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';

const SECTIONS = [
  {
    heading: 'Our Work & Impact',
    items: [
      {
        to: '/admin/desk',
        label: 'Programmes & Initiatives',
        desc: 'Case stories for Our Work → Programmes & Initiatives — listing copy, hero photo, full account + gallery.',
        statKey: 'deskStories',
      },
      {
        to: '/admin/running-now',
        label: 'Running now',
        desc: 'Pending litigation cards on Impact — status, allegation, relief, stage.',
        statKey: 'runningNow',
      },
      {
        to: '/admin/told-in-full',
        label: 'Told in full',
        desc: 'Delhi prisons programme stories on Impact (problem / action / result).',
        statKey: 'toldInFull',
      },
      {
        to: '/admin/success-stories',
        label: 'Argued in full',
        desc: 'Impact success stories — problem / action / result and full story pages.',
        statKey: 'successStories',
      },
      {
        to: '/admin/also-on-record',
        label: 'Also on record',
        desc: 'Year + header + description + PDF ledger on Impact.',
        statKey: 'alsoOnRecord',
      },
      {
        to: '/admin/press-mentions',
        label: 'Press mentions',
        desc: 'Press clips, images, and quotes for the Impact mosaic.',
        statKey: 'pressMentions',
      },
      {
        to: '/admin/reports',
        label: 'Annual reports',
        desc: 'Year + PDF. Public Our Work page shows the latest 2 years only.',
        statKey: 'reports',
      },
    ],
  },
  {
    heading: 'Know Your Rights',
    items: [
      {
        to: '/admin/articles',
        label: 'Practical guides',
        desc: 'Cover image + PDF + title + description for the KYR guides grid.',
        statKey: 'articles',
      },
      {
        to: '/admin/rights-decks',
        label: 'Guide decks',
        desc: 'Carousel decks on KYR — banner, titles, description, PDF. Latest first.',
        statKey: 'rightsDecks',
      },
      {
        to: '/admin/explainer-videos',
        label: 'Explainer videos',
        desc: 'Thumbnail + video file or YouTube link for the KYR horizontal carousel.',
        statKey: 'explainerVideos',
      },
    ],
  },
  {
    heading: 'Library',
    items: [
      {
        to: '/admin/library-podcasts',
        label: 'Audio & video podcasts',
        desc: 'Spotify / YouTube links or uploaded files — top player + top 5 lists on Library.',
        statKey: 'libraryPodcasts',
      },
    ],
  },
  {
    heading: 'Academics',
    items: [
      {
        to: '/admin/blogs',
        label: 'Blogs & experiences',
        desc: 'Shelf posts — latest first. Point-wise sections on the full article page.',
        statKey: 'blogs',
      },
      {
        to: '/admin/papers',
        label: 'Research & white papers',
        desc: 'PDF uploads with title and meta line.',
        statKey: 'papers',
      },
    ],
  },
  {
    heading: 'Inbox & team',
    items: [
      {
        to: '/admin/contacts',
        label: 'Contact inbox',
        desc: 'Messages from Contact, KYR Ask, and Donate forms. Mark read or delete.',
        statKey: 'contacts',
      },
      {
        to: '/admin/team',
        label: 'Team profiles',
        desc: 'Public team members — name, role, bio, and photo.',
        statKey: 'team',
      },
    ],
  },
];

export default function Dashboard() {
  const { isSuperAdmin } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data)).catch(() => setStats({}));
  }, []);

  return (
    <div className="admin-dash">
      <header className="admin-dash__head">
        <h1>Content dashboard</h1>
        <p>
          Use the left sidebar (or the cards below) to upload content. Everything you publish here expands
          the matching public pages automatically.
        </p>
      </header>

      {stats && (
        <div className="admin-stats">
          <div className="admin-stat">
            <strong>{stats.deskStories ?? 0}</strong>
            <span>Programmes</span>
          </div>
          <div className="admin-stat">
            <strong>{stats.successStories ?? 0}</strong>
            <span>Success stories</span>
          </div>
          <div className="admin-stat">
            <strong>{stats.reports ?? 0}</strong>
            <span>Reports</span>
          </div>
          <div className="admin-stat">
            <strong>{stats.articles ?? 0}</strong>
            <span>KYR guides</span>
          </div>
          <div className="admin-stat">
            <strong>{stats.rightsDecks ?? 0}</strong>
            <span>KYR decks</span>
          </div>
          <div className="admin-stat">
            <strong>{stats.explainerVideos ?? 0}</strong>
            <span>KYR videos</span>
          </div>
          <div className="admin-stat">
            <strong>{stats.blogs ?? 0}</strong>
            <span>Blogs</span>
          </div>
          <div className="admin-stat">
            <strong>{stats.papers ?? 0}</strong>
            <span>Papers</span>
          </div>
          <div className="admin-stat">
            <strong>{stats.team ?? 0}</strong>
            <span>Team</span>
          </div>
          <div className="admin-stat">
            <strong>{stats.unreadContacts ?? 0}</strong>
            <span>Unread messages</span>
          </div>
        </div>
      )}

      {SECTIONS.map((section) => (
        <section key={section.heading} className="admin-dash__section">
          <h2>{section.heading}</h2>
          <div className="admin-dashboard-grid">
            {section.items.map((item) => (
              <Link key={item.to} to={item.to} className="admin-card admin-card--link">
                <div className="admin-card__meta">
                  <h3>{item.label}</h3>
                  {stats ? (
                    <span>
                      {item.statKey === 'contacts'
                        ? `${stats.unreadContacts ?? 0} unread · ${stats.contacts ?? 0} total`
                        : `${stats[item.statKey] ?? 0} published`}
                    </span>
                  ) : null}
                </div>
                <p>{item.desc}</p>
                <span className="admin-card__cta">Open upload panel →</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {isSuperAdmin ? (
        <section className="admin-dash__section">
          <h2>Access</h2>
          <div className="admin-dashboard-grid">
            <Link to="/admin/users" className="admin-card admin-card--link admin-card--accent">
              <div className="admin-card__meta">
                <h3>Team access</h3>
                {stats ? <span>{stats.pendingInvites ?? 0} pending invites</span> : null}
              </div>
              <p>Invite editors/admins by email and share the registration link.</p>
              <span className="admin-card__cta">Manage team →</span>
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
