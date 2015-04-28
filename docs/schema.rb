# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20150331134549) do

  create_table "business_locations", :force => true do |t|
    t.string   "name"
    t.string   "address"
    t.string   "phone"
    t.string   "email"
    t.string   "hours"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
    t.integer  "publication_id"
    t.float    "latitude"
    t.float    "longitude"
    t.string   "venue_url"
    t.boolean  "locate_include_name", :default => false
  end

  add_index "business_locations", ["name"], :name => "index_business_locations_on_name"

  create_table "consumer_apps", :force => true do |t|
    t.string   "name"
    t.string   "uri"
    t.integer  "repository_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "consumer_apps", ["uri"], :name => "index_consumer_apps_on_uri", :unique => true

  create_table "consumer_apps_messages", :id => false, :force => true do |t|
    t.integer "message_id"
    t.integer "consumer_app_id"
  end

  add_index "consumer_apps_messages", ["consumer_app_id", "message_id"], :name => "consumer_apps_messages_joins_index", :unique => true

  create_table "consumer_apps_publications", :id => false, :force => true do |t|
    t.integer "consumer_app_id", :null => false
    t.integer "publication_id",  :null => false
  end

  add_index "consumer_apps_publications", ["consumer_app_id", "publication_id"], :name => "consumer_app_publication_index"

  create_table "consumer_apps_wufoo_forms", :id => false, :force => true do |t|
    t.integer "consumer_app_id"
    t.integer "wufoo_form_id"
  end

  add_index "consumer_apps_wufoo_forms", ["consumer_app_id", "wufoo_form_id"], :name => "consumer_apps_wufoo_forms_joins_index", :unique => true

  create_table "content_categories", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "parent_id"
  end

  create_table "contents", :force => true do |t|
    t.string   "title"
    t.string   "subtitle"
    t.string   "authors"
    t.text     "raw_content"
    t.datetime "created_at",                                :null => false
    t.datetime "updated_at",                                :null => false
    t.string   "copyright"
    t.string   "guid"
    t.datetime "pubdate"
    t.string   "url"
    t.string   "authoremail"
    t.integer  "publication_id"
    t.boolean  "quarantine",             :default => false
    t.datetime "timestamp"
    t.integer  "parent_id"
    t.integer  "content_category_id"
    t.integer  "channelized_content_id"
    t.boolean  "published",              :default => false
    t.string   "channel_type"
    t.integer  "channel_id"
  end

  add_index "contents", ["authoremail"], :name => "index_contents_on_authoremail"
  add_index "contents", ["authors"], :name => "authors"
  add_index "contents", ["channel_id"], :name => "index_contents_on_channel_id"
  add_index "contents", ["channel_type"], :name => "index_contents_on_channel_type"
  add_index "contents", ["channelized_content_id"], :name => "index_contents_on_channelized_content_id"
  add_index "contents", ["content_category_id"], :name => "content_category_id"
  add_index "contents", ["guid"], :name => "guid"
  add_index "contents", ["parent_id"], :name => "index_contents_on_parent_id"
  add_index "contents", ["pubdate"], :name => "pubdate"
  add_index "contents", ["publication_id"], :name => "source_id"
  add_index "contents", ["published"], :name => "index_contents_on_published"
  add_index "contents", ["title"], :name => "title"

  create_table "contents_locations", :force => true do |t|
    t.integer  "content_id"
    t.integer  "location_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "contents_locations", ["content_id", "location_id"], :name => "index_contents_locations_on_content_id_and_location_id"
  add_index "contents_locations", ["content_id"], :name => "index_contents_locations_on_content_id"
  add_index "contents_locations", ["location_id", "content_id"], :name => "index_contents_locations_on_location_id_and_content_id"
  add_index "contents_locations", ["location_id"], :name => "index_contents_locations_on_location_id"

  create_table "event_instances", :force => true do |t|
    t.integer  "event_id"
    t.datetime "start_date"
    t.datetime "end_date"
    t.string   "subtitle_override"
    t.text     "description_override"
    t.datetime "created_at",           :null => false
    t.datetime "updated_at",           :null => false
  end

  add_index "event_instances", ["end_date"], :name => "index_event_instances_on_end_date"
  add_index "event_instances", ["event_id"], :name => "index_event_instances_on_event_id"
  add_index "event_instances", ["start_date"], :name => "index_event_instances_on_start_date"

  create_table "events", :force => true do |t|
    t.string   "event_type"
    t.integer  "venue_id"
    t.string   "cost"
    t.string   "event_url"
    t.string   "sponsor"
    t.string   "sponsor_url"
    t.text     "links"
    t.boolean  "featured"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
    t.string   "contact_phone"
    t.string   "contact_email"
    t.string   "contact_url"
  end

  add_index "events", ["featured"], :name => "index_events_on_featured"
  add_index "events", ["venue_id"], :name => "events_on_venue_id_index"
  add_index "events", ["venue_id"], :name => "index_events_on_venue_id"

  create_table "images", :force => true do |t|
    t.string   "caption"
    t.string   "credit"
    t.string   "image"
    t.string   "imageable_type"
    t.integer  "imageable_id"
    t.datetime "created_at",                    :null => false
    t.datetime "updated_at",                    :null => false
    t.string   "source_url",     :limit => 400
  end

  add_index "images", ["imageable_type", "imageable_id"], :name => "index_images_on_imageable_type_and_imageable_id"

  create_table "locations", :force => true do |t|
    t.string   "zip"
    t.string   "city"
    t.string   "state"
    t.string   "county"
    t.string   "lat"
    t.string   "long"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "locations_locations", :force => true do |t|
    t.integer  "parent_id"
    t.integer  "child_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "locations_locations", ["child_id", "parent_id"], :name => "index_locations_locations_on_child_id_and_parent_id"
  add_index "locations_locations", ["child_id"], :name => "index_locations_locations_on_child_id"
  add_index "locations_locations", ["parent_id", "child_id"], :name => "index_locations_locations_on_parent_id_and_child_id"
  add_index "locations_locations", ["parent_id"], :name => "index_locations_locations_on_parent_id"

  create_table "locations_publications", :force => true do |t|
    t.integer  "location_id"
    t.integer  "publication_id"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  add_index "locations_publications", ["location_id", "publication_id"], :name => "index_locations_publications_on_location_id_and_publication_id"
  add_index "locations_publications", ["location_id"], :name => "index_locations_publications_on_location_id"
  add_index "locations_publications", ["publication_id", "location_id"], :name => "index_locations_publications_on_publication_id_and_location_id"
  add_index "locations_publications", ["publication_id"], :name => "index_locations_publications_on_publication_id"

  create_table "market_posts", :force => true do |t|
    t.string   "cost"
    t.string   "contact_phone"
    t.string   "contact_email"
    t.string   "contact_url"
    t.string   "locate_name"
    t.string   "locate_address"
    t.float    "latitude"
    t.float    "longitude"
    t.boolean  "locate_include_name"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  create_table "messages", :force => true do |t|
    t.integer  "created_by_id"
    t.string   "controller"
    t.string   "action"
    t.datetime "start_date"
    t.datetime "end_date"
    t.text     "content"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "notifiers", :force => true do |t|
    t.integer  "user_id"
    t.integer  "notifyable_id"
    t.string   "notifyable_type"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  create_table "organizations", :force => true do |t|
    t.string   "name"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.string   "org_type"
    t.text     "notes"
    t.string   "tagline"
    t.text     "links"
    t.text     "social_media"
    t.text     "general"
    t.string   "header"
    t.string   "logo"
  end

  create_table "promotions", :force => true do |t|
    t.boolean  "active"
    t.string   "banner"
    t.integer  "publication_id"
    t.integer  "content_id"
    t.text     "description"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
    t.string   "target_url"
  end

  add_index "promotions", ["content_id"], :name => "index_promotions_on_content_id"
  add_index "promotions", ["publication_id"], :name => "index_promotions_on_publication_id"

  create_table "publications", :force => true do |t|
    t.string   "name"
    t.datetime "created_at",                               :null => false
    t.datetime "updated_at",                               :null => false
    t.string   "logo"
    t.integer  "organization_id"
    t.string   "website"
    t.string   "publishing_frequency"
    t.text     "notes"
    t.integer  "parent_id"
    t.string   "category_override"
    t.text     "tagline"
    t.text     "links"
    t.text     "social_media"
    t.text     "general"
    t.text     "header"
    t.string   "pub_type"
    t.boolean  "display_attributes",    :default => false
    t.string   "reverse_publish_email"
    t.boolean  "can_reverse_publish",   :default => false
  end

  add_index "publications", ["name"], :name => "index_publications_on_name", :unique => true

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.integer  "resource_id"
    t.string   "resource_type"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "roles", ["name", "resource_type", "resource_id"], :name => "index_roles_on_name_and_resource_type_and_resource_id"
  add_index "roles", ["name"], :name => "index_roles_on_name"


  create_table "users", :force => true do |t|
    t.string   "email",                  :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
    t.string   "name"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "organization_id"
    t.integer  "default_repository_id"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "users_roles", :id => false, :force => true do |t|
    t.integer "user_id"
    t.integer "role_id"
  end

  add_index "users_roles", ["user_id", "role_id"], :name => "index_users_roles_on_user_id_and_role_id"

  create_table "wufoo_forms", :force => true do |t|
    t.string   "form_hash"
    t.string   "email_field"
    t.string   "name"
    t.text     "call_to_action"
    t.string   "controller"
    t.string   "action"
    t.boolean  "active",         :default => true
    t.datetime "created_at",                       :null => false
    t.datetime "updated_at",                       :null => false
    t.string   "page_url_field"
  end

  add_index "wufoo_forms", ["controller", "action", "active"], :name => "index_wufoo_forms_on_controller_and_action_and_active", :unique => true

end
