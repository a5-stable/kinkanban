class Story < ApplicationRecord
  acts_as_list scope: :section
end
