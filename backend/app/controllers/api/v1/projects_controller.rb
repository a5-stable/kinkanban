class Api::V1::ProjectsController < ApplicationController
  before_action :set_project, only: %i[ show update destroy search ]

  def index
    @projects = Project.all
    render json: @projects, status: :ok
  end

  def show
  end

  def search
    @response = Section.where(project_id: @project.id).map {|section|
      [section.id, Story.where(section_id: section.id).order(:position)]
    }.to_h
    render status: 200, json: { body: @response }
  end

  # POST /projects
  def create
    @project = Project.new(project_params)

    if @project.save
      render json: @project, status: :created
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /projects/1
  def update
    if @project.update(project_params)
      render json: @project
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  # DELETE /projects/1
  def destroy
    @project.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_project
    @project = Project.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def project_params
    params.require(:project).permit(:title)
  end
end
