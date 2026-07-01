import Link from 'next/link';
import { ThemeToggle } from '../storydeck';
import { BASE } from '../site.config';

export default function Header() {
  return (
    <header className="site-hd">
      <Link className="brand" href="/">
        <img src={`${BASE}/logo-foot.png`} alt="footprintjs" width={26} height={26} />
        <span>footprint<em>js</em></span>
      </Link>
      <span className="sp" />
      <nav aria-label="Primary">
        <a href="https://footprintjs.github.io/">Home</a>
        <Link className="active" href="/" aria-current="page">Blog</Link>
        <a href="https://github.com/footprintjs">GitHub</a>
      </nav>
      <ThemeToggle />
    </header>
  );
}
