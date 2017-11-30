import DS from 'ember-data';
import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,
  attrs: {
    eventInstances: { embedded: 'always' },
    contentLocations: { embedded: 'always' },
    comments: { embedded: 'always' }
  },

  serialize(snapshot, options) {
    const json = this._super(snapshot, options);

    delete json.updated_at;
    delete json.base_location_names;

    return json;
  }
});
