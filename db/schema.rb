# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 0) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "imports", force: :cascade do |t|
    t.string "import_name", null: false
    t.index ["import_name"], name: "imports_import_name_key", unique: true
  end

  create_table "records", force: :cascade do |t|
    t.string "name", null: false
    t.string "address", null: false
    t.string "address_2"
    t.string "city", null: false
    t.string "state", limit: 2, null: false
    t.string "zip", limit: 5, null: false
    t.string "purpose"
    t.string "property_owner"
    t.date "creation_date", null: false
    t.decimal "lat", null: false
    t.decimal "long", null: false
    t.bigint "import_id", null: false
  end

  create_table "states", primary_key: "short_name", id: :string, limit: 2, force: :cascade do |t|
    t.bigserial "id", null: false
    t.string "name", null: false
  end

  add_foreign_key "records", "imports", name: "records_import_id_fkey"
  add_foreign_key "records", "states", column: "state", primary_key: "short_name", name: "records_statecode_fkey"
end
