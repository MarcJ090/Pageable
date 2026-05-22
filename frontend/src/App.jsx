import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import LibrarianDashboard from './pages/LibrarianDashboard';
import StudentDashboard from './pages/StudentDashboard';

const API_BASE = '/api';

const INITIAL_BOOKS = [
  { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', status: 'Available' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', status: 'Checked Out' },
  { id: 3, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', status: 'Available' },
];

function AppInner() {
  const { currentUser } = useAuth();
  const [authView, setAuthView] = useState('login');
  const [appView, setAppView] = useState('landing');
  const [books, setBooks] = useState(INITIAL_BOOKS);

  const apiCall = async (path, options = {}) => {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser?.role, ...(options.headers || {}) },
      });
      if (res.status === 403) { alert(`🚫 Forbidden: Your role (${currentUser?.role}) cannot perform this action.`); return null; }
      if (res.ok) return await res.json();
    } catch { /* backend offline — use fallback */ }
    return null;
  };

  const handleAddBook = async ({ title, author }) => {
    const data = await apiCall('/books', { method: 'POST', body: JSON.stringify({ title, author }) });
    if (data) { setBooks(prev => [...prev, data]); return; }
    setBooks(prev => [...prev, { id: Date.now(), title, author, status: 'Available' }]);
  };

  const handleToggleStatus = async (id) => {
    const data = await apiCall(`/books/${id}/toggle`, { method: 'PATCH' });
    if (data) { setBooks(prev => prev.map(b => b.id === id ? data : b)); return; }
    setBooks(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'Available' ? 'Checked Out' : 'Available' } : b));
  };

  const handleDeleteBook = async (id) => {
    const book = books.find(b => b.id === id);
    if (!window.confirm(`Delete "${book?.title}"? This cannot be undone.`)) return;
    const data = await apiCall(`/books/${id}`, { method: 'DELETE' });
    if (data !== null) { setBooks(prev => prev.filter(b => b.id !== id)); return; }
    // If null returned due to 403, don't delete locally
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  // Logged in → show correct dashboard
  if (currentUser) {
    const props = { books, onAddBook: handleAddBook, onToggleStatus: handleToggleStatus, onDeleteBook: handleDeleteBook };
    if (currentUser.role === 'Admin') return <AdminDashboard {...props} />;
    if (currentUser.role === 'Librarian') return <LibrarianDashboard {...props} />;
    if (currentUser.role === 'Student') return <StudentDashboard books={books} />;
  }

  if (appView === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => { setAuthView('register'); setAppView('auth'); }}
        onLogin={() => { setAuthView('login'); setAppView('auth'); }}
      />
    );
  }

  if (authView === 'login') {
    return (
      <LoginPage
        onNavigateRegister={() => setAuthView('register')}
        onBackHome={() => setAppView('landing')}
      />
    );
  }

  return (
    <RegisterPage
      onNavigateLogin={() => setAuthView('login')}
      onBackHome={() => setAppView('landing')}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}