# spec/models/state_spec.rb
require 'rails_helper'

# Test suite for the State model
RSpec.describe State, type: :model do
  # Validation test
  # ensure column name is present before saving
  it { should validate_presence_of(:id) }
  it { should validate_presence_of(:name) }
end
