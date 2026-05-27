import PageShell from '../components/layout/PageShell';

export default function ContentPage({ title, subtitle, children }) {
  return (
    <PageShell title={title} subtitle={subtitle}>
      {children || (
        <p className="placeholder-text">
          This page is ready for your content. Share copy, images, or documents and we will plug them in.
        </p>
      )}
    </PageShell>
  );
}
