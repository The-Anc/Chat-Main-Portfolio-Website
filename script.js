(() => {
  const data = window.PORTFOLIO || {};
  const cfg = window.SUPABASE_CONFIG || {};
  const palettes = [
    'linear-gradient(135deg,#34285f,#9c6eb9 55%,#e2a5c6)',
    'linear-gradient(135deg,#162f55,#4c70a6 55%,#b3a4e7)',
    'linear-gradient(135deg,#4c285b,#c178a5 55%,#f2c29c)',
    'linear-gradient(135deg,#202b4b,#5d4e9c 55%,#b68bd2)',
    'linear-gradient(135deg,#423050,#b77d88 55%,#e9c49e)',
    'linear-gradient(135deg,#1c3d4a,#4e8c91 55%,#d2c1e7)'
  ];
  const symbols = { video: '▶', image: '✧' };
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightbox-content');
  function videoEmbed(url) {
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1`;
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
    return url;
  }
  function showItem(item) {
    if (!item.url) return;
    lightboxContent.innerHTML = '';
    if (item.type === 'image') {
      const img = document.createElement('img'); img.src = item.url; img.alt = item.title || 'Portfolio design'; lightboxContent.appendChild(img);
    } else if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(item.url)) {
      const video = document.createElement('video'); video.src = item.url; video.controls = true; video.autoplay = true; video.playsInline = true; lightboxContent.appendChild(video);
    } else {
      const frame = document.createElement('iframe'); frame.src = videoEmbed(item.url); frame.allow = 'autoplay; fullscreen; picture-in-picture'; frame.allowFullscreen = true; frame.title = item.title || 'Portfolio video'; lightboxContent.appendChild(frame);
    }
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  }
 
function makeCard(item, index) {
    const card = document.createElement('article');
    card.className = 'work-card';

    const thumb = document.createElement('div');
    thumb.className = 'work-thumb';
    thumb.style.setProperty('--thumb', palettes[index % palettes.length]);

    const isLocalVideo =
        item.type === 'video' &&
        /\.(mp4|webm|ogg)(\?.*)?$/i.test(item.url || '');

    const isYouTube = item.type === 'youtube';

    const yt = isYouTube
        ? item.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/)
        : null;

    if (isLocalVideo) {
        const video = document.createElement('video');
        video.className = 'card-video';
        video.src = item.url;
        video.controls = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.autoplay = false;

        thumb.appendChild(video);

    } else if (yt) {
        const videoId = yt[1];

        thumb.style.backgroundImage =
            `url("https://img.youtube.com/vi/${videoId}/hqdefault.jpg")`;
        thumb.style.backgroundSize = 'cover';
        thumb.style.backgroundPosition = 'center';

        const playButton = document.createElement('span');
        playButton.className = 'youtube-play-button';
        playButton.textContent = '▶';
        thumb.appendChild(playButton);

        thumb.addEventListener('click', () => {
            const start = item.url.match(/[?&]t=(\d+)/);
            const timestamp = start ? `&start=${start[1]}` : '';

            const iframe = document.createElement('iframe');
            iframe.src =
                `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1${timestamp}&playsinline=1&cc_load_policy=0&rel=0`;

            iframe.allow =
                'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

            iframe.allowFullscreen = true;
            iframe.title = item.title || 'YouTube video';

            thumb.innerHTML = '';
            thumb.appendChild(iframe);
        }, { once: true });

    } else {
        if (item.thumbnail || (item.url && item.type === 'image')) {
            thumb.style.backgroundImage =
                `linear-gradient(0deg,rgba(12,10,28,.42),rgba(12,10,28,.02)),url("${item.thumbnail || item.url}")`;

            thumb.style.backgroundSize = 'cover';
            thumb.style.backgroundPosition = 'center';
        }

        const symbol = document.createElement('span');
        symbol.className = 'thumb-symbol';
        symbol.textContent = symbols[item.type] || '✦';
        thumb.appendChild(symbol);
    }

    const label = document.createElement('span');
    label.className = 'thumb-label';
    label.textContent = item.label || 'FEATURED WORK';
    thumb.appendChild(label);

    const meta = document.createElement('div');
    meta.className = 'work-meta';

    const copy = document.createElement('div');

    const title = document.createElement('h3');
    title.textContent = item.title || 'Untitled project';

    const desc = document.createElement('p');
    desc.textContent = item.description || 'Creative work';

    copy.append(title, desc);

    const open = document.createElement('span');
    open.className = 'open-icon';
    open.textContent = isLocalVideo || isYouTube ? '▶' : '↗';

    meta.append(copy, open);
    card.append(thumb, meta);

    if (item.url && !isLocalVideo && !isYouTube) {
        card.addEventListener('click', () => showItem(item));
    }
    return card;
  }
  function render(items, targetId, count) {
    const target = document.getElementById(targetId); if (!target) return;
    target.innerHTML = '';
    const list = Array.isArray(items) ? items : [];
    if (list.length) list.forEach((item, i) => target.appendChild(makeCard(item, i)));
    else for (let i = 0; i < count; i++) target.appendChild(makeCard({ title: 'Your next great project', description: 'Add a project using the admin dashboard or content.js', type: targetId === 'designs-grid' ? 'image' : 'video', label: 'YOUR WORK GOES HERE' }, i));
  }
  function renderAll(source) {
    render(source.longForm, 'long-form-grid', 3); render(source.reels, 'reels-grid', 3); render(source.designs, 'designs-grid', 3);
  }
  renderAll(data);
  // Contact details are rendered from one source of truth.
  const email = document.getElementById('email-link');
  if (email) { email.href = `mailto:${data.email || 'chianaeli@gmail.com'}`; email.textContent = `${data.email || 'chianaeli@gmail.com'} ↗`; }
  const wa = document.getElementById('whatsapp-link');
  if (wa) { const number = String(data.whatsapp || '2347039118044').replace(/\D/g, ''); wa.href = `https://wa.me/${number}`; wa.setAttribute('aria-label', 'Chat with ANC Eliezer on WhatsApp'); }
  const insta = document.getElementById('instagram-handle');
  if (insta && data.instagram) insta.textContent = data.instagram;
  document.getElementById('year').textContent = new Date().getFullYear();
  const menu = document.querySelector('.menu-toggle'), nav = document.querySelector('.nav-links');
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));
  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  function closeLightbox() { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); lightboxContent.innerHTML = ''; document.body.style.overflow = ''; }
  // If Supabase is configured, published projects replace the GitHub fallback content.
  async function loadCloudPortfolio() {
    if (!window.supabase || !cfg.url || cfg.url.includes('YOUR_') || !cfg.anonKey || cfg.anonKey.includes('YOUR_')) return;
    try {
      const client = window.supabase.createClient(cfg.url, cfg.anonKey);
      const { data: rows, error } = await client.from('portfolio_projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (rows) {
        const grouped = { longForm: [], reels: [], designs: [] };
        rows.forEach(row => { const key = row.category === 'longForm' ? 'longForm' : row.category === 'reels' ? 'reels' : 'designs'; grouped[key].push(row); });
        renderAll(grouped);
      }
    } catch (err) { console.warn('Cloud portfolio unavailable; showing GitHub content instead.', err.message); }
  }
  loadCloudPortfolio();
})();
