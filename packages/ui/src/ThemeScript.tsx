// ThemeScript — sets data-theme on <html> before first paint so there's no
// flash of the wrong theme. Reads a stored preference, falling back to the
// OS setting (spec §7.1 mandates dark+light parity everywhere; the toggle
// itself lives in TopStrip via ThemeToggle).
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('amalyte-theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}
