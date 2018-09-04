# spec/models/import_spec.rb
require 'rails_helper'

# Test suite for the Import model
RSpec.describe Import, type: :model do
  # Association test
  # ensure Import model has a 1:m relationship with the record model
  it { should have_many(:records).dependent(:destroy) }
  # Validation tests
  # ensure columns title and created_by are present before saving
  it { should validate_presence_of(:import_name) }
end
