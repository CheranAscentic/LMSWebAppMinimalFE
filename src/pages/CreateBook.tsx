import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import apiService, { type Book } from '../services/ApiServices';
import Loading from '@/components/ui/loading';

interface CreateBookProps {
  onSuccess?: () => void;
}

export function CreateBook({ onSuccess }: CreateBookProps) {
  const { loading, error, execute } = useApi<Book>();
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    year: '',
    synopsis: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute(() =>
      apiService.createBook({
        ...form,
        year: parseInt(form.year, 10),
      })
    );
    if (onSuccess) onSuccess();
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            required
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Author</label>
          <input
            required
            name="author"
            value={form.author}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            required
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="E.g. Fiction, Science, etc."
          />
        </div>
        <div>
          <label className="block font-medium mb-1">ISBN</label>
          <input
            required
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Publication Year</label>
          <input
            required
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Synopsis</label>
          <textarea
            required
            name="synopsis"
            value={form.synopsis}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>
        {error && (
          <div className="text-red-600 bg-red-50 px-3 py-2 rounded">{error}</div>
        )}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? <Loading /> : 'Add Book'}
        </button>
      </form>
    </div>
  );
}