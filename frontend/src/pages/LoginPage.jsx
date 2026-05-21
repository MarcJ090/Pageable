import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FormInput, PrimaryBtn, Logo } from '../components/UI';

export default function LoginPage({ onNavigateRegister, onBackHome }) {
  const { login, authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { login({ email, password }); setLoading(false); }, 400);
  };

  return (
    <div style={s.root}>
      {/* Back to home */}
      <button style={s.backBtn} onClick={onBackHome}>
        <i className="fa-solid fa-arrow-left" /> Home
      </button>

      <div style={s.card} className="scale-in">
        {/* Avatar */}
        <div style={s.avatarWrap}>
          <div style={s.avatarCircle}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="19" r="10" fill="white" fillOpacity="0.92" />
              <ellipse cx="24" cy="41" rx="16" ry="11" fill="white" fillOpacity="0.72" />
            </svg>
          </div>
        </div>

        <h2 style={s.title}>Welcome Back</h2>
        <p style={s.sub}>Sign in to your account</p>

        {authError && (
          <div style={s.error}>
            <i className="fa-solid fa-triangle-exclamation" /> {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={s.form}>
          <FormInput
            label="Email Address"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); clearError(); }}
            placeholder="you@university.edu"
            icon="fa-regular fa-envelope"
            required
          />
          <FormInput
            label="Password"
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); clearError(); }}
            placeholder="Enter your password"
            icon="fa-solid fa-lock"
            required
          />
          <PrimaryBtn type="submit" disabled={loading} variant="primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15,
              borderRadius: 'var(--radius-sm)', marginTop: 4, letterSpacing: '0.04em' }}>
            {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Signing in...</> : 'LOGIN'}
          </PrimaryBtn>
        </form>

        <p style={s.switchText}>
          Don't have an account yet?{' '}
          <button style={s.switchLink} onClick={onNavigateRegister}>sign up now</button>
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
    background: 'var(--white)', borderRadius: 'var(--radius-lg)',
    padding: '44px 40px 36px', width: '100%', maxWidth: 440,
    boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
  },
  avatarWrap: { display: 'flex', justifyContent: 'center', marginBottom: 22 },
  avatarCircle: {
    width: 84, height: 84, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 28px rgba(86,180,230,0.38)',
  },
  title: { textAlign: 'center', fontSize: 26, fontFamily: 'var(--font-main)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 },
  sub: { textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginBottom: 26 },
  error: {
    background: 'rgba(245,101,101,0.08)', border: '1px solid rgba(245,101,101,0.25)',
    color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
    fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  switchText: { textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 22, fontStyle: 'italic' },
  switchLink: { background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 13, textDecoration: 'underline', fontStyle: 'italic' },
};