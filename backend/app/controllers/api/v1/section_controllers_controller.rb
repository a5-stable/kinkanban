class Api::V1::SectionControllersController < ApplicationController
  before_action :set_api_v1_section_controller, only: %i[ show update destroy ]

  # GET /api/v1/section_controllers
  def index
    @api_v1_section_controllers = Api::V1::SectionController.all

    render json: @api_v1_section_controllers
  end

  # GET /api/v1/section_controllers/1
  def show
    render json: @api_v1_section_controller
  end

  # POST /api/v1/section_controllers
  def create
    @api_v1_section_controller = Api::V1::SectionController.new(api_v1_section_controller_params)

    if @api_v1_section_controller.save
      render json: @api_v1_section_controller, status: :created, location: @api_v1_section_controller
    else
      render json: @api_v1_section_controller.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/section_controllers/1
  def update
    if @api_v1_section_controller.update(api_v1_section_controller_params)
      render json: @api_v1_section_controller
    else
      render json: @api_v1_section_controller.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/section_controllers/1
  def destroy
    @api_v1_section_controller.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_api_v1_section_controller
      @api_v1_section_controller = Api::V1::SectionController.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def api_v1_section_controller_params
      params.fetch(:api_v1_section_controller, {})
    end
end
