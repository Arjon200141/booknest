import { IoPerson } from "react-icons/io5";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

const BookDetails = () => {
    const book = useLoaderData();

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

    return (
        <div className="flex justify-between gap-6 mx-36 my-12">
            <div className="flex-1">
                <img src={book.formats["image/jpeg"]} alt="" className="h-full" />
            </div>
            <div className="flex-1">
                <h2 className="text-4xl font-semibold mb-3">Title : {book.title}</h2>
                <div className="mb-3">
                    {
                        book.authors.map((author) => <ul className="flex items-center gap-2 text-lg" key={author.name}>
                            <IoPerson />{author.name}
                        </ul>)
                    }
                </div>
                <div className="flex gap-36">
                    <p className="text-lg mb-3"><span className="font-semibold">Book Id : </span>{book.id}</p>
                
                    <p className="text-lg mb-3"><span className="font-semibold">Languages : </span>{book.languages}</p>
                </div>
                <div className="flex justify-between gap-6">
                    <div className="flex-1">
                        <span className="text-xl font-semibold">Subjects : </span>
                        {
                            book.subjects.map((subject) => <ul className="list-disc flex items-center gap-2 text-md" key={subject.name}>
                                <li className="ml-8">{subject}</li>
                            </ul>)
                        }
                    </div>
                    
                    <div className="flex-1">
                        <span className="text-xl font-semibold">Bookshelves : </span>
                        {
                            book.bookshelves.map((bookshelf) => <ul className="list-disc flex items-center gap-2 text-md" key={bookshelf.name}>
                                <li className="ml-8">{bookshelf}</li>
                            </ul>)
                        }
                    </div>
                </div>
                <div className="ml-4">
                    <button onClick={() => setTowishlist(book)} className="btn border-2 border-black rounded-md px-6 py-2 text-xl font-semibold w-full mt-6 bg-lime-100/35">Add to Wishlist</button>
                </div>
                
            </div>
        </div>
    );
};

export default BookDetails;