# frozen_string_literal: true

class SeedTaskStringEnumColumn < ActiveRecord::Migration[6.1]
  def up
    Task.reset_column_information
    Task.find_each do |task|
      task.update(progress: task.progress_new == 0 ? "pending" : "completed")
      task.update(status: task.status_new == 0 ? "unstarred" : "starred")
      task.save(validate: false)
    end
  end

  def down
    Task.find_each do |task|
      task.update(progress: task.progress_new == "pending" ? "pending" : "completed")
      task.update(status: task.status_new == "unstarred" ? "unstarred" : "starred")
      task.save(validate: false)
    end
  end
end
