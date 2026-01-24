import React from "react";

import { Link } from "react-router-dom";
import { resetAuthTokens } from "src/apis/axios";

import authApi from "apis/auth";
import { getFromLocalStorage, setToLocalStorage } from "utils/storage";

import NavItem from "./NavItem";

const NavBar = () => {
  const userName = getFromLocalStorage("authUserName");

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setToLocalStorage({
        authToken: null,
        email: null,
        userId: null,
        userName: null,
      });
      resetAuthTokens();
      window.location.href = "/";
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex px-2 lg:px-0">
            <div className="hidden lg:flex">
              <NavItem
                dataTestId="navbar-todos-page-link"
                name="Todos"
                path="/"
              />
              <NavItem
                dataTestId="navbar-add-todo-link"
                iconClass="ri-add-fill"
                name="Add"
                path="/tasks/create"
              />
              <NavItem
                dataTestId="navbar-report-download-link"
                iconClass="ri-file-download-fill"
                name="Download Report"
                path="/tasks/report"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-4">
            <span
              className="font-regular focus:outline-none inline-flex items-center border-b-2
             border-transparent px-2 pt-1 text-sm
             leading-5 text-bb-gray-600 text-opacity-50 transition
             duration-150 ease-in-out
              focus:text-bb-gray-700"
            >
              <Link data-testid="navbar-preferences-link" to="/my/preferences">
                Preferences
              </Link>
            </span>
            <span
              className="font-regular focus:outline-none inline-flex items-center border-b-2
             border-transparent px-2 pt-1 text-sm
             leading-5 text-bb-gray-600 text-opacity-50 transition
             duration-150 ease-in-out
              focus:text-bb-gray-700"
              data-testid="navbar-username-label"
            >
              {userName}
            </span>
            <a
              data-testid="navbar-logout-link"
              className="focus:outline-none inline-flex cursor-pointer items-center border-b-2
             border-transparent px-1 pt-1 text-sm
             font-semibold leading-5 text-bb-gray-600 text-opacity-50
             transition duration-150 ease-in-out
              hover:text-bb-gray-600 focus:text-bb-gray-700"
              onClick={handleLogout}
            >
              LogOut
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
