import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend({
  // The current user endpoint does not take an ID, so we override the ID
  // to be 'self'. This prevents multiple records from being created.
  // Since we also need to send the ID to Mixpanel, we're assigining it to
  // another variable.
  extract(store, typeClass, payload, id, requestType) {
    payload.current_user.user_id = payload.current_user.id;
    payload.current_user.id = 'self';
    return this._super(store, typeClass, payload, id, requestType);
  },

  serialize(snapshot, options) {
    const json = this._super(snapshot, options);

    // Remove read only attributes that should not be sent to the API
    delete json.location;
    return json;
  }
});
