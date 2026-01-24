# frozen_string_literal: true

class RemoveTaskIntegerEnumColumn < ActiveRecord::Migration[6.1]
  def up
    remove_column :tasks, :progress_new
    remove_column :tasks, :status_new
  end

  # Update enum values in Task model before rolling back this migration
  def down
    rename_column :tasks, :progress, :progress_new
    add_column :tasks, :progress, :integer, default: 0

    rename_column :tasks, :status, :status_new
    add_column :tasks, :status, :integer, default: 0
  end
end
