import DS from 'ember-data';
import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,

  serialize() {
    let json = this._super(...arguments);

    return {
      content_id: json.content_id,
      flag_type: json.flag_type
    };
  }
});
