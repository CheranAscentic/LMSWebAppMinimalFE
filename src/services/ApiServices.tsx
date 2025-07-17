interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  status: number;
  data: T;
  error: string | null;
}

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  requiresAuth?: boolean;
  headers?: Record<string, string>;
}

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  availableCopies: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  type: string;
}

interface LoginData {
  user: User;
  token: string;
  expiresAt: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  userType: string;
}

interface BookData {
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  availableCopies: number;
}

interface UpdateBookData extends Partial<BookData> {
  id?: number;
}

interface UserData {
  name: string;
  email: string;
  type: string;
  password?: string;
}

interface UpdateUserData extends Partial<UserData> {
  id?: number;
}

interface BorrowedBook {
  id: number;
  bookId: number;
  memberId: number;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  book: Book;
}

class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5245';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async makeRequest<T = unknown>(
    endpoint: string, 
    options: RequestOptions
  ): Promise<ApiResponse<T>> {
    const { method, body, requiresAuth = false, headers = {} } = options;
    
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
      ...(requiresAuth ? this.getAuthHeaders() : {})
    };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body) {
      requestConfig.body = JSON.stringify({ data: body });
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, requestConfig);
      
      if (response.status === 401) {
        this.handleAuthError();
        throw new Error('Authentication required');
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || data.message);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  private handleAuthError(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
  }

  async login(email: string, password: string): Promise<ApiResponse<LoginData>> {
    return this.makeRequest<LoginData>('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    });
  }

  async register(userData: RegisterData): Promise<ApiResponse<string>> {
    console.log('Sending registration data:', userData); // Debug log
    
    const apiData = (({ ...rest }) => rest)(userData);
    
    return this.makeRequest<string>('/api/auth/register', {
      method: 'POST',
      body: apiData 
    });
  }

  async logout(): Promise<ApiResponse<string>> {
    return this.makeRequest<string>('/api/auth/logout', {
      method: 'POST',
      requiresAuth: true
    });
  }

  async getUserTypes(): Promise<ApiResponse<string[]>> {
    return this.makeRequest<string[]>('/api/auth/usertypes', {
      method: 'GET'
    });
  }


  async getAllBooks(): Promise<ApiResponse<Book[]>> {
    return this.makeRequest<Book[]>('/api/books/list', {
      method: 'POST',
      body: {}
    });
  }

  async getBook(bookId: number): Promise<ApiResponse<Book>> {
    return this.makeRequest<Book>('/api/books/get', {
      method: 'POST',
      body: { bookId }
    });
  }

  async createBook(bookData: BookData): Promise<ApiResponse<Book>> {
    return this.makeRequest<Book>('/api/books/', {
      method: 'POST',
      body: bookData,
      requiresAuth: true
    });
  }

  async updateBook(bookId: number, bookData: UpdateBookData): Promise<ApiResponse<Book>> {
    return this.makeRequest<Book>('/api/books/', {
      method: 'PUT',
      body: { bookId, ...bookData },
      requiresAuth: true
    });
  }

  async deleteBook(bookId: number): Promise<ApiResponse<string>> {
    return this.makeRequest<string>('/api/books/', {
      method: 'DELETE',
      body: { bookId },
      requiresAuth: true
    });
  }

  // User endpoints
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.makeRequest<User[]>('/api/users/list', {
      method: 'POST',
      body: {},
      requiresAuth: true
    });
  }

  async getUser(userId: number): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/api/users/get', {
      method: 'POST',
      body: { userId },
      requiresAuth: true
    });
  }

  async createUser(userData: UserData): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/api/users/', {
      method: 'POST',
      body: userData,
      requiresAuth: true
    });
  }

  async updateUser(userId: number, userData: UpdateUserData): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/api/users/', {
      method: 'PUT',
      body: { userId, ...userData },
      requiresAuth: true
    });
  }

  async deleteUser(userId: number): Promise<ApiResponse<string>> {
    return this.makeRequest<string>('/api/users/', {
      method: 'DELETE',
      body: { userId },
      requiresAuth: true
    });
  }

  // Borrowing endpoints
  async borrowBook(memberId: number, bookId: number): Promise<ApiResponse<string>> {
    return this.makeRequest<string>('/api/borrowing/borrow', {
      method: 'POST',
      body: { memberId, bookId },
      requiresAuth: true
    });
  }

  async returnBook(memberId: number, bookId: number): Promise<ApiResponse<string>> {
    return this.makeRequest<string>('/api/borrowing/return', {
      method: 'POST',
      body: { memberId, bookId },
      requiresAuth: true
    });
  }

  async getBorrowedBooks(memberId: number): Promise<ApiResponse<BorrowedBook[]>> {
    return this.makeRequest<BorrowedBook[]>('/api/borrowing/member/books', {
      method: 'POST',
      body: { memberId },
      requiresAuth: true
    });
  }
}

export default new ApiService();

// Export types for use in other files
export type { Book, User, LoginData, RegisterData, BookData, UpdateBookData, UserData, UpdateUserData, BorrowedBook, ApiResponse };