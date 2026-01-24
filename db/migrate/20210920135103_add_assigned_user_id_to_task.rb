# frozen_string_literal: true

class AddAssignedUserIdToTask < ActiveRecord::Migration[6.1]
  def change
    add_reference :tasks, :assigned_user, foreign_key: { to_table: :users }, index: false
  end
end
