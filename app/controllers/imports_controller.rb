# app/controllers/imports_controller.rb
class ImportsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_import, only: [:show, :update, :destroy]

  # GET /imports
  def index
    @imports = Import.all
    json_response(@imports)
  end

  # POST /imports
  def create
    @import = Import.create!(import_params)
    json_response(@import, :created)
  end

  # GET /imports/:id
  def show
    json_response(@import)
  end

  # PUT /imports/:id
  def update
    @import.update(import_params)
    head :no_content
  end

  # DELETE /imports/:id
  def destroy
    @import.destroy
    head :no_content
  end

  # SEARCH /imports/search
  def search
    term = params[:term] || nil
    @imports = []
    @imports = Import.where('import_name LIKE ?', "%#{term}%") if term
    json_response(@imports)
  end

  private

  def import_params
    # whitelist params
    params.permit(:import_name)
  end

  def set_import
    @import = Import.find(params[:id])
  end
end
