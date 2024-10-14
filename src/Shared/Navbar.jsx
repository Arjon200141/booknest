import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
    const navlinks = <>
        <NavLink to="/"><li>Home</li></NavLink>
        <NavLink to="/wishlist"><li>Wishlist</li></NavLink>
    </>
    return (
        <div className="flex items-center justify-between bg-slate-50">
            <Link to="/">
                <img src="https://i.ibb.co.com/6Bxgxqk/199943135.png" alt="" className="h-16 w-32 ml-8" />
            </Link>
            <div className="">
                <ul className="text-xl font-semibold flex justify-center gap-12">
                    {navlinks}
                </ul>
            </div>
            <div>

            </div>
        </div>
    );
};

export default Navbar;