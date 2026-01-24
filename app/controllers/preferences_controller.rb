# frozen_string_literal: true

class PreferencesController < ApplicationController
  before_action :load_preference

  def show
    render_json({ preference: @preference })
  end

  def update
    @preference.update!(preference_params)
    render_notice(t("successfully_updated", entity: "Preference"))
  end

  def mail
    @preference.update!(should_receive_email: preference_params[:should_receive_email])
    render_notice(
      t(
        "preference.mail.notification_status",
        status: @preference.should_receive_email ? "enabled" : "disabled"
      )
    )
  end

  private

    def preference_params
      params.require(:preference).permit(:notification_delivery_hour, :should_receive_email)
    end

    def load_preference
      @preference = current_user.preference
      unless @preference
        render_error(t("not_found", entity: "Preference"), :not_found)
      end
    end
end
