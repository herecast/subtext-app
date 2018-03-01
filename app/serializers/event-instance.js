import DS from 'ember-data';
import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend(DS.EmbeddedRecordsMixin, {
  isNewSerializerAPI: true,
  attrs: {
    images: {
      deserialize: 'records',
      serialize: false
    },
    otherEventInstances: {
      deserialize: 'records',
      serialize: false
    },
    comments: { embedded: 'always' },
    baseLocations: {
      deserialize: 'ids',
      serialize: false
    }
  },

  normalize(klass, data) {
    data['other_event_instances'] = data['event_instances'];
    delete data['event_instances'];

    return this._super(klass, data);
  },

  serialize() {
    return {}; // READ ONLY MODEL
  }
});
