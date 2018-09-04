class Import < ApplicationRecord
  # model association
  has_many :records, dependent: :destroy

  #validations
  validates_presence_of :import_name
end
