# spec/models/record_spec.rb
require 'rails_helper'

#Test suite for the Record model
RSpec.describe Record, type: :model do
  # Association test
  # ensure a 'record' record belongs to a single import record
  it { should belong_to(:import) }
  # Validation test
  # ensure column name is present before saving
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:address) }
  it { should validate_presence_of(:city) }
  it { should validate_presence_of(:state) }
  it { should validate_presence_of(:zip) }
  it { should validate_presence_of(:purpose) }
  it { should validate_presence_of(:property_owner) }
  it { should validate_presence_of(:creation_date) }
  it { should validate_presence_of(:lat) }
  it { should validate_presence_of(:long) }
end
