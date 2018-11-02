class Record < ApplicationRecord
  # model association
  belongs_to :import

  #validation
  validates_presence_of :Name, :Address, :City, :State, :Zip, :Purpose, :"Property Owner", :"Creation Date", :Lat, :Long
end
