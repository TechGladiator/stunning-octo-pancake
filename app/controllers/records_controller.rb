# app/controllers/records_controller.rb
class RecordsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_import
  before_action :set_import_record, only: [:show, :update, :destroy]

  # GET /imports/:import_id/records
  def index
    json_response(@import.records)
  end
  
  # GET /imports/:import_id/sortASC/records
  def sortASC
    term = params[:term] || nil
    json_response(@import.records.order("#{term} ASC"))
  end
  
  # GET /imports/:import_id/sortDESC/records
  def sortDESC
    term = params[:term] || nil
    json_response(@import.records.order("#{term} DESC"))
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
    params.permit(:Name, :Address, :"Address 2", :City, :State, :Zip, :Purpose, :"Property Owner", :"Creation Date", :Lat, :Long)
  end

  def set_import
    @import = Import.find(params[:import_id])
  end

  def set_import_record
    @record = @import.records.find_by!(id: params[:id]) if @import
  end
end