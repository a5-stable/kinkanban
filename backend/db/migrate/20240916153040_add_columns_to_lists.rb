class AddColumnsToLists < ActiveRecord::Migration[8.0]
  def change
    add_column :lists, :description, :text
    add_column :lists, :owner_id, :bigint, null: false
    add_column :lists, :grouop_id, :bigint
    add_column :lists, :completed, :boolean, default: false
  end
end
