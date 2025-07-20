import { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import apiService from '../services/ApiServices';
import { BookOpen, User as UserIcon, Hash, Calendar, Library, Key } from 'lucide-react';
import type { Book } from '../models/Book';
import type { User } from '@/models/User';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/loading';

// interface Book {
//   id: number;
//   title: string;
//   author: string;
//   isbn: string;
//   publicationYear: number;
//   availableCopies: number;
// }
interface BookListProps {
  appUser: User;
}

export default function BooksList({appUser} : BookListProps) {
  const { data: books, loading, error, execute } = useApi<Book[]>();
    const { execute: executeBorrow } = useApi<string>();


  useEffect(() => {
    execute(() => apiService.getAllBooks());
  }, [execute]);

  const handleBorrow = async (bookId: number) => {
    if (!appUser?.id) return;
    try {
      await executeBorrow(() => apiService.borrowBook(appUser.id, bookId));
      // Optionally refresh book list after borrowing
      execute(() => apiService.getAllBooks());
    } catch (e) {
      // Error is handled by useApi
      console.error('Failed to borrow book:', e);
    }
  };

  if (loading) return <div className="text-center p-4">Loading books...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  if (loading) {
      return (
        <Loading />
      );
    }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
        <Library className="w-8 h-8 mr-3 text-blue-500" />
        Browse Books
        </h2>
      {/* <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3"> */}
      <div
      className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 auto-rows-fr "
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
      }} >
        {books?.map((book: Book) => (
          <div
            key={book.id}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            style={{
              background: 'var(--color-card)',
              color: 'var(--color-card-foreground)',
              borderRadius: 'var(--radius-xl)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div
              className="
                grid
                grid-cols-[5fr_5fr_1fr_5fr]
                grid-rows-[1fr_2fr_3fr_1fr]
              "
              style={{ minHeight: 320 }}
            >
              {/* 1,1: Book Icon */}
              <div className="col-start-1 row-start-1">
                <BookOpen className="w-8 h-8 text-primary flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
              </div>

              {/* 5,1: Availability Badge */}
              <div className="col-start-4 row-start-1 justify-self-end self-start">
                <div
                  className="px-3 py-1 rounded-full text-xs border font-semibold"
                  style={{
                    background: book.available ? 'var(--color-accent)' : 'var(--color-destructive)',
                    color: book.available ? 'var(--color-accent-foreground)' : '#fff',
                    borderColor: book.available ? 'var(--color-accent)' : 'var(--color-destructive)',
                    borderWidth: 1,
                    borderStyle: 'solid',
                  }}
                >
                  {book.available ? 'available' : 'Borrowed'}
                </div>
              </div>

              {/* 2,1 to 2,4: Book Title */}
              <div className="col-start-1 col-end-5 row-start-2 flex items-center">
                <h3 className="text-xl font-semibold mb-0" style={{ color: 'var(--color-foreground)' }}>
                  {book.title}
                </h3>
              </div>

              {/* 3,1 to 3,4: Book Info Block (spans 2 rows, all columns) */}
              <div className="col-start-1 col-end-5 row-start-3 row-end-5">
                <div className="space-y-3 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-2 text-muted" style={{ color: 'var(--color-muted-foreground)' }} />
                    <span>{book.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 mr-2 text-muted" style={{ color: 'var(--color-muted-foreground)' }} />
                    <span>ISBN: {book.isbn}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-muted" style={{ color: 'var(--color-muted-foreground)' }} />
                    <span>Published: {book.publicationYear}</span>
                  </div>
                  <div className="flex items-center">
                    <Key className="w-4 h-4 mr-2 text-muted" style={{ color: 'var(--color-muted-foreground)' }} />
                    <span>ID: {book.id}</span>
                  </div>
                </div>
              </div>

              {/* 5,1 to 5,4: Borrow Button */}
              {appUser.type === "Member" && (
                <div className="col-start-1 col-end-5 row-start-4 flex items-center">
                  <Button
                    disabled={!book.available}
                    variant={book.available ? "default" : "secondary"}
                    className="ml-2"
                    title={book.available ? "Borrow this book" : "Not available"}
                    onClick={() => handleBorrow(book.id)}
                  >
                    Borrow
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}