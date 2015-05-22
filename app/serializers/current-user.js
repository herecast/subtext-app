import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend({
  // The current user endpoint does not take an ID, so we override the ID
  // to be 'self'. This prevents multiple records from being created.
  extract(store, typeClass, payload, id, requestType) {
    payload.current_user.id = 'self';
    return this._super(store, typeClass, payload, id, requestType);
  }
});
