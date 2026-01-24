# frozen_string_literal: true

module Seeds
  class CommentSeederService
    COMMENT_POOL = ["Is this an important task?",
      "Can we skip this task?",
      "Task almost finished",
      "Task couldn't be completed"
    ]

    attr_reader :content

    def initialize
      @content = COMMENT_POOL.shuffle
    end

    def process!
      puts "Creating comments for each of the tasks"
      tasks.each do |task|
        task.comments.create!(comment_attributes)
      end
    end

    private

      def tasks
        Task.where.not(task_owner: user)
      end

      def comment_attributes
        {
          content: content.sample,
          user:
        }
      end

      def user
        @_user ||= User.find_by(email: "oliver@example.com")
      end
  end
end
