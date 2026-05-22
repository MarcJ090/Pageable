import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LogoSrc from '../assets/logo.png';

// Logo — uses logo.png from assets if available, else text fallback
export function Logo({ size = 'md' }) {
  const [imgError, setImgError] = useState(false);
  const sizes = { sm: { icon: 50, text: 16 }, md: { icon: 50, text: 20 }, lg: { icon: 50, text: 26 } };
  const sz = sizes[size] || sizes.md;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {!imgError ? (
        <img
          src={LogoSrc}
          alt="Pageable"
          style={{ width: sz.icon, height: sz.icon, objectFit: 'contain', borderRadius: 8 }}
          onError={() => setImgError(true)}
        />
      ) : (
        <div style={{
          width: sz.icon, height: sz.icon, background: 'var(--primary)', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: sz.icon * 0.5,
        }}>
          <i className="fa-solid fa-book-open" />
        </div>
      )}
      <span style={{ fontSize: sz.text, fontFamily: 'var(--font-main)', fontWeight: 800, color: 'var(--text-primary)' }}>
        Pageable
      </span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────
export function Sidebar({ role, activePage, onNavigate }) {
  const { logout, currentUser } = useAuth();

  const navItems = {
    Admin: [
      { id: 'dashboard', icon: 'fa-solid fa-chart-pie', label: 'Dashboard' },
      { id: 'books', icon: 'fa-solid fa-book', label: 'Books' },
      { id: 'libraries', icon: 'fa-solid fa-building-columns', label: 'Libraries' },
      { id: 'users', icon: 'fa-solid fa-users', label: 'Users' },
    ],
    Librarian: [
      { id: 'dashboard', icon: 'fa-solid fa-chart-pie', label: 'Dashboard' },
      { id: 'books', icon: 'fa-solid fa-book', label: 'Books & Catalog' },
      { id: 'loans', icon: 'fa-solid fa-clock-rotate-left', label: 'Loan Requests' },
    ],
    Student: [
      { id: 'dashboard', icon: 'fa-solid fa-chart-pie', label: 'Dashboard' },
      { id: 'catalog', icon: 'fa-solid fa-magnifying-glass', label: 'Browse Books' },
      { id: 'loans', icon: 'fa-solid fa-bookmark', label: 'My Loans' },
    ],
  };

  const roleColor = { Admin: 'var(--secondary)', Librarian: 'var(--primary)', Student: 'var(--primary)' }[role];
  const items = navItems[role] || [];

  return (
    <aside style={ss.aside}>
      <div style={ss.logo}>
        <Logo size="sm" />
      </div>
      <nav style={ss.nav}>
        {items.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            style={{
              ...ss.navBtn,
              background: activePage === item.id ? 'var(--primary-muted)' : 'transparent',
              color: activePage === item.id ? 'var(--primary)' : 'var(--text-secondary)',
              borderLeft: activePage === item.id ? '3px solid var(--primary)' : '3px solid transparent',
              fontWeight: activePage === item.id ? 700 : 500,
            }}>
            <i className={item.icon} style={{ width: 18, textAlign: 'center', fontSize: 14 }} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={ss.bottom}>
        <div style={ss.userCard}>
          <div style={{ ...ss.avatar, background: roleColor }}>
            {currentUser?.name?.[0]?.toUpperCase()}
          </div>
          <div style={ss.userInfo}>
            <div style={ss.userName}>{currentUser?.name}</div>
            <div style={{ ...ss.userRole, color: roleColor }}>{role}</div>
          </div>
        </div>
        <button style={ss.logoutBtn} onClick={logout}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,101,101,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <i className="fa-solid fa-right-from-bracket" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

const ss = {
  aside: {
    width: 220, minHeight: '100vh', background: 'var(--white)', borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
    boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
  },
  logo: { padding: '22px 20px 18px', borderBottom: '1px solid var(--border-light)' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '16px 12px' },
  navBtn: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
    borderRadius: 'var(--radius-sm)', fontSize: 13.5, fontFamily: 'var(--font-main)',
    transition: 'all 0.15s', cursor: 'pointer', border: 'none', textAlign: 'left', width: '100%',
  },
  bottom: { padding: '14px 12px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 10 },
  userCard: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
    background: 'var(--bg)', borderRadius: 'var(--radius-sm)',
  },
  avatar: {
    width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700,
    fontFamily: 'var(--font-main)', flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: {
    fontSize: 13, fontFamily: 'var(--font-main)', fontWeight: 700, color: 'var(--text-primary)',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  userRole: { fontSize: 11, fontWeight: 600 },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px',
    background: 'transparent', color: 'var(--danger)', border: '1px solid rgba(245,101,101,0.3)',
    borderRadius: 'var(--radius-sm)', fontSize: 13, fontFamily: 'var(--font-main)',
    fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', width: '100%', justifyContent: 'center',
  },
};

// ─── TopBar ───────────────────────────────────────────────────
export function TopBar({ title, subtitle, action }) {
  const { currentUser } = useAuth();
  return (
    <div style={ts.bar}>
      <div>
        <h1 style={ts.title}>{title}</h1>
        {subtitle && <p style={ts.subtitle}>{subtitle}</p>}
      </div>
      <div style={ts.right}>
        {action}
        <div style={ts.chip}>
          <span style={ts.chipName}>{currentUser?.name}</span>
          <div style={ts.chipAvatar}>{currentUser?.name?.[0]?.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}
const ts = {
  bar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 24, fontFamily: 'var(--font-main)', fontWeight: 800, color: 'var(--text-primary)' },
  subtitle: { fontSize: 13, color: 'var(--text-muted)', marginTop: 2 },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  chip: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 14px',
    background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 50, boxShadow: 'var(--shadow-sm)',
  },
  chipName: { fontSize: 13, fontFamily: 'var(--font-main)', fontWeight: 600, color: 'var(--text-secondary)' },
  chipAvatar: {
    width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
  },
};

// ─── StatCard ─────────────────────────────────────────────────
export function StatCard({ icon, label, value, color = 'var(--primary)', trend }) {
  return (
    <div style={stc.card} className="scale-in">
      <div style={{ ...stc.iconBox, background: `${color}18`, color }}>
        <i className={icon} style={{ fontSize: 20 }} />
      </div>
      <div style={stc.info}>
        <div style={stc.value}>{value}</div>
        <div style={stc.label}>{label}</div>
      </div>
      {trend !== undefined && (
        <div style={{ ...stc.trend, color: trend >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          <i className={trend >= 0 ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down'} /> {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
const stc = {
  card: {
    background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)',
  },
  iconBox: { width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  info: { flex: 1 },
  value: { fontSize: 26, fontFamily: 'var(--font-main)', fontWeight: 800, color: 'var(--text-primary)' },
  label: { fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 },
  trend: { fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-main)', display: 'flex', alignItems: 'center', gap: 4 },
};

// ─── PrimaryBtn ───────────────────────────────────────────────
export function PrimaryBtn({ children, onClick, type = 'button', disabled, variant = 'primary', style: extra }) {
  const colors = {
    primary: { bg: 'var(--primary)', hover: 'var(--primary-dark)', text: 'white' },
    secondary: { bg: 'var(--secondary)', hover: 'var(--secondary-dark)', text: 'white' },
    outline: { bg: 'transparent', hover: 'var(--primary-muted)', text: 'var(--primary)', border: '1.5px solid var(--primary)' },
    danger: { bg: 'var(--danger)', hover: '#e53e3e', text: 'white' },
    success: { bg: 'var(--success)', hover: '#38a169', text: 'white' },
  };
  const c = colors[variant] || colors.primary;
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ padding: '10px 22px', background: c.bg, color: c.text, border: c.border || 'none',
        borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-main)',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, transition: 'all 0.15s',
        display: 'inline-flex', alignItems: 'center', gap: 8, ...extra }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = c.hover; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = c.bg; }}>
      {children}
    </button>
  );
}

// ─── FormInput ────────────────────────────────────────────────
export function FormInput({ label, type = 'text', value, onChange, placeholder, icon, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-main)' }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, background: 'var(--white)',
        border: `1.5px solid ${focused ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)', padding: '0 14px', transition: 'all 0.2s',
        boxShadow: focused ? '0 0 0 3px var(--primary-muted)' : 'none',
      }}>
        {icon && <i className={icon} style={{ color: 'var(--text-muted)', fontSize: 14, flexShrink: 0 }} />}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, border: 'none', background: 'transparent', padding: '11px 0',
            fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }} />
      </div>
    </div>
  );
}

// ─── DashboardLayout ──────────────────────────────────────────
export function DashboardLayout({ role, activePage, onNavigate, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar role={role} activePage={activePage} onNavigate={onNavigate} />
      <main style={{ flex: 1, marginLeft: 220, padding: '32px 36px', animation: 'fadeIn 0.4s ease' }}>
        {children}
      </main>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────
export function Badge({ children, color = 'primary' }) {
  const colors = {
    primary: { bg: 'var(--primary-muted)', text: 'var(--primary-dark)' },
    secondary: { bg: 'var(--secondary-muted)', text: 'var(--secondary-dark)' },
    success: { bg: 'rgba(72,187,120,0.15)', text: '#276749' },
    danger: { bg: 'rgba(245,101,101,0.15)', text: '#c53030' },
    warning: { bg: 'rgba(237,137,54,0.15)', text: '#c05621' },
    muted: { bg: 'var(--border-light)', text: 'var(--text-muted)' },
  };
  const c = colors[color] || colors.primary;
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-main)', background: c.bg, color: c.text }}>
      {children}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}
      onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 480,
        margin: 20, boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()} className="scale-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 18, fontFamily: 'var(--font-main)', fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 16,
            color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

// ─── DonutChart ───────────────────────────────────────────────
export function DonutChart({ pct, color, label }) {
  const r = 36, circ = 2 * Math.PI * r;
  const dash = Math.min(pct / 100, 1) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
            transform="rotate(-90 45 45)" style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
        <span style={{ position: 'absolute', fontSize: 15, fontFamily: 'var(--font-main)', fontWeight: 900, color: 'var(--text-primary)' }}>
          +{pct}%
        </span>
      </div>
      <span style={{ fontSize: 12, fontFamily: 'var(--font-main)', fontWeight: 700, color }}>{label}</span>
    </div>
  );
}

// ─── Table helpers ────────────────────────────────────────────
export const TH = ({ children }) => (
  <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontFamily: 'var(--font-main)',
    fontWeight: 700, color: 'var(--text-muted)', borderBottom: '2px solid var(--border)',
    textTransform: 'uppercase', letterSpacing: '0.05em' }}>
    {children}
  </th>
);
export const TD = ({ children, style }) => (
  <td style={{ padding: '12px 14px', fontSize: 14, color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border-light)', ...style }}>
    {children}
  </td>
);