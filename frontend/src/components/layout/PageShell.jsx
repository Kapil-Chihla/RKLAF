import useReveal from '../../hooks/useReveal';

export default function PageShell({ title, subtitle, children }) {
  const [bannerRef, bannerVisible] = useReveal(0.08);
  const [contentRef, contentVisible] = useReveal(0.06);

  return (
    <>
      <section
        ref={bannerRef}
        className={`page-banner reveal reveal--up ${bannerVisible ? 'is-visible' : ''}`}
      >
        <div className="container">
          <h1>{title}</h1>
          {subtitle && <p className="page-banner-subtitle">{subtitle}</p>}
        </div>
      </section>
      <section className="page-content">
        <div
          ref={contentRef}
          className={`container page-content-inner ${contentVisible ? 'is-visible' : ''}`}
          data-reveal-children
          style={{ '--reveal-delay': '100ms' }}
        >
          {children}
        </div>
      </section>
    </>
  );
}
