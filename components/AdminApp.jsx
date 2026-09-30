'use client';

import { useEffect, useState } from 'react';

const sections = [
  ['overview', 'Overview'], ['home', 'Homepage'], ['robots', 'Robot showcase'],
  ['news', 'News'], ['facilities', 'Lab facilities'], ['members', 'Members'],
  ['pages', 'Page headings'], ['contact', 'Contact'], ['interface', 'Interface copy'], ['messages', 'Inbox'], ['advanced', 'Advanced'],
];

const newItems = {
  navigation: () => ({ label: 'New page', href: '/' }),
  robots: () => ({ id: crypto.randomUUID(), title: 'New robot', type: 'Robot type', description: '', image: '', imageAlt: '', imageNote: '' }),
  news: () => ({ id: crypto.randomUUID(), title: 'New announcement', date: new Date().toISOString().slice(0, 10), category: 'Club update', summary: '', body: '', image: '', published: false }),
  facilities: () => ({ id: crypto.randomUUID(), name: 'New facility', category: 'Lab', description: '', image: '', imageNote: '' }),
  members: () => ({ id: crypto.randomUUID(), name: 'New member', role: 'Team member', group: 'council', image: '', bio: '', layout: 'side', order: null, showNumber: false }),
  social: () => ({ label: 'New channel', url: 'https://' }),
};

function Field({ label, value, onChange, area = false, type = 'text', hint, options, upload = false, min, max }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadError('');
    const form = new FormData(); form.append('file', file);
    try {
      const response = await fetch('/api/admin/media', { method: 'POST', body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Upload failed.');
      onChange(result.url);
    } catch (error) { setUploadError(error.message); }
    finally { setUploading(false); event.target.value = ''; }
  }
  return <label className="admin-field"><span>{label}</span>{options ? <select value={String(value ?? '')} onChange={(event) => onChange(options.find(([val]) => String(val) === event.target.value)?.[0] ?? event.target.value)}>{options.map(([val, name]) => <option key={String(val)} value={String(val)}>{name}</option>)}</select> : area ? <textarea rows="4" value={value ?? ''} onChange={(event) => onChange(event.target.value)} /> : <input type={type} min={min} max={max} value={value ?? ''} onChange={(event) => onChange(type === 'number' ? (event.target.value === '' ? null : Number(event.target.value)) : event.target.value)} />}{hint && <small>{hint}</small>}{upload && <div className="admin-upload"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} aria-label={`Upload ${label}`} /><small>{uploading ? 'Uploading...' : 'Upload JPEG, PNG or WebP (max 4 MB), or paste an image URL above.'}</small>{uploadError && <small className="admin-error">{uploadError}</small>}{value && <img src={value} alt="Current image" />}</div>}</label>;
}

function AuthScreen({ configured, setupReady, onSuccess }) {
  const [username, setUsername] = useState(''); const [password, setPassword] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: configured ? 'login' : 'setup', username, password, setupToken }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to continue.');
      onSuccess();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className="admin-auth-wrap"><div className="admin-auth"><div className="admin-auth-mark">RC<span>●</span></div><p className="admin-kicker">PRIVATE WORKSPACE</p><h1>{configured ? 'Welcome back.' : 'Create club admin.'}</h1><p>{configured ? 'Sign in to manage the Robotics Club website.' : 'First-time setup. Create the only administrator account for this installation.'}</p>{!configured && !setupReady && <p className="admin-error">Set ADMIN_SETUP_TOKEN in the server environment, then restart the app.</p>}<form onSubmit={submit}><Field label="Username" value={username} onChange={setUsername} /><Field label="Password" value={password} onChange={setPassword} type="password" hint={!configured ? 'Use at least 12 characters. Keep this password safe.' : undefined} />{!configured && <Field label="Server setup key" value={setupToken} onChange={setSetupToken} type="password" />}<button className="admin-primary" disabled={busy || (!configured && !setupReady)} type="submit">{busy ? 'Please wait...' : configured ? 'Sign in' : 'Create admin account'}</button>{error && <p className="admin-error" role="alert">{error}</p>}</form><a href="/">Return to public site</a></div></div>;
}

