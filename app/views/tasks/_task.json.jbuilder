# frozen_string_literal: true

json.extract! task,
  :id,
  :title,
  :slug
json.assigned_user do
  json.extract! task.assigned_user,
    :id,
    :name
end
