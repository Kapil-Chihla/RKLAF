import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Observes `[data-reveal]` in main content on each route change. */
export default function useAutoReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.querySelector('.site-main');
    if (!root) return undefined;

    const nodes = root.querySelectorAll('[data-reveal]:not(.reveal--managed)');
    if (!nodes.length) return undefined;

    nodes.forEach((node) => {
      const variant = node.dataset.reveal || 'up';
      node.classList.add('reveal', `reveal--${variant}`, 'reveal--managed');
      if (node.dataset.revealDelay) {
        node.style.setProperty('--reveal-delay', `${node.dataset.revealDelay}ms`);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [pathname]);
}
