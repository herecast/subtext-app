import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,
  attrs: {
    location: {
      embedded: 'always'
    },
    organizationHides: {
      embedded: 'always'
    },
    organizationSubscriptions: {
      embedded: 'always'
    }
  },
  // The current user endpoint does not take an ID, so we override the ID
  // to be 'self'. This prevents multiple records from being created.
  normalizeResponse(store, typeClass, payload, id, requestType) {
    payload.current_user.user_id = payload.current_user.id;
    payload.current_user.id = 'self';

    return this._super(store, typeClass, payload, id, requestType);
  },

  serialize(snapshot, options) {
    const json = this._super(snapshot, options);

    // Remove read only attributes that should not be sent to the API
    //delete json.location;

    if (json.location) {
      json.location_id = json.location.id;
      delete json.location;
    }
    delete json.can_publish_news;
    delete json.created_at;
    return json;
  }
});
