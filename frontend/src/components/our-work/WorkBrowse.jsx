import { NavLink } from 'react-router-dom';
import { WORK_BROWSE } from '../../data/ourWorkBrowse';

/** Sticky browse strip shared by Our Work + subpages */
export default function WorkBrowse({ activeId }) {
  return (
    <nav className="work-browse" aria-label="Browse Our Work">
      <div className="container work-browse__inner">
        {WORK_BROWSE.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.to}
            end={tab.to === '/our-work'}
            className={({ isActive }) =>
              `work-browse__tab${isActive || activeId === tab.id ? ' is-active' : ''}`
            }
          >
            <span className="work-browse__num">{tab.num}</span>
            <span className="work-browse__label">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
