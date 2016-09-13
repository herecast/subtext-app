import DS from 'ember-data';
import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,

  serialize() {
    let result = this._super(...arguments);

    // Remove read only attributes that should not be sent to the API
    delete result.email;
    delete result.listserv_id;
    delete result.user_id;
    delete result.confirmed_at;
    delete result.created_at;
    delete result.unsubscribed_at;

    return result;
  }
});
