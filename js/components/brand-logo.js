/**
 * REA Music - Reusable BrandLogo Component
 * Centralized brand icon & title rendering for consistent, high-DPI branding.
 */

export function createBrandLogo({
  size = 32,
  showText = true,
  href = '#home',
  className = '',
  id = ''
} = {}) {
  const container = document.createElement(href ? 'a' : 'div');
  if (href) {
    container.href = href;
    container.setAttribute('aria-label', 'REA Music home');
  }
  container.className = `brand ${className}`.trim();
  if (id) container.id = id;

  const img = document.createElement('img');
  img.src = '/branding/rea-music-logo.png';
  img.alt = 'REA Music';
  img.width = size;
  img.height = size;
  img.className = 'brand-logo-img';
  img.loading = 'eager';
  img.decoding = 'async';
  img.onerror = () => {
    img.onerror = null;
    img.src = '/assets/logo.jpg';
  };

  container.appendChild(img);

  if (showText) {
    const textSpan = document.createElement('span');
    textSpan.className = 'brand-name';
    textSpan.innerHTML = 'REA<span class="brand-accent">Music</span>';
    container.appendChild(textSpan);

    const badgeFree = document.createElement('span');
    badgeFree.className = 'badge-free';
    badgeFree.textContent = 'FREE';
    container.appendChild(badgeFree);
  }

  return container;
}

export function renderBrandLogo(targetElement, options = {}) {
  if (!targetElement) return null;
  const brandElem = createBrandLogo(options);
  targetElement.replaceWith(brandElem);
  return brandElem;
}

if (typeof window !== 'undefined') {
  window.BrandLogo = {
    createBrandLogo,
    renderBrandLogo
  };
}

export default {
  createBrandLogo,
  renderBrandLogo
};
