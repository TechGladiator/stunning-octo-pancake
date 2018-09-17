# app/controllers/records_controller.rb
class RecordsController < ApplicationController
  before_action :set_import
  before_action :set_import_record, only: [:show, :update, :destroy]

  # GET /imports/:import_id/records
  def index
    json_response(@import.records)
  end

  # GET /imports/:import_id/records/:id
  def show
    json_response(@record)
  end

  # POST /imports/:import_id/records
  def create
    @import.records.create!(record_params)
    json_response(@import, :created)
  end

  # PUT /imports/:import_id/records/:id
  def update
    @record.update(record_params)
    head :no_content
  end

  # DELETE /imports/:import_id/records/:id
  def destroy
    @record.destroy
    head :no_content
  end

  private

  def record_params
    params.permit(:name, :address, :address_2, :city, :state, :zip, :purpose, :property_owner, :creation_date, :lat, :long)
  end

  def set_import
    @import = Import.find(params[:import_id])
  end

  def set_import_record
    @record = @import.records.find_by!(id: params[:id]) if @import
  end
end