import DS from 'ember-data';
import Ember from 'ember';
import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,
  attrs: {
    schedules: { embedded: 'always' },
    contentLocations: { embedded: 'always' }
  },

  serialize(snapshot, options) {
    const json = this._super(snapshot, options);

    // If a user creates a new venue, we need to nest it inside of a "venue"
    // namespace so the API knows to create it.
    if (!json.venue_id) {
      json.venue = {};
      json.venue.address = json.venue_address;
      json.venue.city = json.venue_city;
      json.venue.name = json.venue_name;
      json.venue.state = json.venue_state;
      json.venue.status = json.venue_status;
      json.venue.venue_url = json.venue_url;
      json.venue.zip = json.venue_zip;
    }

    // Remove embedded schedule attributes that should not be sent to the API
    json.schedules = json.schedules.map((schedule) => {
      return Ember.Object.create(schedule).getProperties(
        'id', 'subtitle', 'starts_at', 'ends_at', 'presenter_name', 'repeats',
        'days_of_week', 'overrides', 'weeks_of_month', '_remove', 'end_date'
      );
    });

    // Remove read only attributes that should not be sent to the API
    delete json.content_id;
    delete json.ends_at;
    delete json.first_instance_id;
    delete json.image_url;
    delete json.subtitle;
    delete json.starts_at;
    delete json.venue_address;
    delete json.venue_city;
    delete json.venue_name;
    delete json.venue_state;
    delete json.venue_url;
    delete json.venue_zip;
    delete json.owner_name;
    delete json.can_edit;
    delete json.base_location_names;
    delete json.comment_count;
    delete json.content_locations;

    return json;
  }
});
