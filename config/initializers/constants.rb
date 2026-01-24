# frozen_string_literal: true

module Constants
  DEFAULT_NOTIFICATION_DELIVERY_HOUR = 10

  is_sqlite_db = ActiveRecord::Base.connection_db_config.configuration_hash[:adapter] == "sqlite3"
  DB_REGEX_OPERATOR = is_sqlite_db ? "REGEXP" : "~*"
end
