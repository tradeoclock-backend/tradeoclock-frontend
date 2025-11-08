// Point to your Render backend
const API = 'https://tradeoclock-backend.onrender.com';

// Helper to update the status line
function setStatus(text, isError = false) {
  const el = document.getElementById('status');
  el.textContent = text;
  el.style.color = isError ? 'red' : 'green';
}

// Check /healthz
async function checkBackend() {
  try {
    const res = await fetch(`${API}/healthz`);
    if (!res.ok) {
      throw new Error(`Status ${res.status}`);
    }
    const data = await res.json();
    if (data.ok) {
      setStatus('Backend Connected Successfully!');
    } else {
      setStatus('Backend Connection Failed: health check not ok', true);
    }
  } catch (err) {
    console.error(err);
    setStatus('Backend Connection Failed: ' + err.message, true);
  }
}

// Load /brokers and render them
async function loadBrokers() {
  const list = document.getElementById('brokers-list');
  list.innerHTML = '<li>Loading brokers...</li>';

  try {
    const res = await fetch(`${API}/brokers`);
    if (!res.ok) {
      throw new Error(`Status ${res.status}`);
    }

    const brokers = await res.json();

    if (!Array.isArray(brokers) || brokers.length === 0) {
      list.innerHTML = '<li>No brokers configured yet.</li>';
      return;
    }

    list.innerHTML = '';

    brokers.forEach((b) => {
      const li = document.createElement('li');
      li.innerHTML =
        `<strong>${b.name}</strong> (${b.region}, ${b.type})` +
        (b.website
          ? ` – <a href="${b.website}" target="_blank" rel="noopener noreferrer">Website</a>`
          : '') +
        (typeof b.api === 'boolean' ? ` – API: ${b.api ? 'Yes' : 'No'}` : '') +
        (b.notes ? `<br><small>${b.notes}</small>` : '');
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    list.innerHTML = `<li style="color:red;">Failed to load brokers: ${err.message}</li>`;
  }
}

// Run when the page finishes loading
window.addEventListener('DOMContentLoaded', () => {
  checkBackend();
  loadBrokers();
});