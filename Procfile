web: bundle exec puma -C config/puma.rb
worker: bundle exec sidekiq -C config/sidekiq.yml
release: bundle exec rake db:migrate && bundle exec rake populate_with_sample_data

