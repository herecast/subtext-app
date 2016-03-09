import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  modelNameFromPayloadKey(payloadKey) {
    if (payloadKey === 'businesses') {
      return this._super('business-profile');
    } else if (payloadKey === 'business') {
      return this._super('business-profile');
    }else {
      return this._super(payloadKey);
    }
  }
});
