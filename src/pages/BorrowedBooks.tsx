import { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import apiService from '../services/ApiServices';
import type { Book } from '../models/Book';
import Loading from '@/components/ui/loading';
import { House } from 'lucide-react';

interface MyBooksProps {
  userId: number;
}

export default function BorrowedBooks({ userId }: MyBooksProps) {
  const { data: books, loading, error, execute } = useApi<Book[]>();
  const { loading: returningBook, execute: executeReturn } = useApi<string>();

  useEffect(() => {
    if (userId) {
      execute(() => apiService.getBorrowedBooks(userId));
    }
  }, [execute, userId]);

  const handleReturnBook = async (bookId: number) => {
    try {
      await executeReturn(() => apiService.returnBook(userId, bookId));
      execute(() => apiService.getBorrowedBooks(userId));
    } catch (error) {
      console.error('Failed to return book:', error);
    }
  };

  if (loading) return <div className="text-center p-4">Loading borrowed books...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  const allBooks: Book[] = books ?? [];

  if (loading) {
      return (
        <Loading />
      );
    }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold flex mb-4">
        <House className="w-8 h-8 mr-3 text-blue-500" />
        Borrowed Books
        </h2>
      {allBooks.length === 0 ? (
        <div className="text-gray-500">No borrowed books.</div>
      ) : (
          <>
          {allBooks.map((book) => (
              <div key={book.id} className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
                <div>
                  <div className="font-semibold">ID: {book.id}</div>
                  <div className="text-lg flex">
                    <p>{book.title} by {book.author}</p>
                </div>
                </div>
                <button
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 disabled:opacity-50"
                  onClick={() => handleReturnBook(book.id)}
                  disabled={returningBook}
                >
                  Return
                </button>
              </div>
          ))}
          </>
      )}
    </div>
  );
}