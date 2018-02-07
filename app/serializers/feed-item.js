import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    carousel: { embedded: 'always' },
    content: { embedded: 'always' },
    organization: { embedded: 'always' }
  },

  modelNameFromPayloadKey() {
    return this._super('feed-item');
  },

  normalize(typeClass, hash) {
    let modelType = hash.model_type;
    hash.model_type = modelType.camelize();

    return this._super.apply(this, [typeClass, hash]);
  }
});
