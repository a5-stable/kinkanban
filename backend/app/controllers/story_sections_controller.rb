class StorySectionsController < ApplicationController
  before_action :set_story_section, only: %i[ show update destroy ]

  # GET /story_sections
  def index
    @story_sections = StorySection.all

    render json: @story_sections
  end

  # GET /story_sections/1
  def show
    render json: @story_section
  end

  # POST /story_sections
  def create
    @story_section = StorySection.new(story_section_params)

    if @story_section.save
      render json: @story_section, status: :created, location: @story_section
    else
      render json: @story_section.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /story_sections/1
  def update
    if @story_section.update(story_section_params)
      render json: @story_section
    else
      render json: @story_section.errors, status: :unprocessable_entity
    end
  end

  # DELETE /story_sections/1
  def destroy
    @story_section.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_story_section
      @story_section = StorySection.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def story_section_params
      params.require(:story_section).permit(:story_id, :section_id)
    end
end
