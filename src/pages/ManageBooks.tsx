import { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import apiService from '../services/ApiServices';
import { BookOpen, User as UserIcon, Hash, Calendar, Package, Library } from 'lucide-react';
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

export default function ManageBooks({appUser} : BookListProps) {
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
      <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        {books?.map((book: Book) => (
          <div
            key={book.id}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            style={{
              background: 'var(--color-card)',
              color: 'var(--color-card-foreground)',
              borderRadius: 'var(--radius-xl)',
              borderColor: 'var(--color-border)'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <BookOpen className="w-8 h-8 text-primary flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium border font-semibold`}
                style={{
                  background: book.available ? 'var(--color-accent)' : 'var(--color-destructive)',
                  color: book.available? 'var(--color-accent-foreground)' : '#fff',
                  borderColor: book.available ? 'var(--color-accent)' : 'var(--color-destructive)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderRadius: '9999px',
                }}
              >
                {book.available ? 'available' : 'Borrowed'}
              </div>
            </div>

            <div className='flex justify-between'>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>{book.title}</h3>
              {appUser.type === "Member" && (
                <Button
                  disabled={!book.available}
                  variant={book.available ? "default" : "secondary"}
                  className="ml-2"
                  title={book.available ? "Borrow this book" : "Not available"}
                  onClick={() => handleBorrow(book.id)}
                >
                  Borrow
                </Button>
              )}
            </div>

            <div className="space-y-3 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-2 text-muted" style={{ color: 'var(--color-muted-foreground)' }} />
                <span>{book.author}</span>
              </div>

              <div className="flex items-center">
                <Hash className="w-4 h-4 mr-2 text-muted" style={{ color: 'var(--color-muted-foreground)' }} />
                <span>ID: {book.id}</span>
              </div>

              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-muted" style={{ color: 'var(--color-muted-foreground)' }} />
                <span>Published: {book.publicationYear}</span>
              </div>

              <div className="flex items-center">
                <Package className="w-4 h-4 mr-2 text-muted" style={{ color: 'var(--color-muted-foreground)' }} />
                <span>Available: {book.available ? "Yes" : "No"} </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}