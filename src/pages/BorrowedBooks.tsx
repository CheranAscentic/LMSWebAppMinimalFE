import { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import apiService from '../services/ApiServices';
import type { Book } from '../models/Book';
import Loading from '@/components/ui/loading';
import { House, BookOpen, User as UserIcon, Calendar, Hash, Library, RotateCcw } from 'lucide-react';

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
      window.confirm('Failed to return book: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  const allBooks: Book[] = books ?? [];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
        <House className="w-8 h-8 mr-3 text-blue-500" />
        Borrowed Books
      </h2>
      {allBooks.length === 0 ? (
        <div className="flex flex-col items-center py-8">
          <Library className="w-16 h-16 text-gray-300 mb-4" />
          <div className="text-lg font-semibold text-gray-500">No borrowed books.</div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {allBooks.map((book) => (
            <div
              key={book.id}
              className="flex flex-col bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 relative"
              style={{
                background: 'var(--color-card)',
                color: 'var(--color-card-foreground)'
              }}
            >
              <div className="flex items-center mb-4">
                <BookOpen className="w-8 h-8 text-primary flex-shrink-0 mr-2" style={{ color: 'var(--color-primary)' }} />
                <div>
                  <div className="text-xl font-semibold text-gray-800">{book.title}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <UserIcon className="w-4 h-4 mr-1" />
                    {book.author}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                <div className="flex items-center">
                  <Hash className="w-4 h-4 mr-1 text-blue-400" />
                  <span>ID: {book.id}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-blue-400" />
                  <span>Published: {book.publicationYear}</span>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold">
                    {book.category}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 text-xs font-semibold">
                    ISBN: {book.isbn}
                  </span>
                </div>
              </div>
              <div className="text-gray-700 text-sm mb-4 line-clamp-2">{book.synopsis}</div>
              <button
                className="mt-auto self-end flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                onClick={() => handleReturnBook(book.id)}
                disabled={returningBook}
                title="Return this book"
              >
                <RotateCcw className="w-4 h-4" />
                Return
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}