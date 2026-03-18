/**
 * UI: messaggi di stato
 */

/**
 * @param {HTMLElement} el
 * @param {string} message
 * @param {'loading'|'error'|'success'|''} type
 */
export function setStatus(el, message, type = '') {
  if (!el) return;
  el.textContent = message;
  el.className = 'status' + (type ? ` ${type}` : '');
}