export default function AdminApp() {
  const [auth, setAuth] = useState(null);
  const [site, setSite] = useState(null);
  const [messages, setMessages] = useState([]);
  const [section, setSection] = useState('overview');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [raw, setRaw] = useState('');

  async function load() {
    const authResponse = await fetch('/api/admin/auth', { cache: 'no-store' });
    const status = await authResponse.json(); setAuth(status);
    if (status.authenticated) {
      const [siteResponse, messagesResponse] = await Promise.all([fetch('/api/admin/site', { cache: 'no-store' }), fetch('/api/admin/messages', { cache: 'no-store' })]);
      const nextSite = await siteResponse.json();
      setSite(nextSite); setRaw(JSON.stringify(nextSite, null, 2));
      if (messagesResponse.ok) setMessages(await messagesResponse.json());
      setDirty(false);
    }
  }
  useEffect(() => { load().catch(() => setNotice('Unable to load the admin workspace. Reload the page.')); }, []);
  useEffect(() => { const warn = (event) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [dirty]);

  function update(path, value) {
    setSite((current) => { const next = structuredClone(current); let node = next; for (const key of path.slice(0, -1)) node = node[key]; node[path.at(-1)] = value; return next; });
    setDirty(true); setNotice('');
  }
  function updateItem(collection, index, key, value, parent = null) { update(parent ? [parent, collection, index, key] : [collection, index, key], value); }
  function addItem(collection, parent = null) { const current = parent ? site[parent][collection] : site[collection]; update(parent ? [parent, collection] : [collection], [...current, newItems[collection]()]); }
  function removeItem(collection, index, parent = null) { if (!window.confirm('Remove this item? Save changes to publish the removal.')) return; const current = parent ? site[parent][collection] : site[collection]; update(parent ? [parent, collection] : [collection], current.filter((_, i) => i !== index)); }
  function moveItem(collection, index, direction, parent = null) { const current = [...(parent ? site[parent][collection] : site[collection])]; const target = index + direction; if (target < 0 || target >= current.length) return; [current[index], current[target]] = [current[target], current[index]]; update(parent ? [parent, collection] : [collection], current); }
  async function save() {
    setSaving(true); setNotice('');
    try {
      const response = await fetch('/api/admin/site', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(site) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to save.');
      setDirty(false); setRaw(JSON.stringify(site, null, 2)); setNotice('Saved. The public site now shows your changes.');
    } catch (error) { setNotice(error.message); }
    finally { setSaving(false); }
  }
  async function logout() { await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) }); setSite(null); setAuth({ configured: true, authenticated: false }); }
  function choose(next) { setSection(next); setNotice(''); if (next === 'advanced') setRaw(JSON.stringify(site, null, 2)); }
  function applyJson() { try { const value = JSON.parse(raw); setSite(value); setDirty(true); setNotice('JSON applied locally. Save changes to publish.'); } catch { setNotice('JSON syntax is invalid.'); } }

  if (!auth) return <div className="admin-loading">Loading club workspace...</div>;
  if (!auth.authenticated) return <AuthScreen configured={auth.configured} setupReady={auth.setupReady} onSuccess={load} />;
  if (!site) return <div className="admin-loading">Loading site content...</div>;

  const simple = (path, label, options = {}) => <Field label={label} value={path.reduce((node, key) => node[key], site)} onChange={(value) => update(path, value)} {...options} />;
  const list = (collection, title, fields, parent = null) => {
    const items = parent ? site[parent][collection] : site[collection];
    return <div className="admin-list"><div className="admin-list-head"><h3>{title}</h3><button type="button" onClick={() => addItem(collection, parent)}>+ Add item</button></div>{items.length === 0 && <p className="admin-muted">Nothing here yet. Add an item to publish one.</p>}{items.map((item, index) => <div className="admin-item" key={item.id || index}><div className="admin-item-head"><strong>{item.title || item.name || item.label || `Item ${index + 1}`}</strong><div><button type="button" onClick={() => moveItem(collection, index, -1, parent)} disabled={index === 0} aria-label="Move up">↑</button><button type="button" onClick={() => moveItem(collection, index, 1, parent)} disabled={index === items.length - 1} aria-label="Move down">↓</button><button type="button" className="admin-danger" onClick={() => removeItem(collection, index, parent)}>Remove</button></div></div><div className="admin-field-grid">{fields.map(([key, label, options]) => <Field key={key} label={label} value={item[key]} onChange={(value) => updateItem(collection, index, key, value, parent)} {...options} />)}</div></div>)}</div>;
  };

  return <div className="admin-shell"><aside className="admin-sidebar"><div className="admin-logo"><span>RC</span><div><strong>Club Control</strong><small>CONTENT WORKSPACE</small></div></div><nav aria-label="Admin sections">{sections.map(([key, label]) => <button type="button" key={key} className={section === key ? 'selected' : ''} onClick={() => choose(key)}>{label}</button>)}</nav><div className="admin-sidebar-bottom"><a href="/" target="_blank" rel="noopener noreferrer">View public site ↗</a><button type="button" onClick={logout}>Sign out</button></div></aside><main className="admin-main"><header className="admin-topbar"><div><span>ROBOTICS CLUB / ADMIN</span><h1>{sections.find(([key]) => key === section)?.[1]}</h1></div><div className="admin-actions"><span className={dirty ? 'admin-unsaved' : ''}>{dirty ? 'Unsaved changes' : 'All changes saved'}</span><button className="admin-primary" type="button" disabled={!dirty || saving} onClick={save}>{saving ? 'Saving...' : 'Save changes'}</button></div></header>{notice && <div className="admin-notice" role="status">{notice}</div>}
      <div className="admin-content">
        {section === 'overview' && <><p className="admin-lead">Edit the identity, navigation and footer shown across the public website.</p><div className="admin-card"><h2>Club identity</h2><div className="admin-field-grid">{simple(['brand','name'],'Club name')}{simple(['brand','campus'],'Campus name')}{simple(['brand','shortCampus'],'Campus abbreviation')}{simple(['brand','logoText'],'Logo text')}{simple(['brand','logoImage'],'Logo image URL',{upload:true})}</div></div>{list('navigation','Main navigation',[['label','Link label'],['href','Link destination']])}<div className="admin-card"><h2>Footer</h2><div className="admin-field-grid">{simple(['footer','text'],'Footer line')}{simple(['footer','note'],'Footer note')}</div></div><div className="admin-card"><h2>Search and color</h2><div className="admin-field-grid">{simple(['seo','title'],'Browser title')}{simple(['seo','description'],'Search description',{area:true})}{simple(['theme','accent'],'Accent color',{type:'color'})}</div></div></>}
        {section === 'home' && <><p className="admin-lead">These fields shape the first screen visitors see.</p><div className="admin-card"><h2>Introduction</h2><div className="admin-field-grid">{simple(['home','heading'],'Main heading')}{simple(['home','description'],'Introduction',{area:true})}{simple(['home','primaryLabel'],'Primary button label')}{simple(['home','primaryHref'],'Primary button destination')}{simple(['home','secondaryLabel'],'Secondary button label')}{simple(['home','secondaryHref'],'Secondary button destination')}</div></div><div className="admin-card"><h2>Showcase and news labels</h2><div className="admin-field-grid">{simple(['home','showcaseLabel'],'Showcase label')}{simple(['home','newsHeading'],'News heading')}{simple(['home','newsEmptyTitle'],'Empty news title')}{simple(['home','newsEmptyText'],'Empty news description',{area:true})}</div></div></>}
        {section === 'robots' && <><p className="admin-lead">These robot features rotate automatically on the homepage. Replace concept imagery with photos from the actual lab when available.</p>{list('robots','Robot slides',[['title','Robot title'],['type','Category'],['description','Short description',{area:true}],['image','Image URL',{upload:true}],['imageAlt','Image description'],['imageNote','Image note']])}</>}
        {section === 'news' && <><p className="admin-lead">Only published items appear on the public site. New announcements start as drafts.</p>{list('news','Announcements',[['title','Headline'],['date','Date',{type:'date'}],['category','Category'],['summary','Short summary',{area:true}],['body','Full story',{area:true}],['image','Image URL',{upload:true}],['published','Status',{options:[[false,'Draft'],[true,'Published']]}]])}</>}
        {section === 'facilities' && <><p className="admin-lead">Describe lab areas and equipment. Remove items that are not confirmed by the club.</p>{list('facilities','Lab facilities',[['name','Facility name'],['category','Category'],['description','Description',{area:true}],['image','Image URL',{upload:true}],['imageNote','Image note']])}</>}
        {section === 'members' && <><p className="admin-lead">Add faculty and student council profiles. Set a display order to place someone first, or leave it blank to use the list order.</p>{list('members','People',[['name','Full name'],['role','Role'],['group','Group',{options:[['council','Student council'],['faculty','Faculty']]}],['bio','Short bio',{area:true}],['image','Portrait URL',{upload:true}],['layout','Card style',{options:[['side','Photo beside text'],['top','Photo on top'],['center','Centered']]}],['order','Display order',{type:'number',min:1,max:100,hint:'Lower numbers appear first. Blank uses the list order.'}],['showNumber','Display number',{options:[[false,'Hide number'],[true,'Show number']]}]])}</>}
        {section === 'pages' && <><p className="admin-lead">Change the heading and introduction on each public page.</p>{Object.entries(site.pages).map(([key]) => <div className="admin-card" key={key}><h2>{key.charAt(0).toUpperCase()+key.slice(1)}</h2><div className="admin-field-grid">{simple(['pages',key,'heading'],'Heading')}{simple(['pages',key,'description'],'Description',{area:true})}</div></div>)}</>}
        {section === 'contact' && <><div className="admin-card"><h2>Contact details and form</h2><div className="admin-field-grid">{simple(['contact','email'],'Public email',{type:'email'})}{simple(['contact','location'],'Location')}{simple(['contact','formHeading'],'Form heading')}{simple(['contact','formButton'],'Submit button label')}{simple(['contact','successText'],'Success message',{area:true})}</div></div>{list('social','Social links',[['label','Channel name'],['url','Channel URL']], 'contact')}</>}
        {section === 'interface' && <><p className="admin-lead">Edit the smaller public labels and empty states across the site.</p><div className="admin-card"><h2>Public interface labels</h2><div className="admin-field-grid">{Object.entries(site.ui).map(([key, value]) => <Field key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())} value={value} onChange={(next) => update(['ui', key], next)} area={value.length > 90} />)}</div></div></>}
        {section === 'messages' && <><p className="admin-lead">Messages sent through the public contact form are stored on this server.</p><div className="admin-list"><div className="admin-list-head"><h3>Inbox <span>({messages.length})</span></h3><button type="button" onClick={async () => { const r = await fetch('/api/admin/messages', {cache:'no-store'}); if(r.ok) setMessages(await r.json()); }}>Refresh</button></div>{messages.length === 0 ? <p className="admin-muted">No messages yet.</p> : messages.map((message) => <article className="admin-message" key={message.id}><div><strong>{message.name}</strong><span>{new Date(message.date).toLocaleString()}</span></div><a href={`mailto:${message.email}`}>{message.email}</a><p>{message.message}</p></article>)}</div></>}
        {section === 'advanced' && <><p className="admin-lead">Edit the complete site content document. Use this when a field is easier to change as JSON. Invalid structures are rejected when saving.</p><div className="admin-card"><h2>Full content JSON</h2><textarea className="admin-json" spellCheck="false" value={raw} onChange={(event) => setRaw(event.target.value)} /><button className="admin-primary" type="button" onClick={applyJson}>Apply JSON to editor</button></div></>}
      </div>
    </main></div>;
}
