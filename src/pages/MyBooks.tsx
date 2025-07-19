// import { useEffect } from 'react';
// import { useApi } from '../hooks/useApi';
// import apiService, { type BorrowedBook } from '../services/ApiServices';
// import { BookOpen, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// interface MyBooksProps {
//   userId: number;
// }

// export default function MyBooks({ userId }: MyBooksProps) {
//   const { data: borrowedBooks, loading, error, execute } = useApi<BorrowedBook[]>();
//   const { loading: returningBook, execute: executeReturn } = useApi<string>();
//   // const [filter] = useState<'all' | 'active' | 'overdue'>('all');

//   useEffect(() => {
//     if (userId) {
//       execute(() => apiService.getBorrowedBooks(userId));
//     }
//   }, [execute, userId]);

//   const handleReturnBook = async (bookId: number) => {
//     try {
//       await executeReturn(() => apiService.returnBook(userId, bookId));
//       // Refresh the borrowed books list
//       execute(() => apiService.getBorrowedBooks(userId));
//     } catch (error) {
//       console.error('Failed to return book:', error);
//     }
//   };

//   // const getFilteredBooks = () => {
//   //   if (!borrowedBooks) return [];
    
//   //   const now = new Date();
    
//   //   switch (filter) {
//   //     case 'active':
//   //       return borrowedBooks.filter(book => !book.returnDate);
//   //     case 'overdue':
//   //       return borrowedBooks.filter(book => 
//   //         !book.returnDate && new Date(book.dueDate) < now
//   //       );
//   //     default:
//   //       return borrowedBooks;
//   //   }
//   // };

//   const isOverdue = (dueDate: string, returnDate?: string) => {
//     if (returnDate) return false;
//     return new Date(dueDate) < new Date();
//   };

//   const getDaysUntilDue = (dueDate: string, returnDate?: string) => {
//     if (returnDate) return null;
//     const due = new Date(dueDate);
//     const now = new Date();
//     const diffTime = due.getTime() - now.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your books...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center p-6 bg-red-50 rounded-lg">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Books</h3>
//           <p className="text-red-600 mb-4">{error}</p>
//           <button 
//             onClick={() => execute(() => apiService.getBorrowedBooks(userId))}
//             className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // const filteredBooks = getFilteredBooks();
// //   const activeBooks = borrowedBooks?.filter(book => !book.returnDate) || [];
// //   const overdueBooks = borrowedBooks?.filter(book => 
// //     !book.returnDate && new Date(book.dueDate) < new Date()
// //   ) || [];

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
//           <BookOpen className="w-8 h-8 mr-3 text-blue-500" />
//           My Books
//         </h2>
        
//         {/* Summary Cards */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <div className="flex items-center">
//               <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
//               <div>
//                 <p className="text-sm text-blue-600 font-medium">Currently Borrowed</p>
//                 <p className="text-2xl font-bold text-blue-800">{activeBooks.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="flex items-center">
//               <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
//               <div>
//                 <p className="text-sm text-red-600 font-medium">Overdue</p>
//                 <p className="text-2xl font-bold text-red-800">{overdueBooks.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//             <div className="flex items-center">
//               <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
//               <div>
//                 <p className="text-sm text-green-600 font-medium">Total Borrowed</p>
//                 <p className="text-2xl font-bold text-green-800">{borrowedBooks?.length || 0}</p>
//               </div>
//             </div>
//           </div>
//         </div> */}

//         {/* Filter Buttons */}
//         {/* <div className="flex space-x-2 mb-4">
//           <button
//             onClick={() => setFilter('all')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               filter === 'all'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//           >
//             All Books ({borrowedBooks?.length || 0})
//           </button>
//           <button
//             onClick={() => setFilter('active')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               filter === 'active'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//           >
//             Currently Borrowed ({activeBooks.length})
//           </button>
//           <button
//             onClick={() => setFilter('overdue')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               filter === 'overdue'
//                 ? 'bg-red-500 text-white'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//           >
//             Overdue ({overdueBooks.length})
//           </button>
//         </div> */}
//       </div>

