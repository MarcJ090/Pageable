import { useState } from 'react';

export default function BookForm({ onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    setLoading(true);
    await onAddBook({ title: title.trim(), author: author.trim() });
    setTitle('');
    setAuthor('');
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.icon}>＋</span>
        <div>
          <div style={styles.title}>ADD NEW ASSET</div>
          <div style={styles.sub}>Append a new textbook to the catalog</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.fields}>
          <div style={styles.field}>
            <label style={styles.label}>TITLE</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Introduction to Algorithms"
              style={styles.input}
              onFocus={e => e.target.style.borderColor = '#5CDB95'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>AUTHOR</label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="e.g. Thomas H. Cormen"
              style={styles.input}
              onFocus={e => e.target.style.borderColor = '#5CDB95'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !title.trim() || !author.trim()}
            style={{
              ...styles.submitBtn,
              opacity: loading || !title.trim() || !author.trim() ? 0.4 : 1,
              cursor: loading || !title.trim() || !author.trim() ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => {
              if (!loading && title.trim() && author.trim()) {
                e.currentTarget.style.background = '#5CDB95';
                e.currentTarget.style.color = '#0a0a0a';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#5CDB95';
            }}
          >
            {loading ? 'ADDING...' : 'COMMIT TO CATALOG →'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    background: '#111',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '24px 28px',
    fontFamily: '"DM Mono", "Courier New", monospace',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 22,
    paddingBottom: 18,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  icon: {
    width: 36,
    height: 36,
    background: 'rgba(92,219,149,0.1)',
    border: '1px solid rgba(92,219,149,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: '#5CDB95',
    flexShrink: 0,
  },
  title: { fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#5CDB95' },
  sub: { fontSize: 11, color: '#555', marginTop: 2 },
  form: {},
  fields: { display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' },
  field: { flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 10, letterSpacing: '0.2em', color: '#666', fontWeight: 600 },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#e8e0d0',
    padding: '11px 14px',
    fontSize: 13,
    fontFamily: '"DM Mono", monospace',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  submitBtn: {
    padding: '11px 22px',
    fontSize: 10,
    letterSpacing: '0.15em',
    fontFamily: '"DM Mono", monospace',
    fontWeight: 700,
    background: 'transparent',
    color: '#5CDB95',
    border: '1px solid #5CDB95',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    height: 42,
    alignSelf: 'flex-end',
  },
};