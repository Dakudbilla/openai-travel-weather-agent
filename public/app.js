const form = document.getElementById('search-form');
const input = document.getElementById('city-input');
const button = document.getElementById('search-button');
const result = document.getElementById('result');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const city = input.value.trim();
  if (!city) return;

  setLoading(true);
  result.innerHTML =
    '<div class="loader"><span class="spinner"></span> Asking the guide about ' +
    escapeHtml(city) +
    '…</div>';

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Request failed.');
    }

    result.innerHTML =
      '<h2>' + escapeHtml(data.city) + '</h2>' + renderMarkdown(data.answer);
  } catch (err) {
    result.innerHTML = '<p class="error">⚠ ' + escapeHtml(err.message) + '</p>';
  } finally {
    setLoading(false);
  }
});

function setLoading(loading) {
  button.disabled = loading;
  input.disabled = loading;
  button.textContent = loading ? '…' : 'Go';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Minimal markdown → HTML for the subset the agent produces:
 * ### headers, **bold**, and paragraph breaks. Input is escaped first.
 */
function renderMarkdown(text) {
  const escaped = escapeHtml(text);
  return escaped
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';

      const heading = trimmed.match(/^#{1,6}\s+(.*)$/);
      if (heading) {
        return '<h3>' + inline(heading[1]) + '</h3>';
      }

      return '<p>' + inline(trimmed).replace(/\n/g, '<br />') + '</p>';
    })
    .join('');
}

function inline(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
