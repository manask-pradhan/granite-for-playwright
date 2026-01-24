# frozen_string_literal: true

class RemoveUserIdAndCreatorIdFromTask < ActiveRecord::Migration[6.1]
  def change
    remove_column :tasks, :user_id
    remove_column :tasks, :creator_id
  end
end
