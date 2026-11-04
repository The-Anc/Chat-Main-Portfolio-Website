(() => {
  const cfg = window.SUPABASE_CONFIG || {};
  const configured = window.supabase && cfg.url && !cfg.url.includes('YOUR_') && cfg.anonKey && !cfg.anonKey.includes('YOUR_');
  const warning = document.getElementById('setup-warning');
  const loginStatus = document.getElementById('login-status');
  const uploadStatus = document.getElementById('upload-status');
  const loginPanel = document.getElementById('login-panel');
  const dashboard = document.getElementById('dashboard');
  let client = null;
  if (configured) {
    client = window.supabase.createClient(cfg.url, cfg.anonKey);
    warning.classList.add('hidden');
    loginStatus.textContent = 'Supabase connected. Sign in with your admin account.';
  }
  const say = (el, message) => { el.textContent = message; };
  const safeName = name => name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').slice(-100);
  function showSession(session) {
    loginPanel.classList.toggle('hidden', !!session);
    dashboard.classList.toggle('hidden', !session);
    if (session) loadProjects();
  }
  if (client) client.auth.getSession().then(({ data }) => showSession(data.session));
  document.getElementById('login-btn').addEventListener('click', async () => {
    if (!client) return say(loginStatus, 'Please configure Supabase first. See README.md.');
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    say(loginStatus, 'Signing in…');
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return say(loginStatus, error.message);
    showSession(data.session);
  });
  document.getElementById('logout-btn').addEventListener('click', async () => { await client.auth.signOut(); showSession(null); });
  document.getElementById('upload-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (!client) return say(uploadStatus, 'Supabase is not configured.');
    const session = (await client.auth.getSession()).data.session;
    if (!session) return say(uploadStatus, 'Your session has expired. Please sign in again.');
    const btn = document.getElementById('publish-btn'); btn.disabled = true; say(uploadStatus, 'Uploading your project…');
    try {
      const category = document.getElementById('category').value;
      const type = document.getElementById('project-type').value;
      const file = document.getElementById('media-file').files[0];
      const thumbFile = document.getElementById('thumbnail-file').files[0];
      const externalUrl = document.getElementById('external-url').value.trim();
      let mediaUrl = externalUrl, thumbnailUrl = '';
      const bucket = cfg.bucket || 'portfolio';
      if (!externalUrl && file) {
        const path = `${category}/${Date.now()}-${safeName(file.name)}`;
        const { error } = await client.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
        if (error) throw error;
        mediaUrl = client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      }
      if (thumbFile) {
        const path = `thumbnails/${Date.now()}-${safeName(thumbFile.name)}`;
        const { error } = await client.storage.from(bucket).upload(path, thumbFile, { cacheControl: '3600', upsert: false, contentType: thumbFile.type });
        if (error) throw error;
        thumbnailUrl = client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
      } else if (type === 'image' && !externalUrl) thumbnailUrl = mediaUrl;
      if (!mediaUrl) throw new Error('Choose a file or enter an external video URL.');
      const project = { category, type, title: document.getElementById('title').value.trim(), description: document.getElementById('description').value.trim(), label: document.getElementById('label').value.trim(), url: mediaUrl, thumbnail: thumbnailUrl };
      const { error } = await client.from('portfolio_projects').insert(project);
      if (error) throw error;
      event.target.reset(); say(uploadStatus, 'Published successfully. Your public portfolio will update automatically.'); await loadProjects();
    } catch (error) { say(uploadStatus, `Could not publish: ${error.message}`); }
    finally { btn.disabled = false; }
  });
  async function loadProjects() {
    const list = document.getElementById('project-list'); list.textContent = 'Loading projects…';
    const { data, error } = await client.from('portfolio_projects').select('*').order('created_at', { ascending: false });
    if (error) { list.textContent = error.message; return; }
    list.innerHTML = '';
    if (!data.length) { list.textContent = 'No projects published yet. Your first upload can go here.'; return; }
    data.forEach(project => {
      const row = document.createElement('div'); row.className = 'project-row';
      const info = document.createElement('div'); const title = document.createElement('b'); title.textContent = project.title; const meta = document.createElement('small'); meta.textContent = `${project.category} · ${project.type}`; info.append(title, meta);
      const del = document.createElement('button'); del.className = 'delete-button'; del.textContent = 'Delete'; del.addEventListener('click', async () => {
        if (!confirm(`Delete “${project.title}” from the portfolio?`)) return;
        const { error: deleteError } = await client.from('portfolio_projects').delete().eq('id', project.id);
        if (deleteError) return say(uploadStatus, deleteError.message);
        await loadProjects(); say(uploadStatus, 'Project deleted.');
      });
      row.append(info, del); list.appendChild(row);
    });
  }
})();
