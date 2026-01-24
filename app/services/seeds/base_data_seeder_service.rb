# frozen_string_literal: true

module Seeds
  class BaseDataSeederService
    def process
      incinerate_database

      puts "Seeding the database with sample data"
      ActiveRecord::Base.transaction do
        create_users!
        create_tasks!
        create_comments!
      rescue ActiveRecord::ActiveRecordError => error
        puts error.message
        raise ActiveRecord::Rollback
      end
    end

    private

      def create_users!
        Seeds::UserSeederService.new.process!
      end

      def create_tasks!
        Seeds::TaskSeederService.new.process!
      end

      def create_comments!
        Seeds::CommentSeederService.new.process!
      end

      def incinerate_database
        puts "Truncating all the records from the database"
        DatabaseCleaner.clean_with :truncation
      end
  end
end
