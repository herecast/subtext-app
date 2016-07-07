import DS from 'ember-data';
import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,
  attrs: {
    categories: { serialize: 'ids' }
  },

  modelNameFromPayloadKey(payloadKey) {
    if (payloadKey === 'businesses') {
      return this._super('business-profile');
    } else if (payloadKey === 'business') {
      return this._super('business-profile');
    }else {
      return this._super(payloadKey);
    }
  },

  payloadKeyFromModelName() {
    return 'business';
  },

  serialize() {
    let result = this._super(...arguments);

    // Remove read only attributes that should not be sent to the API
    delete result.images;
    delete result.views;
    delete result.feedback_num;
    delete result.logo;
    delete result.can_edit;
    delete result.has_rated;
    delete result.organization_id;
    delete result.feedback;
    delete result.coords;

    return result;
  }
});
