import { useId, useState } from 'react';

export default function FaqAccordion({ items }) {
  const baseId = useId();
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <div className="faq-accordion">
      {items.map((faq) => {
        const isOpen = openId === faq.id;
        const panelId = `${baseId}-${faq.id}`;

        return (
          <div key={faq.id} className={`faq-accordion__item ${isOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              id={`${panelId}-trigger`}
              className="faq-accordion__trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : faq.id)}
            >
              <span className="faq-accordion__question">{faq.question}</span>
              <span className="faq-accordion__icon" aria-hidden="true" />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={`${panelId}-trigger`}
              className="faq-accordion__panel"
              hidden={!isOpen}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
