import React from "react";

import { Link } from "react-router-dom";

import { convertToKebabCase } from "utils/convertToKebabCase";

const NavItem = ({ iconClass, name, path, dataTestId }) => (
  <Link
    className="mr-3 inline-flex items-center px-1 pt-1 text-sm font-semibold leading-5 text-indigo-500 hover:text-indigo-500"
    data-testid={dataTestId ?? convertToKebabCase(dataTestId)}
    to={path}
  >
    {iconClass && <i className={`${iconClass} text-bb-purple`} />}
    {name}
  </Link>
);

export default NavItem;
