import { useEffect, useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import CartSummary from '../components/CartSummary';
import { Book } from '../types/Book';
import { useCart } from '../context/CartContext';
import 'bootstrap';

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [sortBy] = useState<string>('Title');
  const [categories, setCategories] = useState<string[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const categoryParams = categories.map(c => `category=${encodeURIComponent(c)}`).join('&');
    const url = `https://localhost:5000/api/bookstore?page=${pageNum}&pageSize=${pageSize}&sortBy=${sortBy}${categoryParams ? `&${categoryParams}` : ''}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch books');
        return res.json();
      })
      .then(data => {
        setBooks(data.books);
        setTotalBooks(data.totalBooks);
      })
      .catch(err => {
        console.error(err);
        setBooks([]);
        setTotalBooks(0);
      });
  }, [pageNum, pageSize, categories]);

  const totalPages = Math.ceil(totalBooks / pageSize);

  const handlePageChange = (newPageNum: number) => {
    if (newPageNum > 0 && newPageNum <= totalPages) {
      setPageNum(newPageNum);
    }
  };

  return (
    <div className="container-fluid mt-4">
      {/* Cart Summary aligned top-right */}
      <div className="d-flex justify-content-end mb-3 me-4">
        <CartSummary />
      </div>

      <div className="row justify-content-center">
        {/* Filter Sidebar with reduced width */}
        <div className="col-md-2 mb-4">
          <div className="sticky-top pt-3">
            <CategoryFilter
              selectedCategories={categories}
              setSelectedCategories={setCategories}
            />
          </div>
        </div>

        {/* Main Book Content */}
        <div className="col-md-10 col-lg-9">
          <h1 className="text-center mb-4">Bookstore</h1>

          {/* Page Size Dropdown */}
          <div className="d-flex justify-content-end mb-3">
            <label htmlFor="pageSize" className="me-2">Results per page:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNum(1);
              }}
              className="form-select w-auto"
            >
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="18">18</option>
            </select>
          </div>

          {/* Book Cards */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 justify-content-center">
            {books.map((b) => (
              <div className="col" key={b.bookId}>
                <div className="card h-100 shadow-sm text-center">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title">{b.title}</h5>
                    <p className="card-text"><strong>Author:</strong> {b.author}</p>
                    <p className="card-text"><strong>Publisher:</strong> {b.publisher}</p>
                    <p className="card-text"><strong>ISBN:</strong> {b.isbn}</p>
                    <p className="card-text"><strong>Category:</strong> {b.category}</p>
                    <p className="card-text"><strong>Pages:</strong> {b.pageCount}</p>
                    <p className="card-text"><strong>Price:</strong> ${b.price.toFixed(2)}</p>
                    <button
                      className="btn btn-outline-primary mt-3"
                      onClick={() =>
                        addToCart({
                          bookId: b.bookId,
                          title: b.title,
                          quantity: 1,
                          price: b.price,
                        })
                      }
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div>
              Showing {(pageNum - 1) * pageSize + 1} - {Math.min(pageNum * pageSize, totalBooks)} of {totalBooks} books
            </div>
            <div className="d-flex align-items-center">
              <button
                onClick={() => handlePageChange(pageNum - 1)}
                disabled={pageNum === 1}
                className="btn btn-outline-secondary me-2"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`btn ${pageNum === i + 1 ? 'btn-secondary' : 'btn-outline-secondary'} me-2`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pageNum + 1)}
                disabled={pageNum === totalPages}
                className="btn btn-outline-secondary"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
