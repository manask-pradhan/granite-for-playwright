# frozen_string_literal: true

require "sidekiq/web"
require "sidekiq/cron/web"

Rails.application.routes.draw do
  draw :sidekiq

  constraints(lambda { |req| req.format == :json }) do
    resources :tasks, except: %i[new edit], param: :slug do
      collection do
        resource :report, only: %i[create], module: :tasks do
          get :download, on: :collection
        end
      end
    end
    resources :users, only: %i[create index]
    resource :session, only: %i[create destroy]
    resources :comments, only: :create
    resource :preference, only: %i[show update] do
      patch :mail, on: :collection
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
