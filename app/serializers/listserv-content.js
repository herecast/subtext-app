import DS from 'ember-data';
import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,

  serialize() {
    let result = this._super(...arguments);

    // Remove read only attributes that should not be sent to the API
    delete result.user_id;
    delete result.verified_at;
    delete result.listserv_id;
    delete result.live_date;
    delete result.enhancedPost;

    return result;
  }
});
