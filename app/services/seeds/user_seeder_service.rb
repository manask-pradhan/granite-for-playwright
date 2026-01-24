# frozen_string_literal: true

module Seeds
  class UserSeederService
    ADMINS = ["Oliver"]
    CUSTOMERS = ["John", "Eve", "Sam"]
    DEFAULT_LAST_NAME = "Smith"
    DEFAULT_PASSWORD = "welcome"

    attr_reader :user_names

    def initialize
      @user_names = ADMINS + CUSTOMERS
    end

    def process!
      puts "Creating users"
      user_names.each do |user_name|
        User.create!(user_attributes(user_name))
      end
    end

    private

      def user_attributes(user_name)
        {
          name: "#{user_name} #{DEFAULT_LAST_NAME}",
          email: "#{user_name}@example.com",
          password: DEFAULT_PASSWORD,
          password_confirmation: DEFAULT_PASSWORD
        }
      end
  end
end
