# frozen_string_literal: true

class UserNotificationsWorker
  include Sidekiq::Worker

  def perform(user_id)
    TaskMailer.pending_tasks_email(user_id).deliver_later
  end
end
