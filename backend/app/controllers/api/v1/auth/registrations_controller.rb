class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  def create
    super
  end
  private

  def sign_up_params
    params.require(:registration).permit(:email, :password, :password_confirmation, :name)
  end
end
