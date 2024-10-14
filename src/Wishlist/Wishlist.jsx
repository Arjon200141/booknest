import { useState } from "react";

const Wishlist = () => {
    const [wishlist,setWishlist]=useState(JSON.parse(localStorage.getItem("books")))
    const removeFromWishlist=id =>{
        const modwishlist= wishlist.filter(book=>book.id!==id)
        localStorage.setItem("books",JSON.stringify(modwishlist))
        setWishlist(modwishlist);
        alert("removed book successfully from wishlist")

    }

    return (
        <div>
            <p>{wishlist.length}</p>
            {
                wishlist.map((book) => (
                    <div key={book.id}>
                        <h3>Book ID: {book.id}</h3>
                        <h4>Title: {book.title}</h4>
                        <p>Authors: {book.authors.map((author) => author.name).join(", ")}</p>
                        <button id={book.id} className="border-2" onClick={()=>removeFromWishlist(book.id)} >remove from wishlist</button>
                    </div>
                ))
            }
            
        </div>
    );
};

export default Wishlist;