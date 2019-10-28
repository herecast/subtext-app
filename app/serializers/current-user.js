import Caster from './caster';

export default Caster.extend({
  // The current user endpoint does not take an ID, so we override the ID
  // to be 'self'. This prevents multiple records from being created.
  normalizeResponse(store, typeClass, payload, id, requestType) {
    const current_user = payload.current_user || false;

    if (current_user) {
      payload.current_user.user_id = payload.current_user.id;
      payload.current_user.id = 'self';

      return this._super(store, typeClass, payload, id, requestType);
    }

    return this._super(...arguments);
  }
});
