# frozen_string_literal: true

require "test_helper"

class UserNotificationTest < ActiveSupport::TestCase
  def setup
    @user_notification = create(:user_notification)
  end

  def test_last_notification_sent_date_must_be_present
    @user_notification.last_notification_sent_date = nil
    assert @user_notification.invalid?
    assert_includes @user_notification.errors.messages[:last_notification_sent_date], t("errors.messages.blank")
  end

  def test_last_notification_sent_date_must_be_parsable
    # The value of date becomes nil if provided with invalid date.
    # https://github.com/rails/rails/issues/29272
    unparsable_dates = ["12-13-2021", "32-12-2021", "11-00-2022"]
    unparsable_dates.each do |unparsable_date|
      @user_notification.last_notification_sent_date = unparsable_date
      assert_nil @user_notification.last_notification_sent_date
    end
  end

  def test_last_notification_sent_date_cannot_be_in_past
    @user_notification.last_notification_sent_date = Time.zone.yesterday
    assert @user_notification.invalid?
    assert_includes @user_notification.errors.messages[:last_notification_sent_date], t("date.cant_be_in_past")
  end
end
