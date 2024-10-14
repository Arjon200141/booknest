import {
    createBrowserRouter
  } from "react-router-dom";
import Root from "../Root/Root";
import Homepage from "../Homepage/Homepage";
import Wishlist from "../Wishlist/Wishlist";

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
        }
      ]
    },
  ]);

export default router;