const icons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 8.5V6.8c0-.8.6-1.3 1.3-1.3H17V3h-2.2C12.7 3 11 4.8 11 7.2V8.5H9v2.7h2v7.8h3v-7.8h2.6l.4-2.7H14z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3a2.7 2.7 0 0 0-1.9 1.9C2 9 2 12 2 12s0 3 .4 4.8a2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9c.4-1.8.4-4.8.4-4.8s0-3-.4-4.8zM10 15.5V8.5l6 3.5-6 3.5z" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm4.2 13c-.3.5-.9.6-1.4.3-1.5-.9-3.2-1.1-5.3-.6-.5.1-1-.3-1.1-.8s.3-1 .8-1.1c2.5-.6 4.7-.3 6.6 1 .5.3.6.9.4 1.2zm1.2-2.8c-.4.6-1.1.8-1.7.4-1.9-1.2-4.1-1.5-6.8-1-.6.1-1.2-.3-1.3-.9s.3-1.2.9-1.3c3.2-.6 5.9-.2 8.3 1.3.6.4.8 1.1.6 1.5zm.2-3.1C14.7 8.2 10.7 8 7.4 8.8c-.7.2-1.4-.2-1.6-.9s.2-1.4.9-1.6c3.9-1 8.5-.7 11.6 1.7.7.5.8 1.4.3 2-.5.7-1.4.8-2 .3z" />
    </svg>
  ),
};

export default function SocialIcon({ name, className = '' }) {
  return <span className={`social-icon ${className}`}>{icons[name]}</span>;
}
