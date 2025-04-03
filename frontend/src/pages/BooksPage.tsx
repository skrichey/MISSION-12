import { useEffect, useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import CartSummary from '../components/CartSummary';
import { Book } from '../types/Book';
import { useCart } from '../context/CartContext';
import { fetchBooks } from '../api/BooksAPI';
import { Pagination } from '../components/Pagination';

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [sortBy] = useState<string>('Title');
  const [categories, setCategories] = useState<string[]>([]);
  const { addToCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(pageNum, pageSize, categories); 
        setBooks(data.items);
        setTotalBooks(data.totalItems);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageNum, pageSize, categories, sortBy]);

  if (loading) return <div className="text-center">Loading Books...</div>;
  if (error) return <div className="text-center text-danger">Error: {error}</div>;

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-end mb-3 me-4">
        <CartSummary />
      </div>

      <div className="row justify-content-center">
        <div className="col-md-2 mb-4">
          <div className="sticky-top pt-3">
            <CategoryFilter
              selectedCategories={categories}
              setSelectedCategories={setCategories}
            />
          </div>
        </div>

        <div className="col-md-10 col-lg-9">
          <h1 className="text-center mb-4">Bookstore</h1>

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

          <div className="text-end text-muted mt-3">
            Showing {(pageNum - 1) * pageSize + 1} - {Math.min(pageNum * pageSize, totalBooks)} of {totalBooks} books
          </div>

          <Pagination
            currentPage={pageNum}
            totalPages={Math.ceil(totalBooks / pageSize)}
            pageSize={pageSize}
            onPageChange={setPageNum}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPageNum(1);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
