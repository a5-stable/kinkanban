class User < ApplicationRecord
            # Include default devise modules.
            devise :database_authenticatable, :registerable,
            :recoverable, :rememberable, :validatable
            include DeviseTokenAuth::Concerns::User
#   # Include default devise modules. Others available are:
#   # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
#   devise :database_authenticatable, :registerable,
#          :recoverable, :rememberable, :validatable

  has_many :lists, foreign_key: :owner_id, dependent: :destroy # dependent: :destroyなのか？
end
