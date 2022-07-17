require "test_helper"

class Api::V1::SectionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @api_v1_section = api_v1_sections(:one)
  end

  test "should get index" do
    get api_v1_sections_url, as: :json
    assert_response :success
  end

  test "should create api_v1_section" do
    assert_difference("Api::V1::Section.count") do
      post api_v1_sections_url, params: { api_v1_section: {  } }, as: :json
    end

    assert_response :created
  end

  test "should show api_v1_section" do
    get api_v1_section_url(@api_v1_section), as: :json
    assert_response :success
  end

  test "should update api_v1_section" do
    patch api_v1_section_url(@api_v1_section), params: { api_v1_section: {  } }, as: :json
    assert_response :success
  end

  test "should destroy api_v1_section" do
    assert_difference("Api::V1::Section.count", -1) do
      delete api_v1_section_url(@api_v1_section), as: :json
    end

    assert_response :no_content
  end
end
