# frozen_string_literal: true

module ApiExceptions
  extend ActiveSupport::Concern

  included do
    protect_from_forgery

    rescue_from StandardError, with: :handle_api_exception

    def handle_api_exception(exception)
      case exception
      when -> (e) { e.message.include?("PG::") || e.message.include?("SQLite3::") }
        handle_database_level_exception(exception)

      when Pundit::NotAuthorizedError
        handle_authorization_error

      when ActionController::ParameterMissing
        render_error(exception, :internal_server_error)

      when ActiveRecord::RecordNotFound
        render_error(t("not_found", entity: exception.model), :not_found)

      when ActiveRecord::RecordNotUnique
        render_error(exception)

      when ActiveModel::ValidationError, ActiveRecord::RecordInvalid, ArgumentError
        error_message = exception.message.gsub("Validation failed: ", "")
        render_error(error_message, :unprocessable_entity)

      else
        handle_generic_exception(exception)
      end
    end

    def handle_database_level_exception(exception)
      handle_generic_exception(exception, :internal_server_error)
    end

    def handle_authorization_error
      render_error(t("authorization.denied"), :forbidden)
    end

    def handle_generic_exception(exception, status = :internal_server_error)
      log_exception(exception) unless Rails.env.test?
      error = Rails.env.production? ? t("generic_error") : exception
      render_error(error, status)
    end

    def log_exception(exception)
      Rails.logger.info exception.class.to_s
      Rails.logger.info exception.to_s
      Rails.logger.info exception.backtrace.join("\n")
    end
  end
end
