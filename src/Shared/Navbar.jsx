import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { IoMenuSharp } from "react-icons/io5";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navlinks = (
        <>
            <NavLink 
                to="/" 
                className={({ isActive }) =>
                    isActive
                        ? "hover:text-blue-500 underline"
                        : "hover:text-blue-500"
                }
            >
                <li>Home</li>
            </NavLink>
            <NavLink 
                to="/wishlist" 
                className={({ isActive }) =>
                    isActive
                        ? "hover:text-blue-500 underline"
                        : "hover:text-blue-500"
                }
            >
                <li>Wishlist</li>
            </NavLink>
        </>
    );

    return (
        <div className="w-full bg-slate-50">
            <div className="flex items-center justify-between px-8 py-1">
                <Link to="/">
                    <img
                        src="https://i.ibb.co/6Bxgxqk/199943135.png"
                        alt="Logo"
                        className="h-16 w-32"
                    />
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex text-xl font-semibold gap-12">
                    {navlinks}
                </ul>
                <div>

                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-2xl focus:outline-none"
                >
                <IoMenuSharp />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <ul className="flex flex-col items-center gap-6 text-xl font-semibold py-4">
                        {navlinks}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;
