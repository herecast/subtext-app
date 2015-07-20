import DS from 'ember-data';
import Ember from 'ember';
import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    eventInstances: { embedded: 'always' }
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
      json.venue.venue_url = json.venue_url;
      json.venue.zip = json.venue_zip;
    }

    // Remove embedded event instance attributes that should not be sent to the API
    json.event_instances = json.event_instances.map((instance) => {
      return Ember.Object.create(instance).getProperties(
        'id', 'subtitle', 'starts_at', 'ends_at'
      );
    });

    // Remove read only attributes that should not be sent to the API
    delete json.ends_at;
    delete json.image_url;
    delete json.subtitle;
    delete json.starts_at;
    delete json.venue_address;
    delete json.venue_city;
    delete json.venue_name;
    delete json.venue_state;
    delete json.venue_url;
    delete json.venue_zip;

    return json;
  }
});
