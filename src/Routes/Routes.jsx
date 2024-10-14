import {
    createBrowserRouter
  } from "react-router-dom";
import Root from "../Root/Root";
import Homepage from "../Homepage/Homepage";
import Wishlist from "../Wishlist/Wishlist";
import BookDetails from "../BookDetails/BookDetails";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Root></Root>,
      children:[
        {
          path:"/",
          element:<Homepage></Homepage>
        },
        {
          path:"/wishlist",
          element:<Wishlist></Wishlist>
        },
        {
          path: "/books/:bookId",
          element: <BookDetails></BookDetails>,
          loader: ({ params }) =>fetch(`https://gutendex.com/books/${params.bookId}`),
      },
      ]
    },
  ]);

export default router;