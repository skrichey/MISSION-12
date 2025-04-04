using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MISSION_11.API.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MISSION_11.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookstoreController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BookstoreController(BookstoreContext context)
        {
            _context = context;
        }

        // GET: api/bookstore (with optional category filtering + pagination)
        [HttpGet]
        public async Task<ActionResult> GetBooks(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 5,
            [FromQuery] string sortBy = "Title",
            [FromQuery] List<string> category = null)
        {
            var skip = (page - 1) * pageSize;
            IQueryable<Book> query = _context.Books;

            if (category != null && category.Any())
            {
                query = query.Where(b => category.Contains(b.Category));
            }

            query = sortBy == "Author"
                ? query.OrderBy(b => b.Author)
                : query.OrderBy(b => b.Title);

            var totalBooks = await query.CountAsync();
            var books = await query.Skip(skip).Take(pageSize).ToListAsync();

            return Ok(new { books, totalBooks });
        }

        // GET: api/bookstore/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }

        // GET: api/bookstore/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            return book == null ? NotFound() : Ok(book);
        }

        // POST: api/bookstore
        [HttpPost]
        public async Task<ActionResult<Book>> CreateBook([FromBody] Book newBook)
        {
            if (!ModelState.IsValid)
            {
                foreach (var key in ModelState.Keys)
                {
                    var state = ModelState[key];
                    foreach (var error in state.Errors)
                    {
                        Console.WriteLine($"{key}: {error.ErrorMessage}");
                    }
                }

                return BadRequest(ModelState);
            }

            _context.Books.Add(newBook);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = newBook.BookId }, newBook);
        }


        // PUT: api/bookstore/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Book updatedBook)
        {
            if (id != updatedBook.BookId) return BadRequest();

            _context.Entry(updatedBook).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/bookstore/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound();

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.BookId == id);
        }
    }
}
