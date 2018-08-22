# spec/requests/records_spec.rb
require 'rails_helper'

RSpec.describe 'Records API' do
  # Initialize the test data
  let!(:import) { create(:import) }
  let!(:records) { create_list(:record, 20, import_id: import.id) }
  let(:import_id) { import.id }
  let(:id) { records.first.id }

  # Test suite for GET /imports/:import_id/records
  describe 'GET /imports/:import_id/records' do
    before { get "/imports/#{import_id}/records" }

    context 'when import exists' do
      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns all import records' do
        expect(json.size).to eq(20)
      end
    end

    context 'when import does not exist' do
      let(:import_id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Import/)
      end
    end
  end

  # Test suite for GET /imports/:import_id/records/:id
  describe 'GET /imports/:import_id/records/:id' do
    before { get "/imports/#{import_id}/records/#{id}" }

    context 'when import record exists' do
      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns the record' do
        expect(json['id']).to eq(id)
      end
    end

    context 'when import record does not exist' do
      let(:id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Record/)
      end
    end
  end

  # Test suite for PUT /imports/:import_id/records
  describe 'POST /imports/:import_id/records' do
    let(:valid_attributes) { { name: 'Visit Narnia', done: false } }

    context 'when request attributes are valid' do
      before { post "/imports/#{import_id}/records", params: valid_attributes }

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when an invalid request' do
      before { post "/imports/#{import_id}/records", params: {} }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns a failure message' do
        expect(response.body).to match(/Validation failed: Name can't be blank/)
      end
    end
  end

  # Test suite for PUT /imports/:import_id/records/:id
  describe 'PUT /imports/:import_id/records/:id' do
    let(:valid_attributes) { { name: 'Mozart' } }

    before { put "/imports/#{import_id}/records/#{id}", params: valid_attributes }

    context 'when record exists' do
      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end

      it 'updates the record' do
        updated_record = Record.find(id)
        expect(updated_record.name).to match(/Mozart/)
      end
    end

    context 'when the record does not exist' do
      let(:id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Record/)
      end
    end
  end

  # Test suite for DELETE /imports/:id
  describe 'DELETE /imports/:id' do
    before { delete "/imports/#{import_id}/records/#{id}" }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end
  end
end