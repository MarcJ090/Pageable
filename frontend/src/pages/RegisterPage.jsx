import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FormInput, PrimaryBtn } from '../components/UI';

export default function RegisterPage({ onNavigateLogin, onBackHome }) {
  const { register, authError, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) return;
    setLoading(true);
    setTimeout(() => { register({ name, email, password, role }); setLoading(false); }, 400);
  };

  return (
    <div style={s.root}>
      <button style={s.backBtn} onClick={onBackHome}>
        <i className="fa-solid fa-arrow-left" /> Home
      </button>

      <div style={s.card} className="scale-in">
        <div style={s.avatarWrap}>
          <div style={s.avatarCircle}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="19" r="10" fill="white" fillOpacity="0.92" />
              <ellipse cx="24" cy="41" rx="16" ry="11" fill="white" fillOpacity="0.72" />
            </svg>
          </div>
        </div>

        <h2 style={s.title}>Create Account</h2>
        <p style={s.sub}>Fill in the details below to get started</p>

        {authError && (
          <div style={s.error}>
            <i className="fa-solid fa-triangle-exclamation" /> {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={s.form}>
          <FormInput label="Full Name" value={name}
            onChange={e => { setName(e.target.value); clearError(); }}
            placeholder="Your full name" icon="fa-solid fa-user" required />

          <FormInput label="Email Address" type="email" value={email}
            onChange={e => { setEmail(e.target.value); clearError(); }}
            placeholder="you@university.edu" icon="fa-regular fa-envelope" required />

          <FormInput label="Password (min. 6 characters)" type="password" value={password}
            onChange={e => { setPassword(e.target.value); clearError(); }}
            placeholder="Create a strong password" icon="fa-solid fa-lock" required />

          {/* Role selector */}
          <div style={s.roleGroup}>
            <label style={s.roleLabel}>I am a...</label>
            <div style={s.rolePicker}>
              {[
                { value: 'Student', icon: '🎓', desc: 'Browse & borrow' },
                { value: 'Librarian', icon: '📋', desc: 'Manage catalog' },
              ].map(({ value, icon, desc }) => (
                <button key={value} type="button" onClick={() => setRole(value)}
                  style={{
                    ...s.roleOption,
                    borderColor: role === value ? 'var(--primary)' : 'var(--border)',
                    background: role === value ? 'var(--primary-muted)' : 'var(--white)',
                    boxShadow: role === value ? '0 0 0 3px var(--primary-muted)' : 'none',
                  }}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontFamily: 'var(--font-main)', fontWeight: 700,
                      color: role === value ? 'var(--primary-dark)' : 'var(--text-primary)' }}>{value}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{desc}</div>
                  </div>
                  {role === value && <i className="fa-solid fa-check" style={{ color: 'var(--primary)', fontSize: 13 }} />}
                </button>
              ))}
            </div>
          </div>

          <PrimaryBtn type="submit" disabled={loading || password.length < 6} variant="secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15,
              borderRadius: 'var(--radius-sm)', marginTop: 4, letterSpacing: '0.04em',
              opacity: password.length < 6 ? 0.5 : 1 }}>
            {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Creating...</> : 'CREATE ACCOUNT'}
          </PrimaryBtn>
        </form>

        <p style={s.switchText}>
          Already have an account?{' '}
          <button style={s.switchLink} onClick={onNavigateLogin}>sign in now</button>
        </p>
      </div>
    </div>
  );
}

const s = {
  root: {
    minHeight: '100vh', background: 'var(--bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-body)', position: 'relative', padding: 20,
  },
  backBtn: {
    position: 'absolute', top: 24, left: 28,
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--white)', border: '1px solid var(--border)',
    borderRadius: 50, padding: '8px 18px', fontSize: 13,
    fontFamily: 'var(--font-main)', fontWeight: 600, color: 'var(--text-secondary)',
    cursor: 'pointer', boxShadow: 'var(--shadow-sm)', transition: 'all 0.15s',
  },
  card: {
    background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '40px 40px 32px',
    width: '100%', maxWidth: 460, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
  },
  avatarWrap: { display: 'flex', justifyContent: 'center', marginBottom: 20 },
  avatarCircle: {
    width: 84, height: 84, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 28px rgba(230,136,86,0.38)',
  },
  title: { textAlign: 'center', fontSize: 24, fontFamily: 'var(--font-main)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 },
  sub: { textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 },
  error: {
    background: 'rgba(245,101,101,0.08)', border: '1px solid rgba(245,101,101,0.25)',
    color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
    fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  roleGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
  roleLabel: { fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-main)' },
  rolePicker: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  roleOption: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
    border: '2px solid', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
    transition: 'all 0.2s', background: 'var(--white)',
  },
  switchText: { textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 20, fontStyle: 'italic' },
  switchLink: { background: 'none', border: 'none', color: 'var(--secondary)', fontWeight: 700, cursor: 'pointer', fontSize: 13, textDecoration: 'underline', fontStyle: 'italic' },
};