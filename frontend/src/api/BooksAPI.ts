import { Book } from '../types/Book';

interface FetchBooksResponse {
  items: Book[];
  totalItems: number;
}

export const fetchBooks = async (
  pageNum: number,
  pageSize: number,
  categories: string[]
): Promise<FetchBooksResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: pageNum.toString(),
      pageSize: pageSize.toString()
    });

    categories.forEach(cat => {
      queryParams.append('category', cat);
    });

    const response = await fetch(
      `https://localhost:5000/api/bookstore?${queryParams.toString()}`
    );

    if (!response.ok) throw new Error('Failed to fetch books');

    const data = await response.json();
    return {
      items: data.books || [],
      totalItems: data.totalBooks || 0
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    return { items: [], totalItems: 0 };
  }
};

// AddBook expects everything *except* bookId
export const addBook = async (book: Omit<Book, 'bookId'>): Promise<void> => {
  const response = await fetch(`https://localhost:5000/api/bookstore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error('Failed to add book');
  }
};


export const updateBook = async (bookId: number, book: Book): Promise<void> => {
  const response = await fetch(`https://localhost:5000/api/bookstore/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  });

  if (!response.ok) throw new Error('Failed to update book');
};

export const deleteBook = async (bookId: number): Promise<void> => {
  const response = await fetch(`https://localhost:5000/api/bookstore/${bookId}`, {
    method: 'DELETE'
  });

  if (!response.ok) throw new Error('Failed to delete book');
};
