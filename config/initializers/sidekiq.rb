# frozen_string_literal: true

if Rails.env.test? || Rails.env.heroku?
  require "sidekiq/testing"
  Sidekiq::Testing.inline!
end

redis_config = {
  url: Rails.application.secrets.redis_url,
  size: 9,
  ssl_params: {
    verify_mode: OpenSSL::SSL::VERIFY_NONE
  }
}

Sidekiq.configure_server do |config|
  config.redis = redis_config
  unless Rails.env.test?
    schedule_file = "config/schedule.yml"

    if File.exist?(schedule_file)
      Sidekiq::Cron::Job.load_from_hash! YAML.load_file(schedule_file, aliases: true)[Rails.env]
    end
  end
end

Sidekiq.configure_client do |config|
  config.redis = redis_config.merge(size: 1)
end
