import { useState } from 'react';
import { Book } from '../types/Book';
import { addBook } from '../api/BooksAPI';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewBookForm = ({ onSuccess, onCancel }: Props) => {
  const [formData, setFormData] = useState<Omit<Book, 'bookId'>>({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    category: '',
    pageCount: 0,
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBook(formData);
      onSuccess();
    } catch (err) {
      console.error('Add failed:', err);
      alert('Failed to add book. Check console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Book</h3>
      {['title', 'author', 'publisher', 'isbn', 'classification', 'category'].map((field) => (
        <div className="mb-2" key={field}>
          <label className="form-label">
            {field.charAt(0).toUpperCase() + field.slice(1)}:
          </label>
          <input
            className="form-control"
            name={field}
            value={(formData as any)[field]}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      <div className="mb-2">
        <label className="form-label">Pages:</label>
        <input
          className="form-control"
          name="pageCount"
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formData.pageCount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-2">
        <label className="form-label">Price:</label>
        <input
          className="form-control"
          name="price"
          type="number"
          step="0.01"
          inputMode="decimal"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <button className="btn btn-success me-2" type="submit">Add</button>
      <button className="btn btn-secondary" type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default NewBookForm;
