import { createContext, useContext, useState } from 'react';

const ADMIN_ACCOUNT = {
  id: 0,
  name: 'Administrator',
  email: 'admin@pageable.com',
  password: 'admin123',
  role: 'Admin',
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([ADMIN_ACCOUNT]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState('');
  // loanRequests: { id, studentId, studentName, bookId, bookTitle, status: 'pending'|'approved'|'rejected', createdAt }
  const [loanRequests, setLoanRequests] = useState([]);

  const register = ({ name, email, password, role }) => {
    setAuthError('');
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setAuthError('An account with this email already exists.');
      return false;
    }
    const newUser = { id: Date.now(), name, email, password, role, createdAt: new Date().toISOString() };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const login = ({ email, password }) => {
    setAuthError('');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) { setAuthError('Invalid email or password.'); return false; }
    setCurrentUser(user);
    return true;
  };

  const logout = () => { setCurrentUser(null); setAuthError(''); };
  const clearError = () => setAuthError('');
  const getAllUsers = () => users.filter(u => u.role !== 'Admin');

  // ── Loan requests ──────────────────────────────────────────
  const requestLoan = (bookId, bookTitle) => {
    if (!currentUser) return;
    const already = loanRequests.find(r => r.studentId === currentUser.id && r.bookId === bookId && r.status === 'pending');
    if (already) return 'already_requested';
    setLoanRequests(prev => [...prev, {
      id: Date.now(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      bookId,
      bookTitle,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }]);
    return 'ok';
  };

  const respondToLoan = (requestId, decision) => {
    setLoanRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: decision } : r));
  };

  const getMyLoans = () => loanRequests.filter(r => r.studentId === currentUser?.id);
  const getPendingLoans = () => loanRequests.filter(r => r.status === 'pending');
  const getAllLoans = () => loanRequests;

  return (
    <AuthContext.Provider value={{
      currentUser, authError,
      register, login, logout, clearError,
      getAllUsers,
      totalUsers: users.filter(u => u.role !== 'Admin').length,
      loanRequests,
      requestLoan, respondToLoan,
      getMyLoans, getPendingLoans, getAllLoans,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);