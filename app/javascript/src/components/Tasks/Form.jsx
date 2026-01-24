import React from "react";

import Select from "react-select";

import Button from "components/Button";
import Input from "components/Input";

const Form = ({
  type = "create",
  title,
  setTitle,
  assignedUser,
  users,
  setUserId,
  loading,
  handleSubmit,
}) => {
  const userOptions = users.map(user => ({
    value: user.id,
    label: user.name,
  }));
  const defaultOption = { value: assignedUser?.id, label: assignedUser?.name };

  return (
    <form className="mx-auto max-w-lg" onSubmit={handleSubmit}>
      <Input
        dataTestId="form-title-field"
        label="Title"
        placeholder="Todo Title (Max 50 Characters Allowed)"
        value={title}
        onChange={e => setTitle(e.target.value.slice(0, 50))}
      />
      <div>
        <p className="my-3 text-sm leading-5 text-nitro-gray-800">
          Assigned To
        </p>
        <div className="w-full">
          <Select
            isSearchable
            data-testid="form-assignee-select-option"
            defaultValue={defaultOption}
            options={userOptions}
            onChange={e => setUserId(e.value)}
          />
        </div>
      </div>
      <Button
        buttonText={type === "create" ? "Add Task" : "Update Task"}
        dataTestId="form-submit-button"
        loading={loading}
        type="submit"
      />
    </form>
  );
};

export default Form;
