import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  HomeIcon,
  LoaderPinwheelIcon,
  UsersIcon,
} from "lucide-react";

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  // Desktop aside (visible on lg+)
  const desktop = (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <LoaderPinwheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
            Yokai
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/messages"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/messages" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Messages</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );

  // Mobile drawer (visible on <lg when isOpen true)
  const mobileDrawer = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden
      />

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-base-200 border-r border-base-300 z-40 transform transition-transform lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-base-300">
          <Link to="/" className="flex items-center gap-2.5">
            <LoaderPinwheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
              Yokai
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/"
            onClick={onClose}
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/" ? "btn-active" : ""
            }`}
          >
            <HomeIcon className="size-5 text-base-content opacity-70" />
            <span>Home</span>
          </Link>

          <Link
            to="/messages"
            onClick={onClose}
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/messages" ? "btn-active" : ""
            }`}
          >
            <UsersIcon className="size-5 text-base-content opacity-70" />
            <span>Messages</span>
          </Link>

          <Link
            to="/notifications"
            onClick={onClose}
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/notifications" ? "btn-active" : ""
            }`}
          >
            <BellIcon className="size-5 text-base-content opacity-70" />
            <span>Notifications</span>
          </Link>
        </nav>

        {/* USER PROFILE SECTION */}
        <div className="p-4 border-t border-base-300 mt-auto">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{authUser?.fullName}</p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {desktop}
      {mobileDrawer}
    </>
  );
};
export default Sidebar;
