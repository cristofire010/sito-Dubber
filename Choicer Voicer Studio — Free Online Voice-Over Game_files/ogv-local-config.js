const ogvPlayerScript = Array.from(document.scripts).find(script => script.src.endsWith('/ogv/dist/ogv.js'));
if (window.OGVLoader && ogvPlayerScript) {
  const localOgvBase = new URL('.', ogvPlayerScript.src).href.replace(/\/$/, '');
  Object.defineProperty(window.OGVLoader, 'base', {
    configurable: true,
    get() {
      return localOgvBase;
    },
    set() {}
  });
}
