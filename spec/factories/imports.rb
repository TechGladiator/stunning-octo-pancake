# spec/factories/imports.rb
FactoryBot.define do
  factory :import do
    import_name { Faker::Lorem.word }
  end
end