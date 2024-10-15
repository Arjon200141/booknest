import { useState} from "react";
import { ImInfo } from "react-icons/im";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = JSON.parse(localStorage.getItem("books"));
        return savedWishlist || [];
    });

    const removeFromWishlist = (id) => {
        const modwishlist = wishlist.filter((book) => book.id !== id);
        localStorage.setItem("books", JSON.stringify(modwishlist));
        setWishlist(modwishlist);

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `The book has been removed from Wishlist!!`,
            showConfirmButton: false,
            timer: 1500,
        });
    };

    return (
        <div>
            <p className="text-3xl my-5 text-center font-semibold">
                Books Added in the Wishlist: {wishlist.length}
            </p>
            <div className="overflow-x-auto mb-12 mx-6">
                <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 text-lg">
                            <th className="border px-1 py-2 text-center">Book Id</th>
                            <th className="border px-4 py-2 text-center">Cover</th>
                            <th className="border px-4 py-2 text-center">Book Title</th>
                            <th className="border px-4 py-2 text-center">Authors</th>
                            <th className="border px-4 py-2 text-center">Genre</th>
                            <th className="border px-4 py-2 text-center" colSpan={2}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {wishlist.length > 0 ? (
                            wishlist.map((book) => (
                                <tr key={book.id} className="even:bg-gray-50 text-md text-center">
                                    <td className="border px-4 py-2">{book.id}</td>
                                    <td className="border p-3">
                                        <img
                                            src={book.formats?.["image/jpeg"] || ""}
                                            alt={book.title || "No Cover"}
                                            className="h-16 w-14 object-cover"
                                        />
                                    </td>
                                    <td className="border px-4 py-2">{book.title || "N/A"}</td>
                                    <td className="border px-4 py-2">
                                        {book.authors
                                            ? book.authors.map((author) => author.name).join(", ")
                                            : "N/A"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {book.subjects ? book.subjects.join(", ") : "N/A"}
                                    </td>
                                    <td>
                                        <button
                                            id={book.id}
                                            className="px-4 py-2 text-center"
                                            onClick={() => removeFromWishlist(book.id)}
                                        >
                                            <span className="flex justify-center text-xl">
                                                <MdDeleteForever />
                                            </span>
                                            Remove
                                        </button>
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        <Link to={`/books/${book.id}`}>
                                            <button className="text-md font-semibold">
                                                <span className="flex justify-center">
                                                    <ImInfo />
                                                </span>
                                                Details
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-4">
                                    No books in the wishlist.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Wishlist;
