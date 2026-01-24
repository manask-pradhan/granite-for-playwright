# frozen_string_literal: true

class DataSeederWorker
  include Sidekiq::Worker

  def perform
    base_data_seeder_service = Seeds::BaseDataSeederService.new
    base_data_seeder_service.process
  end
end
