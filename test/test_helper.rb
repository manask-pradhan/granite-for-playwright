# frozen_string_literal: true

def enable_test_coverage
  require "simplecov"
  SimpleCov.start do
    add_filter "/test/"
    add_group "Models", "app/models"
    add_group "Mailers", "app/mailers"
    add_group "Controllers", "app/controllers"
    add_group "Uploaders", "app/uploaders"
    add_group "Helpers", "app/helpers"
    add_group "Workers", "app/workers"
    add_group "Services", "app/services"
  end
end

enable_test_coverage if ENV["COVERAGE"]

ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

class ActiveSupport::TestCase
  include ActionView::Helpers::TranslationHelper
  include FactoryBot::Syntax::Methods

  # Add more helper methods to be used by all tests here...
  parallelize(workers: :number_of_processors) unless ENV["COVERAGE"]
end

def headers(user, options = {})
  {
    Accept: "application/json",
    "Content_Type" => "application/json",
    "X-Auth-Token" => user.authentication_token,
    "X-Auth-Email" => user.email
  }.merge(options)
end

def response_json
  response.parsed_body
end
