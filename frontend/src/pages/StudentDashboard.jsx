import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout, TopBar, StatCard, Badge, TH, TD } from '../components/UI';

export default function StudentDashboard({ books }) {
  const [page, setPage] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const { currentUser, requestLoan, getMyLoans } = useAuth();

  const myLoans = getMyLoans();
  const activeLoans = myLoans.filter(r => r.status === 'approved');
  const pendingLoans = myLoans.filter(r => r.status === 'pending');
  const available = books.filter(b => b.status === 'Available').length;

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleRequest = (book) => {
    if (book.status !== 'Available') { showToast('⚠ This book is currently unavailable.'); return; }
    const result = requestLoan(book.id, book.title);
    if (result === 'already_requested') showToast('ℹ You already have a pending request for this book.');
    else showToast(`✅ Loan request sent for "${book.title}"!`);
  };

  return (
    <DashboardLayout role="Student" activePage={page} onNavigate={setPage}>
      {/* Toast */}
      {toast && (
        <div style={s.toast}>{toast}</div>
      )}

      {/* DASHBOARD */}
      {page === 'dashboard' && (
        <div className="fade-in">
          <TopBar title="Dashboard" subtitle={`Welcome back, ${currentUser?.name} 👋`} />
          <div style={s.statsGrid}>
            <StatCard icon="fa-solid fa-book" label="Total Books" value={books.length} color="var(--primary)" />
            <StatCard icon="fa-solid fa-circle-check" label="Available Now" value={available} color="var(--success)" />
            <StatCard icon="fa-solid fa-bookmark" label="Active Loans" value={activeLoans.length} color="var(--secondary)" />
            <StatCard icon="fa-solid fa-clock" label="Pending Requests" value={pendingLoans.length} color="#9b59b6" />
          </div>

          {/* Welcome banner */}
          <div style={s.welcomeBanner}>
            <div>
              <h2 style={s.bannerTitle}>Ready to explore?</h2>
              <p style={s.bannerText}>Browse the full library catalog and request loans from librarians directly.</p>
              <button style={s.bannerBtn} onClick={() => setPage('catalog')}>
                <i className="fa-solid fa-magnifying-glass" style={{ marginRight: 8 }} />Browse Catalog
              </button>
            </div>
            <div style={s.bookRow}>
              {['var(--white)','rgba(255,255,255,0.7)','var(--white)','rgba(255,255,255,0.8)','var(--white)'].map((c,i) => (
                <div key={i} style={{ ...s.bookSpine, background: c, height: `${55+(i%3)*22}px`, opacity: 0.8 + (i%3)*0.05 }} />
              ))}
            </div>
          </div>

          {/* Available books grid */}
          <div style={s.card}>
            <h3 style={s.cardTitle}><i className="fa-solid fa-book-open" style={{ color: 'var(--primary)', marginRight: 8 }} />Available Books</h3>
            <div style={s.bookGrid}>
              {books.filter(b => b.status === 'Available').slice(0, 6).map(b => (
                <div key={b.id} style={s.bookCard}>
                  <div style={s.bookCardTop}>
                    <i className="fa-solid fa-book" style={{ color: 'var(--primary)', fontSize: 22 }} />
                    <Badge color="success">Available</Badge>
                  </div>
                  <div style={s.bookCardTitle}>{b.title}</div>
                  <div style={s.bookCardAuthor}>{b.author}</div>
                  <button style={s.requestBtn} onClick={() => handleRequest(b)}>
                    <i className="fa-solid fa-hand-point-right" /> Request Loan
                  </button>
                </div>
              ))}
              {books.filter(b => b.status === 'Available').length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: 16 }}>No available books right now.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CATALOG */}
      {page === 'catalog' && (
        <div className="fade-in">
          <TopBar title="Browse Books" subtitle="Full library catalog" />
          <div style={s.card}>
            <div style={s.searchRow}>
              <div style={s.searchBox}>
                <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-muted)', fontSize: 13 }} />
                <input style={s.searchInput} placeholder="Search by title or author..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-main)', fontWeight: 600 }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
            <table style={s.table}>
              <thead><tr><TH>#</TH><TH>Title</TH><TH>Author</TH><TH>Status</TH><TH>Action</TH></tr></thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>No results found.</td></tr>
                  : filtered.map((b, i) => (
                    <tr key={b.id}>
                      <TD style={{ color: 'var(--text-muted)', width: 40 }}>{i + 1}</TD>
                      <TD><strong>{b.title}</strong></TD>
                      <TD>{b.author}</TD>
                      <TD><Badge color={b.status === 'Available' ? 'success' : 'danger'}>{b.status}</Badge></TD>
                      <TD>
                        <button
                          onClick={() => handleRequest(b)}
                          disabled={b.status !== 'Available' || myLoans.some(r => r.bookId === b.id && r.status === 'pending')}
                          style={{
                            ...s.loanBtn,
                            opacity: (b.status !== 'Available' || myLoans.some(r => r.bookId === b.id && r.status === 'pending')) ? 0.4 : 1,
                            cursor: (b.status !== 'Available' || myLoans.some(r => r.bookId === b.id && r.status === 'pending')) ? 'not-allowed' : 'pointer',
                          }}>
                          {myLoans.some(r => r.bookId === b.id && r.status === 'pending')
                            ? <><i className="fa-solid fa-clock" /> Pending</>
                            : <><i className="fa-solid fa-hand-point-right" /> Request</>}
                        </button>
                      </TD>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MY LOANS */}
      {page === 'loans' && (
        <div className="fade-in">
          <TopBar title="My Loans" subtitle="Your loan history and active requests" />
          {myLoans.length === 0 ? (
            <div style={s.empty}>
              <i className="fa-solid fa-bookmark" style={{ fontSize: 36, color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-muted)', marginTop: 12, fontFamily: 'var(--font-main)', fontWeight: 600 }}>No loan history yet.</p>
              <button style={s.bannerBtn} onClick={() => setPage('catalog')}>Browse Catalog</button>
            </div>
          ) : (
            <div style={s.card}>
              <table style={s.table}>
                <thead><tr><TH>Book</TH><TH>Requested</TH><TH>Status</TH></tr></thead>
                <tbody>
                  {myLoans.map(r => (
                    <tr key={r.id}>
                      <TD><strong>{r.bookTitle}</strong></TD>
                      <TD>{new Date(r.createdAt).toLocaleDateString()}</TD>
                      <TD>
                        <Badge color={r.status === 'pending' ? 'warning' : r.status === 'approved' ? 'success' : 'danger'}>
                          {r.status === 'pending' && <i className="fa-solid fa-clock" style={{ marginRight: 4 }} />}
                          {r.status === 'approved' && <i className="fa-solid fa-check" style={{ marginRight: 4 }} />}
                          {r.status === 'rejected' && <i className="fa-solid fa-xmark" style={{ marginRight: 4 }} />}
                          {r.status}
                        </Badge>
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

const s = {
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 },
  toast: {
    position: 'fixed', bottom: 28, right: 28, background: 'var(--text-primary)', color: 'white',
    padding: '12px 22px', borderRadius: 'var(--radius-sm)', fontSize: 14, fontFamily: 'var(--font-main)',
    fontWeight: 600, zIndex: 9999, boxShadow: 'var(--shadow-lg)', animation: 'fadeIn 0.3s ease',
  },
  welcomeBanner: {
    background: 'linear-gradient(135deg, var(--primary) 0%, #3a9fd4 100%)',
    borderRadius: 'var(--radius-lg)', padding: '28px 36px', marginBottom: 24,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 8px 32px rgba(86,180,230,0.28)',
  },
  bannerTitle: { fontSize: 20, fontFamily: 'var(--font-main)', fontWeight: 900, color: 'white', marginBottom: 8 },
  bannerText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 18 },
  bannerBtn: {
    padding: '10px 22px', background: 'white', color: 'var(--primary-dark)',
    border: 'none', borderRadius: 50, fontSize: 13, fontFamily: 'var(--font-main)',
    fontWeight: 700, cursor: 'pointer',
  },
  bookRow: { display: 'flex', alignItems: 'flex-end', gap: 7 },
  bookSpine: { width: 20, borderRadius: '4px 4px 2px 2px' },
  card: {
    background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    padding: '20px 22px', boxShadow: 'var(--shadow-sm)', marginBottom: 20,
  },
  cardTitle: { fontSize: 15, fontFamily: 'var(--font-main)', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center' },
  bookGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 },
  bookCard: {
    background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16,
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  bookCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  bookCardTitle: { fontSize: 13, fontFamily: 'var(--font-main)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 },
  bookCardAuthor: { fontSize: 12, color: 'var(--text-muted)' },
  requestBtn: {
    marginTop: 6, padding: '7px 12px', background: 'var(--primary-muted)', color: 'var(--primary)',
    border: '1px solid rgba(86,180,230,0.3)', borderRadius: 6, fontSize: 12,
    fontFamily: 'var(--font-main)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
  },
  searchRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)',
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 14px', flex: 1, maxWidth: 380,
  },
  searchInput: { border: 'none', background: 'transparent', padding: '10px 0', fontSize: 14, color: 'var(--text-primary)', flex: 1, outline: 'none' },
  table: { width: '100%', borderCollapse: 'collapse' },
  loanBtn: {
    padding: '5px 14px', background: 'var(--primary-muted)', color: 'var(--primary)',
    border: '1px solid rgba(86,180,230,0.3)', borderRadius: 6, fontSize: 12,
    fontFamily: 'var(--font-main)', fontWeight: 700, transition: 'all 0.15s',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '60px 20px', background: 'var(--white)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', gap: 8,
  },
};