import { createContext, useContext, useState } from 'react';

const LoanContext = createContext(null);

export function LoanProvider({ children }) {
  const [loans, setLoans] = useState([]);

  // Student requests a loan
  const requestLoan = (book, student) => {
    const existing = loans.find(
      l => l.bookId === book.id && l.studentId === student.id && l.status === 'Pending'
    );
    if (existing) return { ok: false, message: 'You already have a pending request for this book.' };
    const alreadyBorrowed = loans.find(
      l => l.bookId === book.id && l.studentId === student.id && l.status === 'Approved'
    );
    if (alreadyBorrowed) return { ok: false, message: 'You already have this book borrowed.' };
    if (book.status !== 'Available') return { ok: false, message: 'This book is not available.' };

    setLoans(prev => [...prev, {
      id: Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      status: 'Pending', // 'Pending' | 'Approved' | 'Rejected'
      requestedAt: new Date().toISOString(),
      resolvedAt: null,
    }]);
    return { ok: true };
  };

  // Librarian approves — also triggers book status change via callback
  const approveLoan = (loanId, onToggleBookStatus) => {
    setLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        onToggleBookStatus(l.bookId, 'Checked Out');
        return { ...l, status: 'Approved', resolvedAt: new Date().toISOString() };
      }
      return l;
    }));
  };

  // Librarian rejects
  const rejectLoan = (loanId) => {
    setLoans(prev => prev.map(l =>
      l.id === loanId ? { ...l, status: 'Rejected', resolvedAt: new Date().toISOString() } : l
    ));
  };

  // Return book — sets it back to available
  const returnLoan = (loanId, onToggleBookStatus) => {
    setLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        onToggleBookStatus(l.bookId, 'Available');
        return { ...l, status: 'Returned', resolvedAt: new Date().toISOString() };
      }
      return l;
    }));
  };

  const getPendingLoans = () => loans.filter(l => l.status === 'Pending');
  const getStudentLoans = (studentId) => loans.filter(l => l.studentId === studentId);

  return (
    <LoanContext.Provider value={{
      loans, requestLoan, approveLoan, rejectLoan, returnLoan,
      getPendingLoans, getStudentLoans,
    }}>
      {children}
    </LoanContext.Provider>
  );
}

export const useLoan = () => useContext(LoanContext);