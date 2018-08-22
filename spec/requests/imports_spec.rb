# spec/requests/todos_spec.rb
require 'rails_helper'

RSpec.describe 'Imports API', type: :request do
  # initialize test data 
  let!(:imports) { create_list(:import, 10) }
  let(:import_id) { imports.first.id }

  # Test suite for GET /imports
  describe 'GET /imports' do
    # make HTTP get request before each example
    before { get '/imports' }

    it 'returns imports' do
      # Note `json` is a custom helper to parse JSON responses
      expect(json).not_to be_empty
      expect(json.size).to eq(10)
    end

    it 'returns status code 200' do
      expect(response).to have_http_status(200)
    end
  end

  # Test suite for GET /imports/:id
  describe 'GET /imports/:id' do
    before { get "/imports/#{import_id}" }

    context 'when the record exists' do
      it 'returns the import' do
        expect(json).not_to be_empty
        expect(json['id']).to eq(import_id)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the record does not exist' do
      let(:import_id) { 100 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Import/)
      end
    end
  end

  # Test suite for POST /imports
  describe 'POST /imports' do
    # valid payload
    let(:valid_attributes) { { import_name: 'Learn Elm' } }

    context 'when the request is valid' do
      before { post '/imports', params: valid_attributes }

      it 'creates a import' do
        expect(json['import_name']).to eq('Learn Elm')
      end

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when the request is invalid' do
      before { post '/imports', params: { import_name: 'Foobar' } }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns a validation failure message' do
        expect(response.body)
          .to match(/Validation failed: Import name can't be blank/)
      end
    end
  end

  # Test suite for PUT /imports/:id
  describe 'PUT /imports/:id' do
    let(:valid_attributes) { { import_name: 'Shopping' } }

    context 'when the record exists' do
      before { put "/imports/#{import_id}", params: valid_attributes }

      it 'updates the record' do
        expect(response.body).to be_empty
      end

      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end
    end
  end

  # Test suite for DELETE /imports/:id
  describe 'DELETE /imports/:id' do
    before { delete "/imports/#{import_id}" }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end
  end
end