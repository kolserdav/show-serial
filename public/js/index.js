// @ts-check

const COOKIE_NAME = 'lastWatchSeriesNum';

/**
 * Save last series and
 * add link to home page
 * @returns {1 | 0}
 */
function saveSeries() {
  const { pathname } = window.location;
  const pathNum = parseInt(pathname.replace('/', ''), 10);
  if (window.location.pathname === '/') {
    const lastSeries = window.localStorage.getItem(COOKIE_NAME);
    if (!lastSeries) {
      return 1;
    }
    const home = document.querySelector('#home');
    if (!home) {
      console.warn('Home component is missing', 13);
      return 1;
    }
    const a = document.createElement('a');
    a.innerText = 'Current series';
    a.href = lastSeries;
    a.setAttribute('style', 'margin-top: 1rem;');
    home.appendChild(a);
  } else if (!Number.isNaN(pathNum)) {
    window.localStorage.setItem(COOKIE_NAME, pathname);
  }
  return 0;
}

window.onload = () => {
  saveSeries();
};
