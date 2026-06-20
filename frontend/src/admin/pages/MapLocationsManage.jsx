import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import AdminMapPicker from '../components/AdminMapPicker';
import { latLngToMapPercent, mapPercentToLatLng } from '../../lib/mapGeo';
import '../components/AdminMapPicker.css';

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
  active: true,
};

const emptyWorkItem = { title: '', url: '' };

export default function MapLocationsManage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [workItems, setWorkItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);

  const load = () => api.get('/map-locations?active=false').then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const setPositionFromMap = (mapX, mapY) => {
    const { lat, lng } = mapPercentToLatLng(mapX, mapY);
    setForm((f) => ({
      ...f,
      mapX: String(mapX),
      mapY: String(mapY),
      lat: String(lat),
      lng: String(lng),
    }));
  };

  const setPositionFromLatLng = (lat, lng) => {
    if (lat === '' || lng === '' || Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) {
      setForm((f) => ({ ...f, lat, lng }));
      return;
    }
    const { mapX, mapY } = latLngToMapPercent(lat, lng);
    setForm((f) => ({
      ...f,
      lat: String(lat),
      lng: String(lng),
      mapX: String(mapX),
      mapY: String(mapY),
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setWorkItems([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!form.mapX || !form.mapY) {
      setMsg('Click on the map to place the pin before saving.');
      return;
    }

    const cleanedWorkItems = workItems
      .filter((item) => item.title.trim())
      .map((item) => ({ title: item.title.trim(), url: item.url.trim() }));

    const payload = {
      name: form.name,
      country: form.country,
      region: form.region,
      workType: form.workType,
      lat: form.lat ? Number(form.lat) : null,
      lng: form.lng ? Number(form.lng) : null,
      mapX: Number(form.mapX),
      mapY: Number(form.mapY),
      summary: form.summary,
      overviewUrl: form.overviewUrl,
      workItems: cleanedWorkItems,
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
      resetForm();
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
      active: loc.active !== false,
    });
    setWorkItems(
      loc.workItems?.length ? loc.workItems.map((item) => ({ ...item })) : [{ ...emptyWorkItem }]
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addWorkItem = () => setWorkItems((list) => [...list, { ...emptyWorkItem }]);

  const updateWorkItem = (index, field, value) => {
    setWorkItems((list) => list.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const removeWorkItem = (index) => {
    setWorkItems((list) => (list.length <= 1 ? [{ ...emptyWorkItem }] : list.filter((_, i) => i !== index)));
  };

  return (
    <div>
      <h1 style={{ color: '#1e3347', marginTop: 0 }}>Impact map locations</h1>
      <p style={{ color: '#5a6f82' }}>
        Click the map to place a pin — it appears on the homepage and Our Impact page. Fill in the
        details below, then save.
      </p>

      <div className="admin-card">
        <h2>{editingId ? 'Edit location' : 'Add map location'}</h2>
        {msg && (
          <div className={`admin-alert ${msg.includes('Failed') || msg.includes('Click') ? 'admin-alert--error' : 'admin-alert--success'}`}>
            {msg}
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit}>
          <AdminMapPicker
            mapX={form.mapX}
            mapY={form.mapY}
            onPlace={setPositionFromMap}
            otherMarkers={items}
            editingId={editingId}
          />

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

          <div className="admin-form__coords-row" style={{ gridColumn: '1 / -1' }}>
            <label>
              Latitude
              <input
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => setPositionFromLatLng(e.target.value, form.lng)}
                placeholder="Auto-filled from map click"
              />
            </label>
            <label>
              Longitude
              <input
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) => setPositionFromLatLng(form.lat, e.target.value)}
                placeholder="Auto-filled from map click"
              />
            </label>
          </div>

          <label>
            Summary
            <textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Short description shown when visitors click the pin" />
          </label>
          <label>
            Overview link
            <input value={form.overviewUrl} onChange={(e) => setForm({ ...form, overviewUrl: e.target.value })} />
          </label>

          <div className="admin-work-items">
            <strong>Programs at this location</strong>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#5a6f82' }}>
              Optional links shown in the map popup under &ldquo;Our work&rdquo;.
            </p>
            {workItems.map((item, index) => (
              <div key={index} className="admin-work-items__row">
                <label>
                  Program name
                  <input
                    value={item.title}
                    onChange={(e) => updateWorkItem(index, 'title', e.target.value)}
                    placeholder="Tihar Jail Support"
                  />
                </label>
                <label>
                  Link (optional)
                  <input
                    value={item.url}
                    onChange={(e) => updateWorkItem(index, 'url', e.target.value)}
                    placeholder="/our-work/programs"
                  />
                </label>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => removeWorkItem(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--ghost" onClick={addWorkItem}>
              + Add program
            </button>
          </div>

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
              <button type="button" className="admin-btn admin-btn--ghost" onClick={resetForm}>
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
