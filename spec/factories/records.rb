# spec/factories/records.rb
FactoryBot.define do
  factory :record do
    name { Faker::StarWars.character }
    address { Faker::Address.street_address }
    address_2 { Faker::Address.secondary_address }
    city { Faker::Address.city }
    state { Faker::Address.state_abbr }
    zip { Faker::Address.zip }
    purpose { Faker::Book.genre }
    property_owner { Faker::StarWars.character }
    creation_date { Faker::Date.backward(14) }
    import_id nil
  end
end