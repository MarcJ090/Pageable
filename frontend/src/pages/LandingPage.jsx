import { Logo, PrimaryBtn } from '../components/UI';

export default function LandingPage({ onGetStarted, onLogin }) {
  return (
    <div style={s.root}>
      {/* Navbar */}
      <nav style={s.nav}>
        <Logo size="md" />
        <div style={s.navLinks}>
          {['Home', 'About', 'Contact'].map(l => (
            <a key={l} href="#" style={s.navLink}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <PrimaryBtn onClick={onLogin} variant="outline" style={{ borderRadius: 50, padding: '8px 22px', fontSize: 13 }}>
            <i className="fa-solid fa-right-to-bracket" /> Login
          </PrimaryBtn>
          <PrimaryBtn onClick={onGetStarted} variant="secondary" style={{ borderRadius: 50, padding: '8px 22px', fontSize: 13 }}>
            <i className="fa-solid fa-user-plus" /> Sign Up
          </PrimaryBtn>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroContent} className="fade-in">
          <div style={s.heroTag}>
            <i className="fa-solid fa-building-columns" style={{ marginRight: 6 }} />
            CAMPUS LIBRARY SYSTEM
          </div>
          <h1 style={s.heroTitle}>
            Your Digital<br />
            <span style={s.heroAccent}>Campus Archive</span>
          </h1>
          <p style={s.heroText}>
            A unified catalog terminal for students, librarians, and administrators.
            Track, manage, and circulate the knowledge that powers your institution.
          </p>
          <div style={s.heroBtns}>
            <PrimaryBtn onClick={onGetStarted} variant="secondary" style={{ padding: '13px 32px', borderRadius: 50, fontSize: 15 }}>
              <i className="fa-solid fa-rocket" /> Get Started
            </PrimaryBtn>
            <PrimaryBtn onClick={onLogin} variant="outline" style={{ padding: '13px 32px', borderRadius: 50, fontSize: 15 }}>
              <i className="fa-solid fa-right-to-bracket" /> Sign In
            </PrimaryBtn>
          </div>
        </div>

        {/* Visual card */}
        <div style={s.heroVisual} className="fade-in">
          <div style={s.blob1} /><div style={s.blob2} />
          <div style={s.heroCard}>
            <div style={s.heroCardInner}>
              <div style={s.bookShelf}>
                {['#ffffff50','#ffffff70','#ffffff90','#ffffffb0','#ffffff70'].map((c,i) => (
                  <div key={i} style={{ ...s.bookSpine, background: c, height: `${80+(i%3)*28}px` }} />
                ))}
              </div>
              <div style={s.heroStats}>
                {[['2,400+','Books'],['340','Members'],['12','Libraries']].map(([v,l],i) => (
                  <div key={l} style={{ flex:1, textAlign:'center' }}>
                    <span style={s.heroStatVal}>{v}</span>
                    <span style={s.heroStatLabel}>{l}</span>
                    {i < 2 && <div style={s.heroDivider} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={s.features}>
        {[
          { icon: 'fa-solid fa-book-open', title: 'Smart Catalog', desc: 'Browse thousands of books with powerful search and filtering.' },
          { icon: 'fa-solid fa-shield-halved', title: 'Role-Based Access', desc: 'Students, librarians and admins each get a tailored experience.' },
          { icon: 'fa-solid fa-bolt', title: 'Real-Time Updates', desc: 'Book availability and loan status updated instantly.' },
        ].map((f, i) => (
          <div key={i} style={s.featureCard}>
            <div style={s.featureIcon}>
              <i className={f.icon} style={{ color: 'var(--primary)', fontSize: 26 }} />
            </div>
            <h3 style={s.featureTitle}>{f.title}</h3>
            <p style={s.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      <footer style={s.footer}>
        <Logo size="sm" />
        <span style={s.footerText}>© 2025 Pageable — Campus Library System</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <PrimaryBtn onClick={onLogin} variant="outline" style={{ borderRadius: 50, padding: '7px 18px', fontSize: 12 }}>Login</PrimaryBtn>
          <PrimaryBtn onClick={onGetStarted} variant="primary" style={{ borderRadius: 50, padding: '7px 18px', fontSize: 12 }}>Sign Up</PrimaryBtn>
        </div>
      </footer>
    </div>
  );
}

const s = {
  root: { minHeight: '100vh', background: 'var(--white)', display: 'flex', flexDirection: 'column', overflowX: 'hidden' },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 60px',
    borderBottom: '1px solid var(--border)', background: 'var(--white)',
    position: 'sticky', top: 0, zIndex: 50, boxShadow: 'var(--shadow-sm)',
  },
  navLinks: { display: 'flex', gap: 36 },
  navLink: { fontSize: 14, fontFamily: 'var(--font-main)', fontWeight: 600, color: 'var(--text-secondary)', transition: 'color 0.15s' },
  hero: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '70px 60px', gap: 40, minHeight: '80vh',
  },
  heroContent: { flex: 1, maxWidth: 520 },
  heroTag: {
    display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
    color: 'var(--primary)', background: 'var(--primary-muted)', padding: '5px 14px',
    borderRadius: 50, marginBottom: 22,
  },
  heroTitle: { fontSize: 'clamp(36px,5vw,64px)', fontFamily: 'var(--font-main)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 20 },
  heroAccent: { color: 'var(--secondary)' },
  heroText: { fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 36, maxWidth: 450 },
  heroBtns: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  heroVisual: { flex: 1, maxWidth: 460, position: 'relative', display: 'flex', justifyContent: 'center' },
  blob1: { position:'absolute', width:200, height:200, borderRadius:'50%', background:'var(--secondary-muted)', top:-40, right:-20, zIndex:1 },
  blob2: { position:'absolute', width:140, height:140, borderRadius:'50%', background:'var(--primary-muted)', bottom:-20, left:-10, zIndex:1 },
  heroCard: {
    background: 'linear-gradient(135deg, var(--primary) 0%, #3a9fd4 100%)',
    borderRadius: 'var(--radius-lg)', padding: 36, boxShadow: '0 20px 60px rgba(86,180,230,0.35)',
    position: 'relative', zIndex: 2, width: '100%', maxWidth: 380,
  },
  heroCardInner: { background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius)', padding: 28 },
  bookShelf: { display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 28, justifyContent: 'center' },
  bookSpine: { width: 26, borderRadius: '4px 4px 2px 2px' },
  heroStats: { display: 'flex', alignItems: 'center' },
  heroStatVal: { display: 'block', fontSize: 20, fontFamily: 'var(--font-main)', fontWeight: 900, color: 'white' },
  heroStatLabel: { display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  heroDivider: { position:'absolute', width:1, height:40, background:'rgba(255,255,255,0.25)' },
  features: {
    display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, padding: '0 60px 60px',
  },
  featureCard: { background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '28px 24px', border: '1px solid var(--border)' },
  featureIcon: { marginBottom: 14 },
  featureTitle: { fontSize: 17, fontFamily: 'var(--font-main)', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' },
  featureDesc: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 60px', borderTop: '1px solid var(--border)', background: 'var(--white)',
  },
  footerText: { fontSize: 13, color: 'var(--text-muted)' },
};