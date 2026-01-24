# frozen_string_literal: true

class ReportsWorker
  include Sidekiq::Worker

  def perform(user_id)
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.render"), progress: 25 })
    tasks = Task.accessible_to(user_id)
    html_report = ApplicationController.render(
      assigns: {
        tasks:
      },
      template: "tasks/report/download",
      layout: "pdf"
    )
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.generate"), progress: 50 })
    pdf_report = WickedPdf.new.pdf_from_string html_report
    current_user = User.find_by!(id: user_id)
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.upload"), progress: 75 })
    if current_user.report.attached?
      current_user.report.purge_later
    end
    current_user.report.attach(
      io: StringIO.new(pdf_report), filename: "report.pdf",
      content_type: "application/pdf")
    current_user.save
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.attach"), progress: 100 })
  end
end
