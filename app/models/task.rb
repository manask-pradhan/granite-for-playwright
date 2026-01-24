# frozen_string_literal: true

class Task < ApplicationRecord
  scope :accessible_to, ->(user_id) { where("task_owner_id = ? OR assigned_user_id = ?", user_id, user_id) }

  RESTRICTED_ATTRIBUTES = %i[title task_owner_id assigned_user_id]
  MAX_TITLE_LENGTH = 125
  VALID_TITLE_REGEX = /\A.*[a-zA-Z0-9].*\z/i

  enum :progress, { pending: "pending", completed: "completed" }, default: :pending
  enum :status, { unstarred: "unstarred", starred: "starred" }, default: :unstarred

  belongs_to :task_owner, foreign_key: "task_owner_id", class_name: "User"
  belongs_to :assigned_user, foreign_key: "assigned_user_id", class_name: "User"
  has_many :comments, dependent: :destroy

  validate :slug_not_changed
  validates :title,
    presence: true,
    length: { maximum: MAX_TITLE_LENGTH },
    format: { with: VALID_TITLE_REGEX }
  validates :slug, uniqueness: true

  after_create :log_task_details, if: -> { Rails.env.development? || Rails.env.test? }

  before_create :set_slug

  private

    def self.of_status(progress)
      if progress == :pending
        pending.in_order_of(:status, %w(starred unstarred)).order("updated_at DESC")
      else
        completed.in_order_of(:status, %w(starred unstarred)).order("updated_at DESC")
      end
    end

    def log_task_details
      TaskLoggerJob.perform_later(self)
    end

    def set_slug
      title_slug = title.parameterize
      regex_pattern = "slug #{Constants::DB_REGEX_OPERATOR} ?"
      latest_task_slug = Task.where(
        regex_pattern,
        "^#{title_slug}$|^#{title_slug}-[0-9]+$"
      ).order("LENGTH(slug) DESC", slug: :desc).first&.slug
      slug_count = 0
      if latest_task_slug.present?
        slug_count = latest_task_slug.split("-").last.to_i
        only_one_slug_exists = slug_count == 0
        slug_count = 1 if only_one_slug_exists
      end
      slug_candidate = slug_count.positive? ? "#{title_slug}-#{slug_count + 1}" : title_slug
      self.slug = slug_candidate
    end

    def slug_not_changed
      if slug_changed? && persisted?
        errors.add(:slug, I18n.t("task.slug.immutable"))
      end
    end
end
