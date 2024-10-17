import { useEffect, useState, useCallback, useRef } from "react";
import { FaRegHeart } from "react-icons/fa";
import { ImInfo } from "react-icons/im";
import { PiGreaterThanLight, PiLessThanLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FcLike } from "react-icons/fc";

const Booklist = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [searchQuery, setSearchQuery] = useState(
        localStorage.getItem("searchQuery") || ""
    );
    const [selectedGenre, setSelectedGenre] = useState(
        localStorage.getItem("selectedGenre") || ""
    );
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = JSON.parse(localStorage.getItem("books"));
        return savedWishlist || [];
    });

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
    const removeFromWishlist = (id) => {
        const modwishlist = wishlist.filter((book) => book.id !== id);
        localStorage.setItem("books", JSON.stringify(modwishlist));
        setWishlist(modwishlist);

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "The book has been removed from Wishlist!!",
            showConfirmButton: false,
            timer: 1500,
        });
    };

    const setTowishlist = (book) => {
        const books = localStorage.getItem("books");
        let newWishlist;

        if (!books) {
            newWishlist = [book];
            localStorage.setItem("books", JSON.stringify(newWishlist));
            setWishlist(newWishlist);
        } else {
            newWishlist = JSON.parse(books);
            const exists = newWishlist.some(b => b.id === book.id);

            if (exists) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "The book is already in the wishlist.",
                });
            } else {
                newWishlist.push(book);
                localStorage.setItem("books", JSON.stringify(newWishlist));
                setWishlist(newWishlist);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${book.title} has been added to the Wishlist.`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
    };

    useEffect(() => {
        localStorage.setItem("searchQuery", searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        localStorage.setItem("selectedGenre", selectedGenre);
    }, [selectedGenre]);

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
        setWishlist(JSON.parse(localStorage.getItem("books")));
        console.log(wishlist);
    }, [searchQuery, selectedGenre, books]);

    return (
        <div className="my-4 md:my-8">
            <div className="md:flex justify-center gap-4 mx-24 mb-6">
                <input
                    type="text"
                    placeholder="Search books by title..."
                    className="border mb-4 md:mb-0 px-4 py-2 rounded md:w-auto"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select
                    className="border md:px-4 py-2 rounded flex justify-center w-1/2 md:w-auto"
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

            {loading && <p className="md:text-5xl text-center font-semibold my-8">Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <div className="md:overflow-x-auto md:mx-6">
                    <table className="md:w-full md:table-auto md:border-collapse border border-gray-300 md:text-left">
                        <thead>
                            <tr className="bg-gray-100 md:text-lg">
                                <th className="border md:px-1 md:py-2">Book Id</th>
                                <th className="border md:px-4 md:py-2">Cover</th>
                                <th className="border md:px-4 md:py-2">Book Title</th>
                                <th className="border md:px-4 md:py-2">Authors</th>
                                <th className="border md:px-4 md:py-2">Genre</th>
                                <th className="border md:px-4 md:py-2" colSpan={2}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="md:text-md">
                            {filteredBooks.map((book) => {
                                const isInWishlist = wishlist?.some(item => item.id === book.id);
                                return (
                                    <tr key={book.id} className="even:bg-gray-50">
                                        <td className="border md:px-4 md:py-2">{book.id}</td>
                                        <td className="border md:p-3">
                                            <img
                                                src={book.formats["image/jpeg"] || ""}
                                                alt={book.title || "No Cover"}
                                                className="md:h-16 md:w-14 object-cover"
                                            />
                                        </td>
                                        <td className="border md:px-4 md:py-2">{book.title || "N/A"}</td>
                                        <td className="border md:px-4 md:py-2">
                                            {book.authors.map((author) => author.name).join(", ") || "N/A"}
                                        </td>
                                        <td className="border md:px-4 py-2">
                                            {book.subjects.join(", ") || "N/A"}
                                        </td>
                                        <td className="border md:px-4 py-2">
                                            <Link to={'/'}>
                                                <button className=" font-semibold" onClick={() => { isInWishlist ? removeFromWishlist(book.id) : setTowishlist(book) }}>
                                                    {isInWishlist ? "In Wishlist" : "Add to Wishlist"} <span className="text-center text-xl flex justify-center">{isInWishlist ? <FcLike /> : <FaRegHeart />}</span>
                                                </button>
                                            </Link>
                                        </td>
                                        <td className="border md:px-4 md:py-2">
                                            <Link to={`/books/${book.id}`}>
                                                <button className="text-md font-semibold">
                                                    <span className="text-center flex justify-center"><ImInfo /></span> Details
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )
            }

            <div className="flex gap-4 justify-center my-8">
                <button
                    className="bg-gray-100 flex items-center gap-2 rounded-md px-6 py-2 text-xl font-semibold"
                    onClick={() => fetchBooks(previousPage)}
                    disabled={!previousPage || loading}
                >
                    <PiLessThanLight /> Previous Page
                </button>
                <button
                    className="bg-gray-100 flex items-center gap-2 rounded-md px-6 py-2 text-xl font-semibold"
                    onClick={() => fetchBooks(nextPage)}
                    disabled={!nextPage || loading}
                >
                    Next Page <PiGreaterThanLight />
                </button>
            </div>
        </div >
    );
};

export default Booklist;