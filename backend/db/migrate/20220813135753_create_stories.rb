class CreateStories < ActiveRecord::Migration[7.0]
  def change
    create_table :stories do |t|
      t.string :title
      t.integer :section_id, null: false

      t.timestamps
    end
  end
end
