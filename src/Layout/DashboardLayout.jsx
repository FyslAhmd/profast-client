import React from "react";
import { NavLink, Outlet } from "react-router";
import ProFastLogo from "../Pages/Shared/ProFastLogo/ProFastLogo";
import {
  FaHome,
  FaBoxOpen,
  FaHistory,
  FaTruck,
  FaUserCircle,
  FaUserCheck,
  FaUserClock,
  FaUserShield,
  FaMotorcycle,
  FaTasks,
  FaCheckCircle,
} from "react-icons/fa";
import useUserRole from "../Hooks/useUserRole";

const DashboardLayout = () => {
  const { role, isLoading } = useUserRole();

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-white flex flex-col">
        <div className="navbar w-full lg:hidden">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">Dashboard</div>
        </div>
        <Outlet />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4 space-y-3">
          <ProFastLogo />
          <li className="text-xl font-bold">
            <NavLink to="/dashboard/home">
              <FaHome className="mr-2" />
              Home
            </NavLink>
          </li>
          <li className="text-xl font-bold">
            <NavLink to="/dashboard/myParcels">
              <FaBoxOpen className="mr-2" />
              My Parcels
            </NavLink>
          </li>
          <li className="text-xl font-bold">
            <NavLink to="/dashboard/paymentHistory">
              <FaHistory className="mr-2" />
              Payment History
            </NavLink>
          </li>
          <li className="text-xl font-bold">
            <NavLink to="/dashboard/trackParcel">
              <FaTruck className="mr-2" />
              Track a Package
            </NavLink>
          </li>
          <li className="text-xl font-bold">
            <NavLink to="/dashboard/updateProfile">
              <FaUserCircle className="mr-2" />
              Update Profile
            </NavLink>
          </li>

          {/* riders links */}
          {!isLoading && role === "rider" && (
            <>
              <li className="text-xl font-bold">
                <NavLink to="/dashboard/pendingDelivaries">
                  <FaTasks className="mr-2" />
                  Pending Delivaries
                </NavLink>
              </li>
              <li className="text-xl font-bold">
                <NavLink to="/dashboard/completeDelivaries">
                  <FaCheckCircle className="mr-2" />
                  Complete Delivaries
                </NavLink>
              </li>
            </>
          )}

          {/* admin links */}
          {!isLoading && role === "admin" && (
            <>
              <li className="text-xl font-bold">
                <NavLink to="/dashboard/activeRiders">
                  <FaUserCheck className="mr-2" />
                  Active Riders
                </NavLink>
              </li>
              <li className="text-xl font-bold">
                <NavLink to="/dashboard/pandingRiders">
                  <FaUserClock className="mr-2" />
                  Pending Riders
                </NavLink>
              </li>
              <li className="text-xl font-bold">
                <NavLink to="/dashboard/makeAdmin">
                  <FaUserShield className="mr-2" />
                  Make Admin
                </NavLink>
              </li>
              <li className="text-xl font-bold">
                <NavLink to="/dashboard/assignRiders">
                  <FaMotorcycle className="mr-2" />
                  Assign Riders
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
