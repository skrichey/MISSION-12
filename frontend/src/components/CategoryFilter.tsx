import { useState, useEffect } from 'react';
import './CategoryFilter.css';

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [categories, setCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('https://localhost:5000/api/bookstore/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      });
  }, []);

  function toggleCategory(cat: string) {
    setSelectedCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  }

  return (
    <div className="mb-3">
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle w-100"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          Filter by Category
        </button>

        {isOpen && (
          <div
            className="dropdown-menu show p-2 border"
            style={{ maxHeight: '200px', overflowY: 'auto', width: '100%' }}
          >
            {categories.map((cat) => (
              <div className="form-check" key={cat}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <label className="form-check-label" htmlFor={cat}>
                  {cat}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryFilter;
