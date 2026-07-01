import './globals.css';
import { scopeDeckCss } from '../storydeck';
import deckData from '../content/deck-data.json';
import Header from '../components/Header';
import Footer from '../components/Footer';

const scopedDeckCss = scopeDeckCss(deckData.deckCss);

export const metadata = {
  metadataBase: new URL('https://footprintjs.github.io'),
  title: { default: 'footprintjs — Blog', template: '%s · footprintjs' },
  description: 'Primers and field notes on the flowchart pattern — the self-explaining stack.',
  icons: { icon: '/favicon-32x32.png' },
};

// Set the theme before first paint so there's no flash: stored choice, else prefers-color-scheme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* deck brand tokens + keyframes, scoped to .deck-scope (slide figures + watch deck) */}
        <style dangerouslySetInnerHTML={{ __html: scopedDeckCss }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
