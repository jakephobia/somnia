/**
 * API per estrazione audio da YouTube
 */

const EXTRACT_ENDPOINT = '/api/extract';

/**
 * Estrae audio da URL YouTube
 * @param {string} url - URL YouTube
 * @returns {Promise<{audioUrl: string}>}
 */
export async function extractAudio(url) {
  const res = await fetch(EXTRACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: url.trim() }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Errore durante l\'estrazione');
  }

  return data;
}
