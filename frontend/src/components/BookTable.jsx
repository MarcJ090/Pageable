import { useState } from 'react';
import { Badge, SearchBar, PrimaryBtn, Modal, FormInput } from './UI';

export function BooksTable({ books, onToggle, onDelete, onAdd, role }) {
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const canModify = role === 'Librarian' || role === 'Admin';
  const canDelete = role === 'Admin';
  const canAdd = role === 'Librarian' || role === 'Admin';

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!title || !author) return;
    await onAdd({ title, author });
    setTitle(''); setAuthor(''); setAddModal(false);
  };

  return (
    <div style={s.card}>
      <div style={s.toolbar}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title or author..." />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={s.count}>
            <i className="fa-solid fa-layer-group" style={{ marginRight: 5, color: 'var(--primary)' }} />
            {filtered.length} book{filtered.length !== 1 ? 's' : ''}
          </span>
          {canAdd && (
            <PrimaryBtn variant="primary" onClick={() => setAddModal(true)} style={{ borderRadius: 6, padding: '8px 16px', fontSize: 13 }}>
              <i className="fa-solid fa-plus" /> Add Book
            </PrimaryBtn>
          )}
        </div>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            {['#', 'Title', 'Author', 'Status', 'Actions'].map(h => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ ...s.td, textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
                <i className="fa-solid fa-box-open" style={{ fontSize: 28, display: 'block', marginBottom: 10, opacity: 0.4 }} />
                No books found.
              </td>
            </tr>
          ) : filtered.map((b, i) => (
            <tr key={b.id} style={s.tr}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ ...s.td, color: 'var(--text-muted)', width: 44 }}>{i + 1}</td>
              <td style={s.td}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}>{b.title}</div>
              </td>
              <td style={{ ...s.td, color: 'var(--text-secondary)' }}>{b.author}</td>
              <td style={s.td}>
                <button onClick={() => canModify && onToggle(b.id)} title={canModify ? 'Click to toggle' : undefined}
                  style={{
                    ...s.statusBtn,
                    background: b.status === 'Available' ? 'rgba(72,187,120,0.12)' : 'rgba(245,101,101,0.12)',
                    color: b.status === 'Available' ? '#276749' : '#c53030',
                    border: `1px solid ${b.status === 'Available' ? 'rgba(72,187,120,0.3)' : 'rgba(245,101,101,0.3)'}`,
                    cursor: canModify ? 'pointer' : 'default',
                  }}
                >
                  <i className={b.status === 'Available' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'}
                    style={{ fontSize: 11 }} />
                  {b.status}
                  {canModify && <i className="fa-solid fa-arrows-rotate" style={{ fontSize: 10, marginLeft: 4, opacity: 0.6 }} />}
                </button>
              </td>
              <td style={s.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {canModify && (
                    <button style={s.iconBtn} onClick={() => onToggle(b.id)} title="Toggle status">
                      <i className="fa-solid fa-arrows-rotate" style={{ color: 'var(--primary)' }} />
                    </button>
                  )}
                  {canDelete && (
                    <button style={{ ...s.iconBtn, background: 'rgba(245,101,101,0.1)', border: '1px solid rgba(245,101,101,0.3)' }}
                      onClick={() => onDelete(b.id)} title="Delete">
                      <i className="fa-solid fa-trash" style={{ color: 'var(--danger)' }} />
                    </button>
                  )}
                  {!canModify && !canDelete && (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      <i className="fa-solid fa-eye" /> View only
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New Book">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormInput label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Book title" icon="fa-solid fa-book" required />
          <FormInput label="Author" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name" icon="fa-solid fa-pen-nib" required />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <PrimaryBtn variant="ghost" onClick={() => setAddModal(false)}>Cancel</PrimaryBtn>
            <PrimaryBtn variant="primary" onClick={handleAdd} disabled={!title || !author}>
              <i className="fa-solid fa-plus" /> Add Book
            </PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const s = {
  card: {
    background: 'var(--white)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
  },
  toolbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid var(--border-light)',
  },
  count: { fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-main)', fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '11px 16px', fontSize: 11,
    fontFamily: 'var(--font-main)', fontWeight: 700, color: 'var(--text-muted)',
    borderBottom: '2px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: 'var(--bg)',
  },
  tr: { transition: 'background 0.1s' },
  td: { padding: '13px 16px', fontSize: 14, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)' },
  statusBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
    borderRadius: 20, fontSize: 12, fontFamily: 'var(--font-main)', fontWeight: 600,
    transition: 'opacity 0.15s',
  },
  iconBtn: {
    width: 32, height: 32, background: 'var(--primary-muted)',
    border: '1px solid rgba(86,180,230,0.3)', borderRadius: 6,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
  },
};