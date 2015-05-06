import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend({
  serialize(snapshot, options) {
    const json = this._super(snapshot, options);

    // Remove read only attributes that should not be sent to the API
    delete json.ends_at;
    delete json.image_url;
    delete json.subtitle;
    delete json.starts_at;
    delete json.venue_address;
    delete json.venue_city;
    delete json.venue_name;
    delete json.venue_phone;
    delete json.venue_state;
    delete json.venue_url;
    delete json.venue_zipcode;

    return json;
  }
});
