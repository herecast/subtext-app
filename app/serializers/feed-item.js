import DS from 'ember-data';
import ApplicationSerializer from './application';
import camelizeString from 'subtext-ui/utils/camelize-string';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    carousel: { embedded: 'always' },
    feedContent: { embedded: 'always' },
    organization: { embedded: 'always' }
  },

  modelNameFromPayloadKey() {
    return this._super('feed-item');
  },

  normalize(typeClass, hash) {
    const modelType = hash.model_type;
    hash.model_type = camelizeString(modelType);

    return this._super.apply(this, [typeClass, hash]);
  }
});
