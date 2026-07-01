import './globals.css';
import { StoryDeckProvider } from '../storydeck';
import { BASE, SITE } from '../site.config';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'footprintjs — Blog', template: '%s · footprintjs' },
  description: 'Primers and field notes on the flowchart pattern — the self-explaining stack.',
  icons: { icon: `${BASE}/favicon-32x32.png` },
};

// Set the theme before first paint so there's no flash. DARK is the default; a stored choice or
// an explicit switch to light overrides it.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light')t='dark';document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('dark');}})();`;

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
      </head>
      <body>
        <StoryDeckProvider basePath={BASE}>
          <a className="skip-link" href="#main">Skip to content</a>
          <Header />
          {children}
          <Footer />
        </StoryDeckProvider>
      </body>
    </html>
  );
}
