import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout, TopBar, StatCard, PrimaryBtn, Badge, Modal, FormInput, DonutChart, TH, TD } from '../components/UI';
import { BooksTable } from './AdminDashboard';

export default function LibrarianDashboard({ books, onAddBook, onToggleStatus }) {
  const [page, setPage] = useState('dashboard');
  const [addModal, setAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const { getPendingLoans, respondToLoan } = useAuth();

  const available = books.filter(b => b.status === 'Available').length;
  const checkedOut = books.filter(b => b.status === 'Checked Out').length;
  const availPct = books.length ? Math.round((available / books.length) * 100) : 0;
  const outPct = books.length ? Math.round((checkedOut / books.length) * 100) : 0;
  const pendingLoans = getPendingLoans();

  const handleAdd = async () => {
    if (!title || !author) return;
    await onAddBook({ title, author });
    setTitle(''); setAuthor(''); setAddModal(false);
  };

  const handleLoanDecision = (requestId, decision, bookId) => {
    respondToLoan(requestId, decision);
    if (decision === 'approved') onToggleStatus(bookId);
  };

  return (
    <DashboardLayout role="Librarian" activePage={page} onNavigate={setPage}>

      {/* DASHBOARD */}
      {page === 'dashboard' && (
        <div className="fade-in">
          <TopBar title="Dashboard" subtitle="Librarian overview" />
          <div style={s.statsGrid}>
            <StatCard icon="fa-solid fa-book" label="Total Books" value={books.length} color="var(--primary)" />
            <StatCard icon="fa-solid fa-circle-check" label="Available" value={available} color="var(--success)" />
            <StatCard icon="fa-solid fa-clock" label="Checked Out" value={checkedOut} color="var(--secondary)" />
            <StatCard icon="fa-solid fa-inbox" label="Pending Requests" value={pendingLoans.length} color="#9b59b6" />
          </div>

          {/* Donuts */}
          <div style={s.card}>
            <h3 style={s.cardTitle}><i className="fa-solid fa-chart-donut" style={{ color: 'var(--primary)', marginRight: 8 }} /> Catalog Statistics</h3>
            <div style={s.donutRow}>
              <DonutChart pct={availPct} color="var(--primary)" label="Available" />
              <DonutChart pct={outPct} color="var(--secondary)" label="Checked Out" />
              <DonutChart pct={Math.min(100, outPct + 22)} color="var(--success)" label="Utilization" />
            </div>
          </div>

          {/* Pending loan requests preview */}
          {pendingLoans.length > 0 && (
            <div style={s.card}>
              <h3 style={s.cardTitle}>
                <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--secondary)', marginRight: 8 }} />
                Pending Loan Requests
                <span style={s.pendingBadge}>{pendingLoans.length}</span>
              </h3>
              <table style={s.table}>
                <thead><tr><TH>Student</TH><TH>Book</TH><TH>Requested</TH><TH>Action</TH></tr></thead>
                <tbody>
                  {pendingLoans.slice(0, 3).map(r => {
                    const book = books.find(b => b.id === r.bookId);
                    return (
                      <tr key={r.id}>
                        <TD><i className="fa-solid fa-user" style={{ color: 'var(--primary)', marginRight: 6 }} />{r.studentName}</TD>
                        <TD><strong>{r.bookTitle}</strong></TD>
                        <TD>{new Date(r.createdAt).toLocaleDateString()}</TD>
                        <TD>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <PrimaryBtn variant="success" onClick={() => handleLoanDecision(r.id, 'approved', r.bookId)}
                              disabled={book?.status !== 'Available'}
                              style={{ padding: '5px 12px', fontSize: 12, borderRadius: 6 }}>
                              <i className="fa-solid fa-check" /> Approve
                            </PrimaryBtn>
                            <PrimaryBtn variant="danger" onClick={() => handleLoanDecision(r.id, 'rejected', r.bookId)}
                              style={{ padding: '5px 12px', fontSize: 12, borderRadius: 6 }}>
                              <i className="fa-solid fa-xmark" /> Reject
                            </PrimaryBtn>
                          </div>
                        </TD>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {pendingLoans.length > 3 && (
                <button style={s.viewAllBtn} onClick={() => setPage('loans')}>
                  View all {pendingLoans.length} requests →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* BOOKS & CATALOG (unified) */}
      {page === 'books' && (
        <div className="fade-in">
          <TopBar title="Books & Catalog" subtitle="Full catalog — add and manage entries"
            action={
              <PrimaryBtn variant="primary" onClick={() => setAddModal(true)} style={{ borderRadius: 6 }}>
                <i className="fa-solid fa-plus" /> Add Book
              </PrimaryBtn>
            } />
          <BooksTable books={books} onToggle={onToggleStatus} onDelete={() => {}} role="Librarian" />
          <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New Book">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FormInput label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Book title" required />
              <FormInput label="Author" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name" required />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <PrimaryBtn variant="outline" onClick={() => setAddModal(false)}>Cancel</PrimaryBtn>
                <PrimaryBtn variant="primary" onClick={handleAdd} disabled={!title || !author}>Add Book</PrimaryBtn>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* LOAN REQUESTS */}
      {page === 'loans' && (
        <div className="fade-in">
          <TopBar title="Loan Requests" subtitle="Review and respond to student book requests" />
          <LoanRequestsTable books={books} onDecide={handleLoanDecision} />
        </div>
      )}
    </DashboardLayout>
  );
}

function LoanRequestsTable({ books, onDecide }) {
  const { getAllLoans } = useAuth();
  const [filter, setFilter] = useState('all');
  const all = getAllLoans();
  const filtered = filter === 'all' ? all : all.filter(r => r.status === filter);

  return (
    <div style={s.card}>
      <div style={s.filterRow}>
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              ...s.filterBtn,
              background: filter === f ? 'var(--primary)' : 'transparent',
              color: filter === f ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${filter === f ? 'var(--primary)' : 'var(--border)'}`,
            }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span style={s.filterCount}>{f === 'all' ? all.length : all.filter(r => r.status === f).length}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={s.empty}>
          <i className="fa-solid fa-inbox" style={{ fontSize: 32, color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)', marginTop: 10 }}>No {filter !== 'all' ? filter : ''} loan requests.</p>
        </div>
      ) : (
        <table style={s.table}>
          <thead><tr><TH>Student</TH><TH>Book Requested</TH><TH>Date</TH><TH>Status</TH><TH>Actions</TH></tr></thead>
          <tbody>
            {filtered.map(r => {
              const book = books.find(b => b.id === r.bookId);
              return (
                <tr key={r.id}>
                  <TD>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={s.studentAvatar}>{r.studentName[0]}</div>
                      {r.studentName}
                    </div>
                  </TD>
                  <TD>
                    <strong>{r.bookTitle}</strong>
                    {book && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
                      ({book.status})
                    </span>}
                  </TD>
                  <TD>{new Date(r.createdAt).toLocaleDateString()}</TD>
                  <TD>
                    <Badge color={r.status === 'pending' ? 'warning' : r.status === 'approved' ? 'success' : 'danger'}>
                      {r.status}
                    </Badge>
                  </TD>
                  <TD>
                    {r.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <PrimaryBtn variant="success" onClick={() => onDecide(r.id, 'approved', r.bookId)}
                          disabled={book?.status !== 'Available'}
                          style={{ padding: '5px 12px', fontSize: 12, borderRadius: 6 }}>
                          <i className="fa-solid fa-check" /> Approve
                        </PrimaryBtn>
                        <PrimaryBtn variant="danger" onClick={() => onDecide(r.id, 'rejected', r.bookId)}
                          style={{ padding: '5px 12px', fontSize: 12, borderRadius: 6 }}>
                          <i className="fa-solid fa-xmark" /> Reject
                        </PrimaryBtn>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Resolved</span>
                    )}
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const s = {
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 },
  card: {
    background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    padding: '20px 22px', boxShadow: 'var(--shadow-sm)', marginBottom: 20,
  },
  cardTitle: { fontSize: 15, fontFamily: 'var(--font-main)', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center' },
  pendingBadge: {
    marginLeft: 8, background: 'var(--secondary)', color: 'white',
    borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 700,
  },
  donutRow: { display: 'flex', justifyContent: 'space-around' },
  table: { width: '100%', borderCollapse: 'collapse' },
  viewAllBtn: {
    marginTop: 12, background: 'none', border: 'none', color: 'var(--primary)',
    fontFamily: 'var(--font-main)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
  },
  filterRow: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  filterBtn: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
    borderRadius: 50, fontSize: 13, fontFamily: 'var(--font-main)', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.15s',
  },
  filterCount: {
    background: 'rgba(255,255,255,0.25)', borderRadius: 10, padding: '1px 6px', fontSize: 11,
  },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' },
  studentAvatar: {
    width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-muted)',
    color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-main)',
  },
};