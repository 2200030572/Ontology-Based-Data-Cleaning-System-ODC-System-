// assets/app.js

// Static Admin label (no lock icons)
document.addEventListener('DOMContentLoaded', () => {
  (function navLabelStatic(){
    const adminLinks = document.querySelectorAll('a[href$="admin/dashboard.html"]');
    adminLinks.forEach(a => a.innerHTML = '<i class="fa-solid fa-gauge-high me-1"></i>Admin');
  })();
});

// Simple demo login (does not control access)
(function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('username')?.value?.trim();
    const p = document.getElementById('password')?.value;
    if (u === 'admin' && p === 'admin123') {
      alert('Login successful (demo).');
      location.href = 'index.html';
    } else {
      alert('Invalid credentials. Try admin / admin123');
    }
  });
})();

// Optional: Logout simply navigates home if present
(function initLogout() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const home = location.pathname.includes('') ? '../index.html' : 'index.html';
    location.href = home;
  });
})();

// Workspace initializers
function initWorkspace(prefix) {
  // Upload
  const fileInput = document.getElementById(prefix + 'fileInput');
  const barUp = document.getElementById(prefix + 'uploadProgress');
  const statusUp = document.getElementById(prefix + 'uploadStatus');
  if (fileInput && barUp && statusUp) {
    fileInput.addEventListener('change', () => {
      if (!fileInput.files || fileInput.files.length === 0) return;
      statusUp.textContent = `Uploading ${fileInput.files[0].name}…`;
      let pct = 0;
      const timer = setInterval(() => {
        pct += Math.floor(Math.random() * 12) + 4;
        if (pct > 100) pct = 100;
        barUp.style.width = pct + '%';
        barUp.textContent = pct + '%';
        if (pct >= 100) {
          clearInterval(timer);
          statusUp.textContent = 'Upload complete. Ready for cleaning.';
          alert('File uploaded successfully (simulated).');
        }
      }, 300);
    });
  }

  // Cleaning
  const btnClean = document.getElementById(prefix + 'startCleaningBtn');
  const barClean = document.getElementById(prefix + 'cleaningProgress');
  const statusClean = document.getElementById(prefix + 'cleaningStatus');
  const statProcessed = document.getElementById(prefix + 'statProcessed');
  const statDuplicates = document.getElementById(prefix + 'statDuplicates');
  const statStandardized = document.getElementById(prefix + 'statStandardized');
  if (btnClean && barClean && statusClean) {
    btnClean.addEventListener('click', () => {
      btnClean.disabled = true;
      let pct = 0;
      statusClean.textContent = 'Initializing pipeline…';
      const phases = [
        { upto: 20, msg: 'Validating schema…' },
        { upto: 45, msg: 'Normalizing brands…' },
        { upto: 65, msg: 'Standardizing units…' },
        { upto: 85, msg: 'Deduplicating records…' },
        { upto: 100, msg: 'Reconciling categories…' }
      ];
      let phaseIndex = 0;
      const timer = setInterval(() => {
        pct += Math.floor(Math.random() * 8) + 3;
        if (pct > phases[phaseIndex].upto) {
          phaseIndex = Math.min(phaseIndex + 1, phases.length - 1);
        }
        if (pct > 100) pct = 100;
        barClean.style.width = pct + '%';
        barClean.textContent = pct + '%';
        statusClean.textContent = phases[phaseIndex].msg;
        if (pct >= 100) {
          clearInterval(timer);
          statusClean.textContent = 'Cleaning complete.';
          btnClean.disabled = false;
          if (statProcessed) statProcessed.textContent = '152';
          if (statDuplicates) statDuplicates.textContent = '18';
          if (statStandardized) statStandardized.textContent = '96';
          alert('Data cleaning finished (simulated).');
        }
      }, 280);
    });
  }

  // Results download
  const dlBtn = document.getElementById(prefix + 'downloadBtn');
  if (dlBtn) {
    dlBtn.addEventListener('click', () => {
      const csv = 'id,name,brand,category\n1,Sample Product,Acme,Electronics';
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cleaned_products.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initWorkspace('');   // Admin IDs
  initWorkspace('u-'); // User/Home Workspace IDs
});

/* Mentor AI Chat logic (unchanged from your build) */
(function initMentorAI() {
  const openBtn = document.getElementById('mentor-launcher');
  const panel = document.getElementById('mentor-panel');
  const closeBtn = document.getElementById('mentor-close');
  const input = document.getElementById('mentor-input');
  const sendBtn = document.getElementById('mentor-send');
  const body = document.getElementById('mentor-body');
  if (!openBtn || !panel || !closeBtn || !input || !sendBtn || !body) return;

  const open = () => { panel.style.display = 'flex'; panel.setAttribute('aria-hidden', 'false'); input.focus(); };
  const close = () => { panel.style.display = 'none'; panel.setAttribute('aria-hidden', 'true'); };
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  function addMessage(text, who = 'bot') {
    const wrap = document.createElement('div');
    wrap.className = `mentor-msg mentor-msg-${who}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }
  function addTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'mentor-msg mentor-msg-bot';
    wrap.id = 'mentor-typing';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = '<span class="mentor-typing"></span><span class="mentor-typing"></span><span class="mentor-typing"></span>';
    wrap.appendChild(bubble);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }
  function removeTyping() {
    const t = document.getElementById('mentor-typing');
    if (t) t.remove();
  }
  async function sendToMentorAI(message) {
    const m = message.toLowerCase();
    if (m.includes('upload')) return 'To upload, go to Workspace → Upload, choose a CSV, and watch the progress bar. Use headers like id, name, brand, category for best results.';
    if (m.includes('clean') || m.includes('pipeline')) return 'Start the cleaning pipeline from Workspace → Cleaning. Steps: validate schema, normalize brands/categories, standardize units, deduplicate, reconcile.';
    if (m.includes('ontology') || m.includes('shacl') || m.includes('skos') || m.includes('owl')) return 'Ontology stack: RDF/OWL for schema, SHACL for shape validation, SKOS for vocabularies/aliases, and SPARQL for reconciliation queries.';
    if (m.includes('download') || m.includes('csv')) return 'After cleaning, open Workspace → Results and use “Download cleaned CSV” to get the standardized file.';
    return 'Here to help with uploads, the cleaning pipeline, results, or ontology concepts. Ask about “How to normalize brands?” or “What does SHACL validate?”.';
  }
  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    addTyping();
    try { const reply = await sendToMentorAI(text); removeTyping(); addMessage(reply, 'bot'); }
    catch (e) { removeTyping(); addMessage('Sorry, something went wrong. Please try again.', 'bot'); }
  }
  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });
})();

// Two-role demo login (no route locking)
(function initDualLogin() {
  // Admin login
  const adminForm = document.getElementById('loginFormAdmin');
  if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('admin-username')?.value?.trim();
      const p = document.getElementById('admin-password')?.value;
      if (u === 'admin' && p === 'admin123') {
        alert('Welcome, Admin (demo). Redirecting to Admin Dashboard…');
        location.href = 'admin/dashboard.html';
      } else {
        alert('Invalid admin credentials. Try admin / admin123');
      }
    });
  }

  // User login
  const userForm = document.getElementById('loginFormUser');
  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('user-username')?.value?.trim();
      const p = document.getElementById('user-password')?.value;
      if (u === 'user' && p === 'user123') {
        alert('Welcome, User (demo). Redirecting to Home...');
        location.href = 'index.html';
      } else {
        alert('Invalid user credentials. Try user / user123');
      }
    });
  }
})();

