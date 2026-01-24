# frozen_string_literal: true

class PreferencePolicy
  attr_reader :user, :preference

  def initialize(user, preference)
    @user = user
    @preference = preference
  end

  def show?
    preference.user_id == user.id
  end

  def update?
    show?
  end

  def mail?
    show?
  end
end
