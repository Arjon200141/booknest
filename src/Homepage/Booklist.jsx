import { useEffect, useState, useCallback, useRef } from "react";
import { FaRegHeart } from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import Swal from "sweetalert2";

const Booklist = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const abortControllerRef = useRef(new AbortController());

    const fetchBooks = useCallback(async (url) => {
        setLoading(true);
        setError(null);

        try {
            abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();

            const response = await fetch(url, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) throw new Error("Failed to fetch books.");
            const data = await response.json();

            setBooks(data.results);
            setFilteredBooks(data.results);
            setNextPage(data.next);
            setPreviousPage(data.previous);

            const uniqueGenres = [...new Set(data.results.flatMap(book => book.subjects))];
            setGenres(uniqueGenres);
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Error fetching books:", error);
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const setTowishlist = (book) => {
        const books = localStorage.getItem("books");
        if (!books) {
            localStorage.setItem("books", JSON.stringify([book]))

        }
        else {

            const newbooks = JSON.parse(books);
            const exists = newbooks.find(bookr => bookr.id === book.id) !== undefined
            if (exists) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "The book has been already in the wishlist"
                });
            }
            else {
                newbooks.push(book);
                localStorage.setItem("books", JSON.stringify(newbooks))
                console.log(JSON.parse(localStorage.getItem("books")));
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${book.title} has been added to the Wishlist`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    }

    useEffect(() => {
        fetchBooks("https://gutendex.com/books");
        return () => abortControllerRef.current.abort();
    }, [fetchBooks]);


    useEffect(() => {
        const filtered = books.filter(book =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredBooks(
            selectedGenre
                ? filtered.filter(book => book.subjects.includes(selectedGenre))
                : filtered
        );
    }, [searchQuery, selectedGenre, books]);

    return (
        <div className="my-8">
            <h1 className="text-4xl font-semibold text-center mb-8">Book List</h1>

            <div className="flex justify-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by title..."
                    className="border px-4 py-2 rounded w-1/3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select
                    className="border px-4 py-2 rounded"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <p className="text-3xl text-center font-semibold my-8">Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <div className="overflow-x-auto mx-6">
                    <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-1 py-2 text-center">Book Id</th>
                                <th className="border px-4 py-2 text-center">Cover</th>
                                <th className="border px-4 py-2 text-center">Book Title</th>
                                <th className="border px-4 py-2 text-center">Authors</th>
                                <th className="border px-4 py-2 text-center">Genre</th>
                                <th className="border px-4 py-2 text-center col-span-2" colSpan={2}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">

                            {filteredBooks.map((book) => (
                                <tr key={book.id} className="even:bg-gray-50">
                                    <td className="border px-4 py-2">{book.id}</td>
                                    <td className="border p-3">
                                        <img
                                            src={book.formats["image/jpeg"] || ""}
                                            alt={book.title || "No Cover"}
                                            className="h-16 w-14 object-cover"
                                        />
                                    </td>
                                    <td className="border px-4 py-2">{book.title || "N/A"}</td>
                                    <td className="border px-4 py-2">
                                        {book.authors.map((author) => author.name).join(", ") || "N/A"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {book.subjects.join(", ") || "N/A"}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        <button className="btn btn-ghost btn-xs" onClick={() => setTowishlist(book)}>
                                            Add to Wishlist <span className="text-center flex justify-center"><FaRegHeart /></span>
                                        </button>
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        <button className="text-md">
                                            <span className="flex justify-center"><ImInfo /></span>  Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex gap-4 justify-center my-8">
                <button
                    className="bg-gray-50 rounded-md px-6 py-2 text-black font-semibold text-xl"
                    onClick={() => fetchBooks(previousPage)}
                    disabled={!previousPage || loading}
                >
                    Previous Page
                </button>

                <button
                    className="bg-gray-50 rounded-md px-6 py-2 text-black font-semibold text-xl"
                    onClick={() => fetchBooks(nextPage)}
                    disabled={!nextPage || loading}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default Booklist;
