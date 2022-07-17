class Api::V1::SectionsController < ApplicationController
  before_action :set_section, only: %i[ update destroy ]

  # POST /api/v1/sections
  def create
    @section = Section.new(section_params)

    if section.save
      render json: section, status: :created, location: section
    else
      render json: section.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/sections/1
  def update
    if section.update(section_params)
      render json: section
    else
      render json: section.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/sections/1
  def destroy
    section.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_section
    section = Section.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def section_params
    params.require(:section).permit(:title)
  end
end
