import { useState } from 'react';
import axios from 'axios';
import PageShell from '../components/layout/PageShell';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      await axios.post(`${API}/contact`, form);
      setStatus('Thank you. We will get back to you shortly.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('Something went wrong. Please try again.');
    }
  };

  return (
    <PageShell
      title="Contact Us"
      subtitle="Reach out for legal support, partnerships, or general inquiries."
    >
      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label>
            Message
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </label>
          <button type="submit" className="btn btn-primary">Send Message</button>
          {status && <p className="form-status">{status}</p>}
        </form>
        <aside className="contact-aside">
          <h3>Other ways to connect</h3>
          <p>Email: info@legalaid.org</p>
          <p>Phone: +91 99999 99999</p>
          <a href="https://wa.me/919999999999" className="btn btn-maroon" target="_blank" rel="noopener noreferrer">
            WhatsApp Us
          </a>
        </aside>
      </div>
    </PageShell>
  );
}
