import PageBanner from './PageBanner';

export default function PageShell({ title, subtitle, children }) {
  return (
  <>
    <PageBanner title={title} subtitle={subtitle} />
    <section className="page-content">
      <div className="container page-content-inner">{children}</div>
    </section>
  </>
  );
}
