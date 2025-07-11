import React from "react";
import { Link, NavLink } from "react-router";
import ProFastLogo from "../ProFastLogo/ProFastLogo";
import { GoArrowUpRight } from "react-icons/go";
import useAuth from "../../../Hooks/useAuth";

const Navbar = () => {
  const { user, logOutUser } = useAuth();
  const handleLogOut = () => {
    logOutUser()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const navItems = (
    <>
      <NavLink className="text-base font-medium mx-2 px-3 py-2" to="/">
        Home
      </NavLink>
      <NavLink className="text-base font-medium mx-2 px-3 py-2" to="/coverage">
        Coverage
      </NavLink>
      <NavLink
        className="text-base font-medium mx-2 px-3 py-2"
        to="/sendParcel"
      >
        Send Parcel
      </NavLink>
      {user && (
        <>
          <NavLink
            className="text-base font-medium mx-2 px-3 py-2"
            to="/dashboard"
          >
            Dashboard
          </NavLink>
          <NavLink
            className="text-base font-medium mx-2 px-3 py-2"
            to="/riderRegistration"
          >
            Be a Rider
          </NavLink>
        </>
      )}
      <NavLink className="text-base font-medium mx-2 px-3 py-2" to="/about">
        About Us
      </NavLink>
    </>
  );
  return (
    <div className="navbar rounded-xl backdrop-blur-2xl sticky top-0 z-[100]">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navItems}
          </ul>
        </div>
        <ProFastLogo />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <button
            className="btn bg-primary rounded-full ml-2"
            onClick={handleLogOut}
          >
            Logout
          </button>
        ) : (
          <>
            <Link className="btn rounded-full bg-transparent" to="/login">
              Sign In
            </Link>
            <Link className="btn bg-primary rounded-full ml-2" to="/register">
              Sign Up
            </Link>
            <GoArrowUpRight
              size={28}
              className="rounded-full bg-black text-green-400"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
