import { useState } from 'react';
import { Book } from '../types/Book';
import { updateBook } from '../api/BooksAPI';

interface Props {
  book: Book;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditBookForm = ({ book, onSuccess, onCancel }: Props) => {
  const [formData, setFormData] = useState<Book>({ ...book });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBook(formData.bookId, formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h3>Edit Book</h3>
      {['title', 'author', 'publisher', 'isbn', 'category'].map((field) => (
        <div className="mb-2" key={field}>
          <label className="form-label">{field}:</label>
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

      <button className="btn btn-primary me-2" type="submit">Update</button>
      <button className="btn btn-secondary" onClick={onCancel} type="button">Cancel</button>
    </form>
  );
};

export default EditBookForm;
