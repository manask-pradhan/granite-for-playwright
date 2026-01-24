# frozen_string_literal: true

class AddTaskStringEnumColumn < ActiveRecord::Migration[6.1]
  def up
    rename_column :tasks, :progress, :progress_new
    rename_column :tasks, :status, :status_new
    add_column :tasks, :progress, :string, default: "pending", null: false
    add_column :tasks, :status, :string, default: "unstarred", null: false
  end

  def down
    remove_column :tasks, :progress_new
    remove_column :tasks, :status_new
  end
end
