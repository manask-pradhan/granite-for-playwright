import React from "react";

import classnames from "classnames";
import PropTypes from "prop-types";

import Tooltip from "components/Tooltip";

const Row = ({
  type = "pending",
  data,
  destroyTask,
  showTask,
  handleProgressToggle,
  starTask,
}) => {
  const isCompleted = type === "completed";
  const toggledProgress = isCompleted ? "pending" : "completed";

  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {data.map(rowData => (
        <tr key={rowData.id}>
          <td className="text-center">
            <input
              checked={isCompleted}
              className="form-checkbox ml-6 h-4 w-4 cursor-pointer rounded border-gray-300 text-bb-purple focus:ring-bb-purple"
              type="checkbox"
              onChange={() =>
                handleProgressToggle({
                  slug: rowData.slug,
                  progress: toggledProgress,
                })
              }
            />
          </td>
          <td
            className={classnames(
              "block w-64 px-6 py-4 text-sm font-medium capitalize leading-8 text-bb-purple ",
              {
                "cursor-pointer": !isCompleted,
                "text-opacity-50": isCompleted,
              }
            )}
            onClick={() => !isCompleted && showTask(rowData.slug)}
          >
            <Tooltip content={rowData.title} delay={200} direction="top">
              <div className="max-w-64 truncate ">{rowData.title}</div>
            </Tooltip>
          </td>
          {!isCompleted && (
            <>
              <td className="whitespace-no-wrap px-6 py-4 text-sm font-medium leading-5 text-bb-gray-600">
                {rowData.assigned_user.name}
              </td>
              <td className="whitespace-no-wrap px-6 py-4 text-center text-sm font-medium leading-5 text-bb-gray-600">
                {rowData.comments_count}
              </td>
              <td className="cursor-pointer py-4 pl-6 text-center">
                <i
                  data-testid="pending-task-star-or-unstar-link"
                  className={classnames(
                    "p-1 text-2xl transition duration-300 ease-in-out hover:text-bb-yellow",
                    {
                      "ri-star-line text-bb-border":
                        rowData.status !== "starred",
                    },
                    {
                      "ri-star-fill text-white text-bb-yellow":
                        rowData.status === "starred",
                    }
                  )}
                  onClick={() => starTask(rowData.slug, rowData.status)}
                />
              </td>
            </>
          )}
          {isCompleted && (
            <>
              <td style={{ width: "164px" }} />
              <td className="cursor-pointer py-4 pl-6 text-center">
                <i
                  className="ri-delete-bin-5-line text-center text-2xl text-bb-border transition duration-300 ease-in-out hover:text-bb-red"
                  data-testid="completed-task-delete-link"
                  onClick={() => destroyTask(rowData.slug)}
                />
              </td>
            </>
          )}
        </tr>
      ))}
    </tbody>
  );
};

Row.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.string,
  destroyTask: PropTypes.func,
  showTask: PropTypes.func,
  handleProgressToggle: PropTypes.func,
  starTask: PropTypes.func,
};

export default Row;
