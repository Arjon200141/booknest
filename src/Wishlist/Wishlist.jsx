import { useState } from "react";
import { ImInfo } from "react-icons/im";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

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
            <p className="md:text-4xl my-6 md:my-10 text-center md:font-semibold">
                Books Added in the Wishlist: {wishlist.length}
            </p>
            <div className="md:overflow-x-auto md:mb-12 md:mx-6">
                <table className="md:w-auto md:table-auto md:border-collapse border border-gray-300 md:text-left">
                    <thead>
                        <tr className="bg-gray-100 md:text-lg">
                            <th className="border md:px-1 py-2 md:text-center">Book Id</th>
                            <th className="border md:px-4 py-2 md:text-center">Cover</th>
                            <th className="border md:px-4 py-2 md:text-center">Book Title</th>
                            <th className="border md:px-4 py-2 md:text-center">Authors</th>
                            <th className="border md:px-4 py-2 md:text-center">Genre</th>
                            <th className="border md:px-4 py-2 md:text-center" colSpan={2}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {wishlist.length > 0 ? (
                            wishlist.map((book) => (
                                <tr key={book.id} className="even:bg-gray-50 md:text-md md:text-center">
                                    <td className="border md:px-4 py-2">{book.id}</td>
                                    <td className="border md:p-3">
                                        <img data-aos="flip-left"
                                            data-aos-easing="ease-out-cubic"
                                            data-aos-duration="1000"
                                            src={book.formats?.["image/jpeg"] || ""}
                                            alt={book.title || "No Cover"}
                                            className="md:h-16 md:w-14 md:object-cover"
                                        />
                                    </td>
                                    <td className="border md:px-4 md:py-2">{book.title || "N/A"}</td>
                                    <td className="border md:px-4 md:py-2">
                                        {book.authors
                                            ? book.authors.map((author) => author.name).join(", ")
                                            : "N/A"}
                                    </td>
                                    <td className="border md:px-4 md:py-2">
                                        {book.subjects ? book.subjects.join(", ") : "N/A"}
                                    </td>
                                    <td>
                                        <button
                                            id={book.id}
                                            className="md:px-4 md:py-2 md:text-center"
                                            onClick={() => removeFromWishlist(book.id)}
                                        >
                                            <span className="flex justify-center text-xl">
                                                <MdDeleteForever />
                                            </span>
                                            Remove
                                        </button>
                                    </td>
                                    <td className="border md:px-4 md:py-2 md:text-center">
                                        <Link to={`/books/${book.id}`}>
                                            <button  className="md:text-md md:font-semibold">
                                                <span className="md:flex md:justify-center">
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
                                <td colSpan={7} className="text-center md:py-4">
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
