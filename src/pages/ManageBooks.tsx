import { useEffect, useState, type ReactNode } from 'react';
import { useApi } from '../hooks/useApi';
import apiService, { type Book } from '../services/ApiServices';
import { Library, Book as BookIcon, User as UserIcon, Hash, Search, Plus, Edit3, Trash2 } from 'lucide-react';
import Loading from '@/components/ui/loading';
import type { User } from '@/models/User';
import { CreateBook } from './CreateBook';
import { UpdateBook } from './UpdateBook';
import { BorrowBookCell } from '@/components/BorrowBookCell';

interface ManageBooksProps {
  appUser: User;
  setViewPage: (page: ReactNode) => void;
}

export default function ManageBooks({ appUser, setViewPage }: ManageBooksProps) {
  const { data: books, loading, error, execute } = useApi<Book[]>();
  const { loading: deletingBook, execute: executeDelete } = useApi<string>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<'all' | 'available' | 'borrowed'>('all');

  useEffect(() => {
    execute(() => apiService.getAllBooks());
  }, [execute]);

  useEffect(() => {
    if (books) {
      let filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.isbn && book.isbn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (book.category && book.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      if (filter === 'available') {
        filtered = filtered.filter(book => book.available);
      } else if (filter === 'borrowed') {
        filtered = filtered.filter(book => !book.available);
      }
      setFilteredBooks(filtered);
    }
  }, [books, searchTerm, filter]);

  const handleDeleteBook = async (bookId: number, bookTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
      try {
        await executeDelete(() => apiService.deleteBook(bookId));
        execute(() => apiService.getAllBooks());
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  const handleReturn = async ( memberId : number, bookId: number) => {
    await apiService.returnBook(memberId, bookId);
    execute(() => apiService.getAllBooks()); // refresh
  };

  // const handleBorrow = async (bookId: number) => {
  //   if (!appUser?.id) return;
  //   try {
  //     await apiService.borrowBook(appUser.id, bookId);
  //     execute(() => apiService.getAllBooks());
  //   } catch (e) {
  //     console.error('Failed to borrow book:', e);
  //   }
  // };

  const getBookStats = () => {
    if (!books) return { total: 0, available: 0, borrowed: 0 };
    return {
      total: books.length,
      available: books.filter(b => b.available).length,
      borrowed: books.filter(b => !b.available).length,
    };
  };

  const refreshBooks = async () => {
    await execute(() => apiService.getAllBooks());
  }

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <BookIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Books</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => execute(() => apiService.getAllBooks())}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = getBookStats();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
          <Library className="w-8 h-8 mr-3 text-blue-500" />
          Book Management
        </h2>

        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Library className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Books</p>
                <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-green-600 font-medium">Available</p>
                <p className="text-2xl font-bold text-green-800">{stats.available}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-red-600 font-medium">Borrowed</p>
                <p className="text-2xl font-bold text-red-800">{stats.borrowed}</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Add Book Button */}
          {appUser.type === 'StaffManagement' && (
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              onClick={() => setViewPage(<CreateBook />)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Book
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Books ({stats.total})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'available'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Available ({stats.available})
          </button>
          <button
            onClick={() => setFilter('borrowed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'borrowed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Borrowed ({stats.borrowed})
          </button>
        </div>
      </div>

      {filteredBooks.length === 0 && books?.length === 0 && (
        <div className="text-center py-12">
          <Library className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Books Found</h3>
          <p className="text-gray-500 mb-4">There are no books in the system.</p>
          {appUser.type === 'StaffManagement' && (
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" onClick={() => setViewPage(<CreateBook />)}>
              Add First Book
            </button>
          )}
        </div>
      )}

      {filteredBooks.length === 0 && books && books.length > 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Books Found</h3>
          <p className="text-gray-500">Try adjusting your search terms or filters.</p>
        </div>
      )}

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ISBN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lending
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookIcon className="w-6 h-6 text-blue-500 mr-2" />
                      <span className="font-medium text-gray-900">{book.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-gray-800">
                      <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {book.author}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-gray-800">
                      <Hash className="w-4 h-4 mr-2 text-gray-400" />
                      {book.isbn}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${book.available ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                      {book.available ? 'Available' : 'Borrowed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            onClick={() => setViewPage(<UpdateBook updateBook={book} />)}>
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteBook(book.id, book.title)}
                            disabled={deletingBook}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                    </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {book.available ? (
                        // Borrow UI: input for userId, borrow button
                        <BorrowBookCell bookId={book.id} refreshBooks={refreshBooks}/>
                      ) : (
                        <div className="flex flex-col items-start space-y-1">
                          <div>
                            <span className="text-gray-600 text-xs">Borrowed by User ID: </span>
                            <span className="font-semibold">{book.memberId}</span>
                          </div>
                          <button
                            className="mt-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                            onClick={() => handleReturn(book.memberId!, book.id)}
                          >
                            Return
                          </button>
                        </div>
                      )}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBooks.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          <p>Showing {filteredBooks.length} of {books?.length || 0} books</p>
        </div>
      )}
    </div>
  );
}