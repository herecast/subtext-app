import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    images: { embedded: 'always' },
    comments: { embedded: 'always' },
    contentLocations: { embedded: 'always' },
    eventInstances: { embedded: 'always' }
  },

  modelNameFromPayloadKey() {
    return this._super('feed-content');
  },

  payloadKeyFromModelName() {
    return 'content';
  }
});
