import { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import apiService from '../services/ApiServices';
import { BookOpen, User, Hash, Calendar, Package } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  availableCopies: number;
}

export default function BooksList() {
  const { data: books, loading, error, execute } = useApi<Book[]>();

  useEffect(() => {
    execute(() => apiService.getAllBooks());
  }, [execute]);

  if (loading) return <div className="text-center p-4">Loading books...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  return (
    <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      {books?.map((book: Book) => (
        <div key={book.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <BookOpen className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              book.availableCopies > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              <span>{book.author}</span>
            </div>
            
            <div className="flex items-center">
              <Hash className="w-4 h-4 mr-2 text-gray-400" />
              <span>ISBN: {book.isbn}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>Published: {book.publicationYear}</span>
            </div>
            
            <div className="flex items-center">
              <Package className="w-4 h-4 mr-2 text-gray-400" />
              <span>Available: {book.availableCopies} copies</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}