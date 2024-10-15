import { IoPerson } from "react-icons/io5";
import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

const BookDetails = () => {
    const book = useLoaderData();
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
        setWishlist(storedBooks);
    }, []);

    const isBookInWishlist = wishlist.some(
        (wishlistBook) => wishlistBook.id === book.id
    );

    const addToWishlist = (book) => {
        const newWishlist = [...wishlist, book];
        localStorage.setItem("books", JSON.stringify(newWishlist));
        setWishlist(newWishlist);
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${book.title} has been added to the Wishlist`,
            showConfirmButton: false,
            timer: 1500,
        });
        navigate("/wishlist");
    };

    const removeFromWishlist = (id) => {
        const updatedWishlist = wishlist.filter(
            (wishlistBook) => wishlistBook.id !== id
        );
        localStorage.setItem("books", JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist);
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "The book has been removed from Wishlist!!",
            showConfirmButton: false,
            timer: 1500,
        });
        navigate("/wishlist");
    };

    return (
        <div className="flex justify-between gap-6 mx-36 my-12">
            <div className="flex-1">
                <img data-aos="flip-right"
     data-aos-easing="ease-out-cubic"
     data-aos-duration="2000"
                    src={book.formats["image/jpeg"]}
                    alt=""
                    className="h-full"
                />
            </div>
            <div className="flex-1">
                <h2 className="text-4xl font-semibold mb-3">
                    Title :{" "}
                    <Typewriter
                        words={[book.title]}
                        loop={false}
                        cursor
                        cursorStyle="|"
                        typeSpeed={80}
                        deleteSpeed={50}
                        delaySpeed={1000}
                    />
                </h2>
                <div className="mb-3">
                    {book.authors.map((author) => (
                        <ul
                            className="flex items-center gap-2 text-lg"
                            key={author.name}
                        >
                            <IoPerson />
                            {author.name}
                        </ul>
                    ))}
                </div>
                <div className="flex gap-36">
                    <p className="text-lg mb-3">
                        <span className="font-semibold">Book Id : </span>
                        {book.id}
                    </p>
                    <p className="text-lg mb-3">
                        <span className="font-semibold">Languages : </span>
                        {book.languages.join(", ")}
                    </p>
                </div>
                <div className="flex justify-between gap-6">
                    <div className="flex-1">
                        <span className="text-xl font-semibold">
                            Subjects :{" "}
                        </span>
                        {book.subjects.map((subject) => (
                            <ul
                                className="list-disc flex items-center gap-2 text-md"
                                key={subject}
                            >
                                <li className="ml-8">{subject}</li>
                            </ul>
                        ))}
                    </div>
                    <div className="flex-1">
                        <span className="text-xl font-semibold">
                            Bookshelves :{" "}
                        </span>
                        {book.bookshelves.map((bookshelf) => (
                            <ul
                                className="list-disc flex items-center gap-2 text-md"
                                key={bookshelf}
                            >
                                <li className="ml-8">{bookshelf}</li>
                            </ul>
                        ))}
                    </div>
                </div>
                <div className="ml-4">
                    {isBookInWishlist ? (
                        <button
                            onClick={() => removeFromWishlist(book.id)}
                            className="btn border-2 border-black rounded-md px-6 py-2 text-xl font-semibold w-full mt-6 bg-red-200"
                        >
                            Remove from Wishlist
                        </button>
                    ) : (
                        <button
                            onClick={() => addToWishlist(book)}
                            className="btn border-2 border-black rounded-md px-6 py-2 text-xl font-semibold w-full mt-6 bg-lime-100/35"
                        >
                            Add to Wishlist
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
