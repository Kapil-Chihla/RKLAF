import useReveal from '../../hooks/useReveal';

/**
 * Scroll-reveal wrapper — adds `reveal reveal--{variant}` + `is-visible` on enter.
 */
export default function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  threshold,
}) {
  const [ref, visible] = useReveal(threshold);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
