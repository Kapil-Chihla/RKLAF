import { WHATSAPP_URL } from '../../data/navigation';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.52 3.48A11.87 11.87 0 0 0 12.06 0C5.43 0 .05 5.37.05 12c0 2.11.55 4.18 1.6 6.01L0 24l6.16-1.62A11.9 11.9 0 0 0 12.06 24h.01c6.62 0 12-5.38 12-12 0-3.2-1.25-6.2-3.55-8.52zm-8.46 18.5h-.01c-1.79 0-3.54-.48-5.07-1.38l-.36-.21-3.65.96.97-3.56-.24-.37a9.9 9.9 0 0 1-1.52-5.29c0-5.45 4.43-9.88 9.89-9.88 2.64 0 5.12 1.02 6.98 2.89a9.8 9.8 0 0 1 2.9 6.99c0 5.46-4.44 9.89-9.89 9.89zm5.43-7.42c-.3-.15-1.77-.87-2.05-.98-.27-.1-.47-.15-.66.15-.2.3-.77.98-.95 1.17-.17.2-.35.22-.65.08-.3-.15-1.27-.47-2.43-1.5a9.1 9.1 0 0 1-1.68-2.08c-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.66-1.6-.9-2.2-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.5.08-.76.38-.27.3-1.03 1-1.03 2.44s1.05 2.82 1.2 3.01c.15.2 2.04 3.12 4.94 4.38.69.3 1.24.49 1.66.62.7.22 1.34.19 1.84.12.56-.08 1.77-.72 2.02-1.41.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35z"
      />
    </svg>
  );
}

const isWhatsAppConfigured = WHATSAPP_URL && WHATSAPP_URL !== '#';

export default function WhatsAppFloating() {
  const className = 'whatsapp-float';
  const label = 'Chat with us on WhatsApp';

  if (isWhatsAppConfigured) {
    return (
      <a
        href={WHATSAPP_URL}
        className={`${className} notranslate`}
        translate="no"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
      >
        <WhatsAppIcon />
      </a>
    );
  }

  return (
    <button type="button" className={`${className} notranslate`} translate="no" aria-label={label} title={label}>
      <WhatsAppIcon />
    </button>
  );
}
