import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout, TopBar, StatCard, PrimaryBtn, Badge, Modal, FormInput, DonutChart, TH, TD } from '../components/UI';

const INITIAL_LIBRARIES = [
  { id: 1, name: 'Test Library', address: 'Test address', city: 'Istanbul' },
  { id: 2, name: 'Library 2', address: 'Address 2 as', city: 'Af' },
  { id: 3, name: 'Deneme 3', address: 'deneme sokak / 2, No:20', city: 'Izmir' },
];

export default function AdminDashboard({ books, onAddBook, onToggleStatus, onDeleteBook }) {
  const [page, setPage] = useState('dashboard');
  const [libraries, setLibraries] = useState(INITIAL_LIBRARIES);
  const [libModal, setLibModal] = useState(false);
  const [editLib, setEditLib] = useState(null);
  const [libForm, setLibForm] = useState({ name: '', address: '', city: '' });
  const [search, setSearch] = useState('');
  const { getAllUsers, totalUsers, getAllLoans } = useAuth();

  const users = getAllUsers();
  const students = users.filter(u => u.role === 'Student').length;
  const librarians = users.filter(u => u.role === 'Librarian').length;
  const available = books.filter(b => b.status === 'Available').length;
  const checkedOut = books.filter(b => b.status === 'Checked Out').length;
  const studentPct = totalUsers ? Math.round((students / totalUsers) * 100) : 0;
  const librarianPct = totalUsers ? Math.round((librarians / totalUsers) * 100) : 0;
  const availPct = books.length ? Math.round((available / books.length) * 100) : 0;

  const openCreateLib = () => { setEditLib(null); setLibForm({ name: '', address: '', city: '' }); setLibModal(true); };
  const openEditLib = (lib) => { setEditLib(lib); setLibForm({ name: lib.name, address: lib.address, city: lib.city }); setLibModal(true); };
  const saveLib = () => {
    if (!libForm.name.trim()) return;
    if (editLib) setLibraries(prev => prev.map(l => l.id === editLib.id ? { ...l, ...libForm } : l));
    else setLibraries(prev => [...prev, { id: Date.now(), ...libForm }]);
    setLibModal(false);
  };

  return (
    <DashboardLayout role="Admin" activePage={page} onNavigate={setPage}>

      {/* DASHBOARD */}
      {page === 'dashboard' && (
        <div className="fade-in">
          <TopBar title="Dashboard" subtitle="Administrator overview" />
          <div style={s.statsGrid}>
            <StatCard icon="fa-solid fa-book" label="Total Books" value={books.length} color="var(--primary)" trend={12} />
            <StatCard icon="fa-solid fa-circle-check" label="Available" value={available} color="var(--success)" />
            <StatCard icon="fa-solid fa-users" label="Registered Users" value={totalUsers} color="var(--secondary)" trend={5} />
            <StatCard icon="fa-solid fa-building-columns" label="Libraries" value={libraries.length} color="#9b59b6" />
          </div>

          {/* User stats with donuts */}
          <div style={s.twoCol}>
            <div style={s.card}>
              <h3 style={s.cardTitle}><i className="fa-solid fa-chart-pie" style={s.titleIcon} /> User Statistics</h3>
              <div style={s.donutRow}>
                <DonutChart pct={studentPct} color="var(--primary)" label={`Students (${students})`} />
                <DonutChart pct={librarianPct} color="var(--secondary)" label={`Librarians (${librarians})`} />
                <DonutChart pct={availPct} color="var(--success)" label={`Books Available`} />
              </div>
              <div style={s.breakdownList}>
                {[
                  { label: 'Students', count: students, color: 'var(--primary)', icon: 'fa-solid fa-graduation-cap' },
                  { label: 'Librarians', count: librarians, color: 'var(--secondary)', icon: 'fa-solid fa-id-badge' },
                ].map(({ label, count, color, icon }) => (
                  <div key={label} style={s.breakRow}>
                    <i className={icon} style={{ color, width: 16 }} />
                    <span style={s.breakLabel}>{label}</span>
                    <div style={s.breakBar}>
                      <div style={{ ...s.breakFill, width: `${totalUsers ? (count/totalUsers)*100 : 0}%`, background: color }} />
                    </div>
                    <span style={{ ...s.breakCount, color }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <h3 style={s.cardTitle}><i className="fa-solid fa-book-open" style={s.titleIcon} /> Recent Books</h3>
              <table style={s.table}>
                <thead><tr><TH>Title</TH><TH>Author</TH><TH>Status</TH></tr></thead>
                <tbody>
                  {books.slice(0, 5).map(b => (
                    <tr key={b.id}>
                      <TD>{b.title}</TD><TD>{b.author}</TD>
                      <TD><Badge color={b.status === 'Available' ? 'success' : 'danger'}>{b.status}</Badge></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BOOKS */}
      {page === 'books' && (
        <div className="fade-in">
          <TopBar title="Books" subtitle="Manage the full catalog"
            action={<AddBookBtn onAdd={onAddBook} />} />
          <BooksTable books={books} onToggle={onToggleStatus} onDelete={onDeleteBook} role="Admin" />
        </div>
      )}

      {/* LIBRARIES */}
      {page === 'libraries' && (
        <div className="fade-in">
          <TopBar title="Libraries Page" subtitle="Manage campus library locations"
            action={<PrimaryBtn variant="primary" onClick={openCreateLib} style={{ borderRadius: 6 }}>
              <i className="fa-solid fa-plus" /> Create Library
            </PrimaryBtn>} />
          <div style={s.card}>
            <div style={s.searchRow}>
              <div style={s.searchBox}>
                <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-muted)', fontSize: 13 }} />
                <input style={s.searchInput} placeholder="Search libraries..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <table style={s.table}>
              <thead><tr><TH>Name</TH><TH>Address</TH><TH>City</TH><TH>Actions</TH></tr></thead>
              <tbody>
                {libraries.filter(l => l.name.toLowerCase().includes(search.toLowerCase())).map(lib => (
                  <tr key={lib.id}>
                    <TD><strong>{lib.name}</strong></TD>
                    <TD>{lib.address}</TD><TD>{lib.city}</TD>
                    <TD>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={s.editBtn} onClick={() => openEditLib(lib)} title="Edit">
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button style={s.delBtn} onClick={() => setLibraries(p => p.filter(l => l.id !== lib.id))} title="Delete">
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal open={libModal} onClose={() => setLibModal(false)} title={editLib ? 'Edit Library' : 'Create Library'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FormInput label="Library Name" value={libForm.name} onChange={e => setLibForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Central Library" required />
              <FormInput label="Address" value={libForm.address} onChange={e => setLibForm(f => ({ ...f, address: e.target.value }))} placeholder="Street address" />
              <FormInput label="City" value={libForm.city} onChange={e => setLibForm(f => ({ ...f, city: e.target.value }))} placeholder="City name" />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <PrimaryBtn variant="outline" onClick={() => setLibModal(false)}>Cancel</PrimaryBtn>
                <PrimaryBtn variant="primary" onClick={saveLib}>{editLib ? 'Save Changes' : 'Create'}</PrimaryBtn>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* USERS */}
      {page === 'users' && (
        <div className="fade-in">
          <TopBar title="Users" subtitle="All registered accounts" />
          <div style={s.card}>
            <table style={s.table}>
              <thead><tr><TH>Name</TH><TH>Email</TH><TH>Role</TH><TH>Joined</TH></tr></thead>
              <tbody>
                {users.length === 0
                  ? <tr><TD style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No users registered yet.</TD></tr>
                  : users.map(u => (
                    <tr key={u.id}>
                      <TD><strong>{u.name}</strong></TD>
                      <TD>{u.email}</TD>
                      <TD><Badge color={u.role === 'Librarian' ? 'primary' : 'muted'}>{u.role}</Badge></TD>
                      <TD>{new Date(u.createdAt).toLocaleDateString()}</TD>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function AddBookBtn({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const submit = async () => {
    if (!title || !author) return;
    await onAdd({ title, author });
    setTitle(''); setAuthor(''); setOpen(false);
  };
  return (
    <>
      <PrimaryBtn variant="primary" onClick={() => setOpen(true)} style={{ borderRadius: 6 }}>
        <i className="fa-solid fa-plus" /> Add Book
      </PrimaryBtn>
      <Modal open={open} onClose={() => setOpen(false)} title="Add New Book">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormInput label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Book title" required />
          <FormInput label="Author" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name" required />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <PrimaryBtn variant="outline" onClick={() => setOpen(false)}>Cancel</PrimaryBtn>
            <PrimaryBtn variant="primary" onClick={submit} disabled={!title || !author}>Add Book</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function BooksTable({ books, onToggle, onDelete, role }) {
  const canModify = role === 'Librarian' || role === 'Admin';
  const canDelete = role === 'Admin';
  const [search, setSearch] = useState('');
  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={s.card}>
      <div style={s.searchRow}>
        <div style={s.searchBox}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-muted)', fontSize: 13 }} />
          <input style={s.searchInput} placeholder="Search by title or author..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={s.countBadge}>{filtered.length} book{filtered.length !== 1 ? 's' : ''}</span>
      </div>
      <table style={s.table}>
        <thead><tr><TH>#</TH><TH>Title</TH><TH>Author</TH><TH>Status</TH><TH>Actions</TH></tr></thead>
        <tbody>
          {filtered.length === 0
            ? <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>No books found.</td></tr>
            : filtered.map((b, i) => (
              <tr key={b.id}>
                <TD style={{ color: 'var(--text-muted)', width: 40 }}>{i + 1}</TD>
                <TD><strong>{b.title}</strong></TD>
                <TD>{b.author}</TD>
                <TD>
                  <button onClick={() => canModify && onToggle(b.id)}
                    title={canModify ? 'Click to toggle' : 'Read only'}
                    style={{ ...s.statusBadge,
                      background: b.status === 'Available' ? 'rgba(72,187,120,0.1)' : 'rgba(245,101,101,0.1)',
                      color: b.status === 'Available' ? '#276749' : '#c53030',
                      border: `1px solid ${b.status === 'Available' ? 'rgba(72,187,120,0.3)' : 'rgba(245,101,101,0.3)'}`,
                      cursor: canModify ? 'pointer' : 'default',
                    }}>
                    <i className={b.status === 'Available' ? 'fa-solid fa-circle-check' : 'fa-solid fa-clock'} />
                    {b.status}
                    {canModify && <i className="fa-solid fa-arrows-rotate" style={{ fontSize: 10, opacity: 0.6 }} />}
                  </button>
                </TD>
                <TD>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {canModify && <button style={s.editBtn} onClick={() => onToggle(b.id)} title="Toggle status"><i className="fa-solid fa-arrows-rotate" /></button>}
                    {canDelete && <button style={s.delBtn} onClick={() => onDelete(b.id)} title="Delete"><i className="fa-solid fa-trash" /></button>}
                    {!canModify && !canDelete && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Read only</span>}
                  </div>
                </TD>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

const s = {
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  card: {
    background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    padding: '20px 22px', boxShadow: 'var(--shadow-sm)', marginBottom: 20,
  },
  cardTitle: { fontSize: 15, fontFamily: 'var(--font-main)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 },
  titleIcon: { color: 'var(--primary)' },
  donutRow: { display: 'flex', justifyContent: 'space-around', marginBottom: 24 },
  breakdownList: { display: 'flex', flexDirection: 'column', gap: 12 },
  breakRow: { display: 'flex', alignItems: 'center', gap: 10 },
  breakLabel: { fontSize: 13, fontFamily: 'var(--font-main)', fontWeight: 600, color: 'var(--text-secondary)', width: 68 },
  breakBar: { flex: 1, height: 7, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' },
  breakFill: { height: '100%', borderRadius: 4, transition: 'width 0.6s ease' },
  breakCount: { fontSize: 14, fontFamily: 'var(--font-main)', fontWeight: 800, width: 22, textAlign: 'right' },
  table: { width: '100%', borderCollapse: 'collapse' },
  searchRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)',
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
    padding: '0 14px', maxWidth: 360, flex: 1,
  },
  searchInput: { border: 'none', background: 'transparent', padding: '10px 0', fontSize: 14, color: 'var(--text-primary)', flex: 1, outline: 'none' },
  countBadge: { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-main)', fontWeight: 600 },
  statusBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
    borderRadius: 20, fontSize: 12, fontFamily: 'var(--font-main)', fontWeight: 600, transition: 'opacity 0.15s',
  },
  editBtn: {
    width: 32, height: 32, background: 'var(--primary-muted)', color: 'var(--primary)',
    border: '1px solid rgba(86,180,230,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  delBtn: {
    width: 32, height: 32, background: 'rgba(245,101,101,0.1)', color: 'var(--danger)',
    border: '1px solid rgba(245,101,101,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: 13,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
};