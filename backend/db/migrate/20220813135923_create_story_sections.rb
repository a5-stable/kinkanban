class CreateStorySections < ActiveRecord::Migration[7.0]
  def change
    create_table :story_sections do |t|
      t.integer :story_id, null: false
      t.integer :section_id, null: false

      t.timestamps
      t.index [ :story_id, :section_id], name: "index_story_id_section_id", unique: true
    end
  end
end