//       {/* {filteredBooks.length === 0 && borrowedBooks?.length === 0 && (
//         <div className="text-center py-12">
//           <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-xl font-semibold text-gray-600 mb-2">No Books Borrowed</h3>
//           <p className="text-gray-500 mb-4">You haven't borrowed any books yet.</p>
//           <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
//             Browse Books
//           </button>
//         </div>
//       )}

//       {filteredBooks.length === 0 && borrowedBooks && borrowedBooks.length > 0 && (
//         <div className="text-center py-12">
//           <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-xl font-semibold text-gray-600 mb-2">No Books in This Category</h3>
//           <p className="text-gray-500">Try selecting a different filter.</p>
//         </div>
//       )}

//       <div className="space-y-4">
//         {filteredBooks.map((borrowedBook) => {
//           const daysUntilDue = getDaysUntilDue(borrowedBook.dueDate, borrowedBook.returnDate);
//           const overdue = isOverdue(borrowedBook.dueDate, borrowedBook.returnDate); */}
          
//           return (
//             <div 
//               key={borrowedBook.id} 
//               className={`bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
//                 overdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
//               }`}
//             >
//               <div className="flex flex-col md:flex-row md:items-start md:justify-between">
//                 <div className="flex-1 mb-4 md:mb-0">
//                   <div className="flex items-start justify-between mb-2">
//                     <h3 className="text-xl font-semibold text-gray-800 mb-1">
//                       {borrowedBook.book.title}
//                     </h3>
//                     <div className="flex items-center space-x-2">
//                       {borrowedBook.returnDate ? (
//                         <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//                           Returned
//                         </span>
//                       ) : overdue ? (
//                         <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
//                           Overdue
//                         </span>
//                       ) : (
//                         <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//                           Active
//                         </span>
//                       )}
//                     </div>
//                   </div>
                  
//                   <p className="text-gray-600 mb-3">by {borrowedBook.book.author}</p>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
//                     <div className="flex items-center">
//                       <Calendar className="w-4 h-4 mr-2 text-gray-400" />
//                       <div>
//                         <span className="font-medium">Borrowed:</span>
//                         <span className="ml-1">{formatDate(borrowedBook.borrowDate)}</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center">
//                       <Clock className="w-4 h-4 mr-2 text-gray-400" />
//                       <div>
//                         <span className="font-medium">Due:</span>
//                         <span className={`ml-1 ${overdue ? 'text-red-600 font-medium' : ''}`}>
//                           {formatDate(borrowedBook.dueDate)}
//                         </span>
//                       </div>
//                     </div>
                    
//                     {borrowedBook.returnDate ? (
//                       <div className="flex items-center">
//                         <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
//                         <div>
//                           <span className="font-medium">Returned:</span>
//                           <span className="ml-1">{formatDate(borrowedBook.returnDate)}</span>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="flex items-center">
//                         <AlertCircle className={`w-4 h-4 mr-2 ${overdue ? 'text-red-500' : 'text-blue-500'}`} />
//                         <div>
//                           <span className="font-medium">
//                             {overdue ? 'Overdue by:' : 'Due in:'}
//                           </span>
//                           <span className={`ml-1 font-medium ${overdue ? 'text-red-600' : 'text-blue-600'}`}>
//                             {Math.abs(daysUntilDue || 0)} day{Math.abs(daysUntilDue || 0) !== 1 ? 's' : ''}
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {!borrowedBook.returnDate && (
//                   <div className="flex flex-col space-y-2 md:ml-6">
//                     <button
//                       onClick={() => handleReturnBook(borrowedBook.book.id)}
//                       disabled={returningBook}
//                       className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
//                     >
//                       {returningBook ? 'Returning...' : 'Return Book'}
//                     </button>
//                     {overdue && (
//                       <p className="text-xs text-red-600 text-center">
//                         Late fees may apply
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }