import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const emptyForm = {
  name: '',
  country: '',
  region: '',
  workType: '',
  lat: '',
  lng: '',
  mapX: '',
  mapY: '',
  summary: '',
  overviewUrl: '/our-work/impact',
  workItemsJson: '[]',
  active: true,
};

export default function MapLocationsManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/map-locations?active=false').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    let workItems = [];
    try {
      workItems = JSON.parse(form.workItemsJson || '[]');
      if (!Array.isArray(workItems)) throw new Error('workItems must be an array');
    } catch {
      setMsg('Work items must be valid JSON array, e.g. [{"title":"Program name","url":"/our-work/programs"}]');
      return;
    }

    const payload = {
      name: form.name,
      country: form.country,
      region: form.region,
      workType: form.workType,
      lat: form.lat ? Number(form.lat) : null,
      lng: form.lng ? Number(form.lng) : null,
      mapX: form.mapX ? Number(form.mapX) : undefined,
      mapY: form.mapY ? Number(form.mapY) : undefined,
      summary: form.summary,
      overviewUrl: form.overviewUrl,
      workItems,
      active: form.active,
    };

    try {
      if (editingId) {
        await api.put(`/map-locations/${editingId}`, payload);
        setMsg('Location updated.');
      } else {
        await api.post('/map-locations', payload);
        setMsg('Location added to map.');
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to save');
    }
  };

  const startEdit = (loc) => {
    setEditingId(loc.id);
    setForm({
      name: loc.name,
      country: loc.country || '',
      region: loc.region || '',
      workType: loc.workType || '',
      lat: loc.lat ?? '',
      lng: loc.lng ?? '',
      mapX: loc.mapX ?? '',
      mapY: loc.mapY ?? '',
      summary: loc.summary || '',
      overviewUrl: loc.overviewUrl || '/our-work/impact',
      workItemsJson: JSON.stringify(loc.workItems || [], null, 2),
      active: loc.active !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <h1 style={{ color: '#1e3347', marginTop: 0 }}>Impact map locations</h1>
      <p style={{ color: '#5a6f82' }}>
        Manage dots on the homepage and Our Impact map. Use latitude/longitude (auto-placed) or
        manual map X/Y from 0–100.
      </p>

      <div className="admin-card">
        <h2>{editingId ? 'Edit location' : 'Add map location'}</h2>
        {msg && (
          <div className={`admin-alert ${msg.includes('Failed') || msg.includes('valid') ? 'admin-alert--error' : 'admin-alert--success'}`}>
            {msg}
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Location name *
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Country
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </label>
          <label>
            Region
            <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="South Asia" />
          </label>
          <label>
            Type of work
            <input value={form.workType} onChange={(e) => setForm({ ...form, workType: e.target.value })} placeholder="Undertrial Support" />
          </label>
          <label>
            Latitude
            <input type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
          </label>
          <label>
            Longitude
            <input type="number" step="any" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
          </label>
          <label>
            Map X % (optional override)
            <input type="number" min="0" max="100" step="0.1" value={form.mapX} onChange={(e) => setForm({ ...form, mapX: e.target.value })} />
          </label>
          <label>
            Map Y % (optional override)
            <input type="number" min="0" max="100" step="0.1" value={form.mapY} onChange={(e) => setForm({ ...form, mapY: e.target.value })} />
          </label>
          <label>
            Summary
            <textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </label>
          <label>
            Overview link
            <input value={form.overviewUrl} onChange={(e) => setForm({ ...form, overviewUrl: e.target.value })} />
          </label>
          <label>
            Work items (JSON)
            <textarea
              rows={4}
              value={form.workItemsJson}
              onChange={(e) => setForm({ ...form, workItemsJson: e.target.value })}
              placeholder='[{"title":"Tihar Support","url":"/our-work/programs"}]'
            />
          </label>
          <label style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Show on public map
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className="admin-btn admin-btn--primary">
              {editingId ? 'Save changes' : 'Add to map'}
            </button>
            {editingId && (
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => { setEditingId(null); setForm(emptyForm); }}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2>Locations ({items.length})</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Region</th>
              <th>Work type</th>
              <th>Map</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((loc) => (
              <tr key={loc.id}>
                <td>{loc.name}</td>
                <td>{loc.region}</td>
                <td>{loc.workType}</td>
                <td>{loc.mapX}%, {loc.mapY}%</td>
                <td>{loc.active !== false ? 'Yes' : 'No'}</td>
                <td>
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={() => startEdit(loc)}>
                    Edit
                  </button>
                  {canDelete && (
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger"
                      style={{ marginLeft: '0.35rem' }}
                      onClick={async () => {
                        if (!window.confirm('Remove this map location?')) return;
                        await api.delete(`/map-locations/${loc.id}`);
                        load();
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
