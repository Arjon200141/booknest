import { useEffect, useState, useCallback } from "react";

const Booklist = () => {
    const [books, setBooks] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchBooks = useCallback(async (url) => {
        setLoading(true);
        try {
            const response = await fetch(url);
            const data = await response.json();

            // Batch state updates for better performance
            setBooks(data.results);
            setNextPage(data.next);
            setPreviousPage(data.previous);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch on component mount
    useEffect(() => {
        fetchBooks('https://gutendex.com/books');
    }, [fetchBooks]);

    return (
        <>
            <h1>Book List</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                books.map((book) => (
                    <div key={book.id}>
                        <h3>Book ID: {book.id}</h3>
                        <h4>Title: {book.title}</h4>
                        <p>Authors: {book.authors.map((author) => author.name).join(", ")}</p>
                    </div>
                ))
            )}

            {/* Pagination Buttons */}
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={() => previousPage && fetchBooks(previousPage)}
                    disabled={!previousPage}
                    style={{ marginRight: "10px" }}
                >
                    Previous
                </button>

                <button
                    onClick={() => nextPage && fetchBooks(nextPage)}
                    disabled={!nextPage}
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default Booklist;
