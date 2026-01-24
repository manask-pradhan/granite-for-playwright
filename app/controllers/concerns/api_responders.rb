# frozen_string_literal: true

module ApiResponders
  extend ActiveSupport::Concern

  private

    def render_error(error, status = :unprocessable_entity, context = {})
      error_message = error
      is_exception = error.kind_of?(StandardError)
      if is_exception
        is_having_record = error.methods.include? "record"
        error_message = is_having_record ? error.record.errors_to_sentence : error.message
      end
      render status:, json: { error: error_message }.merge(context)
    end

    def render_notice(message, status = :ok, context = {})
      render status:, json: { notice: message }.merge(context)
    end

    def render_json(json = {}, status = :ok)
      render status:, json:
    end
end
