import React from "react";

import classnames from "classnames";

const PageLoader = ({ className = "" }) => (
  <div
    data-testid="page-loader"
    className={classnames(
      [className],
      "flex h-screen w-screen flex-row items-center justify-center"
    )}
  >
    <h1 className="text-lg leading-5">Loading...</h1>
  </div>
);

export default PageLoader;
