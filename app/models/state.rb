class State < ApplicationRecord
  # validations
  validates_presence_of :id, :name, :short_name
end
