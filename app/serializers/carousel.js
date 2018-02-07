import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    organizations: { embedded: 'always' },
    contents: { embedded: 'always' }
  }
});
