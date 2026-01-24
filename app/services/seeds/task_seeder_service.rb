# frozen_string_literal: true

module Seeds
  class TaskSeederService
    ADMIN_EMAIL = "oliver@example.com"

    attr_reader :task_pool

    def initialize
      @task_pool = ["Fix the favicon on the new website",
        "The profile pictures look distorted in iPad",
        "Users should be able to filter blogs based on authors",
        "Move the book from Vercel to Netlify",
        "Upgrade the app to use the latest version of Next.js",
        "Switch from Bootstrap to Tailwind"
      ]
    end

    def process!
      puts "Creating tasks for users"
      Task.reset_column_information
      create_tasks_for_admin!
      create_tasks_for_customers!
    end

    private

      def create_tasks_for_admin!
        puts "1. Creating tasks for admin"
        (task_pool.count - customers.count).times do |i|
          admin.created_tasks.create!(task_attributes(customers[i]))
        end
      end

      def create_tasks_for_customers!
        puts "2. Creating tasks for customers"
        customers.each do |customer|
          customer.created_tasks.create!(task_attributes(admin))
        end
      end

      def task_attributes(assigned_user)
        {
          title: @task_pool.pop,
          assigned_user:
        }
      end

      def admin
        @_admin ||= User.find_by(email: ADMIN_EMAIL)
      end

      def customers
        @_customers ||= User.where.not(email: ADMIN_EMAIL)
      end
  end
end
