import { useState } from 'react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

export default function AuthScreen({ onAuthenticate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      onAuthenticate('Admin');
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⬡</span>
            <span style={styles.logoText}>PAGEABLE</span>
          </div>
          <p style={styles.headerSub}>Select your identity to access the catalog terminal</p>
        </div>

        <div style={styles.panels}>

          {/* LEFT: Quick Access */}
          <div style={styles.leftPanel}>
            <div style={styles.panelLabel}>QUICK ACCESS</div>
            <p style={styles.panelDesc}>Instant entry for campus users. No password required.</p>

            <div style={styles.quickBtns}>
              {[
                { role: 'Student', icon: '📖', desc: 'Read-only catalog access', color: '#4DA6FF' },
                { role: 'Librarian', icon: '🗂️', desc: 'Add & update book records', color: '#5CDB95' },
              ].map(({ role, icon, desc, color }) => (
                <button
                  key={role}
                  style={{
                    ...styles.quickBtn,
                    borderColor: hoveredBtn === role ? color : 'rgba(255,255,255,0.1)',
                    background: hoveredBtn === role ? `${color}14` : 'rgba(255,255,255,0.03)',
                  }}
                  onMouseEnter={() => setHoveredBtn(role)}
                  onMouseLeave={() => setHoveredBtn(null)}
                  onClick={() => onAuthenticate(role)}
                >
                  <span style={styles.quickBtnIcon}>{icon}</span>
                  <div style={styles.quickBtnText}>
                    <span style={{ ...styles.quickBtnRole, color }}>Sign in as {role}</span>
                    <span style={styles.quickBtnDesc}>{desc}</span>
                  </div>
                  <span style={{ ...styles.quickBtnArrow, color }}>→</span>
                </button>
              ))}
            </div>

            <div style={styles.roleBadges}>
              {[
                { label: 'Student', perms: 'Read', color: '#4DA6FF' },
                { label: 'Librarian', perms: 'Create + Update', color: '#5CDB95' },
                { label: 'Admin', perms: 'Full Access', color: '#FAC864' },
              ].map(({ label, perms, color }) => (
                <div key={label} style={styles.roleBadge}>
                  <span style={{ ...styles.roleDot, background: color }} />
                  <span style={styles.roleLabel}>{label}:</span>
                  <span style={{ ...styles.rolePerms, color }}>{perms}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.divider} />

          {/* RIGHT: Admin Gateway */}
          <div style={styles.rightPanel}>
            <div style={{ ...styles.panelLabel, color: '#FAC864' }}>ADMIN GATEWAY</div>
            <p style={styles.panelDesc}>Restricted access. Full CRUD clearance upon verification.</p>

            <form onSubmit={handleAdminLogin} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>USERNAME</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  placeholder="Enter username"
                  style={styles.input}
                  onFocus={e => e.target.style.borderColor = '#FAC864'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  autoComplete="username"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  style={styles.input}
                  onFocus={e => e.target.style.borderColor = '#FAC864'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div style={styles.errorMsg}>
                  ⚠ {error}
                </div>
              )}

              <button
                type="submit"
                style={styles.submitBtn}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#FAC864';
                  e.currentTarget.style.color = '#0a0a0a';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#FAC864';
                }}
              >
                AUTHENTICATE AS ADMIN
              </button>
            </form>

            <div style={styles.adminHint}>
              <span style={styles.hintIcon}>🔐</span>
              <span>Contact your system administrator for credentials.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"DM Mono", "Courier New", monospace',
    padding: '24px',
  },
  card: {
    background: '#111',
    border: '1px solid rgba(255,255,255,0.1)',
    width: '100%',
    maxWidth: 860,
    overflow: 'hidden',
  },
  header: {
    padding: '32px 40px 28px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(250,200,100,0.03)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  logoIcon: { fontSize: 18, color: '#FAC864' },
  logoText: { fontSize: 14, fontWeight: 700, letterSpacing: '0.25em', color: '#FAC864' },
  headerSub: { margin: 0, fontSize: 13, color: '#666', letterSpacing: '0.04em' },
  panels: { display: 'flex', minHeight: 420 },
  leftPanel: { flex: 1, padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 20 },
  rightPanel: { flex: 1, padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 20 },
  divider: { width: 1, background: 'rgba(255,255,255,0.07)', margin: '24px 0' },
  panelLabel: {
    fontSize: 10,
    letterSpacing: '0.25em',
    color: '#888',
    fontWeight: 700,
    marginBottom: -8,
  },
  panelDesc: { margin: 0, fontSize: 12, color: '#555', lineHeight: 1.6 },
  quickBtns: { display: 'flex', flexDirection: 'column', gap: 12 },
  quickBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '16px 18px',
    border: '1px solid',
    background: 'rgba(255,255,255,0.03)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  quickBtnIcon: { fontSize: 20 },
  quickBtnText: { flex: 1, display: 'flex', flexDirection: 'column', gap: 3 },
  quickBtnRole: { fontSize: 13, fontWeight: 600, fontFamily: '"DM Mono", monospace' },
  quickBtnDesc: { fontSize: 11, color: '#555' },
  quickBtnArrow: { fontSize: 16, fontWeight: 700 },
  roleBadges: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    marginTop: 'auto',
  },
  roleBadge: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 },
  roleDot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
  roleLabel: { color: '#666', minWidth: 60 },
  rolePerms: { fontWeight: 600, letterSpacing: '0.03em' },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 10, letterSpacing: '0.2em', color: '#666', fontWeight: 600 },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#e8e0d0',
    padding: '12px 14px',
    fontSize: 13,
    fontFamily: '"DM Mono", monospace',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  errorMsg: {
    fontSize: 12,
    color: '#FF6B6B',
    background: 'rgba(255,107,107,0.08)',
    border: '1px solid rgba(255,107,107,0.2)',
    padding: '10px 14px',
    letterSpacing: '0.03em',
  },
  submitBtn: {
    padding: '14px',
    fontSize: 11,
    letterSpacing: '0.15em',
    fontFamily: '"DM Mono", monospace',
    fontWeight: 700,
    background: 'transparent',
    color: '#FAC864',
    border: '1px solid #FAC864',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  adminHint: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 11,
    color: '#444',
    marginTop: 'auto',
    paddingTop: 12,
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  hintIcon: { fontSize: 14 },
};