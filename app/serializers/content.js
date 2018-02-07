import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    images: {
      deserialize: 'records',
      serialize: false
    },
    comments: {
      deserialize: 'records',
      serialize: false
    },
    contentLocations: {
      deserialize: 'records',
      serialize: false
    },
    otherEventInstances: {
      deserialize: 'records',
      serialize: false
    }
  },

  normalize(klass, data) {
    data['other_event_instances'] = data['event_instances'];
    delete data['event_instances'];

    return this._super(klass, data);
  }
});
