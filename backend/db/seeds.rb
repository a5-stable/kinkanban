# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

project = Project.create!({title: "新規のプロジェクト"})
5.times do |index|
  Section.create!(project_id: project.id, title: "セクション#{index}")
end

Section.all.each do |section|
  rand = Random.rand(5)
  rand.times {|index| Story.create!(section_id: section.id, title: "ストーリー_#{index}_#{section.id}")}
end
