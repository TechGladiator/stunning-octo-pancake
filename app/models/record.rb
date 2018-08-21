class Record < ApplicationRecord
  # model association
  belongs_to :import

  #validation
  validates_presence_of :name, :address, :address_2, :city, :state, :zip, :purpose, :property_owner, :creation_date, :lat, :long
end