import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    primaryModelClass = this.store.modelFor('bookmark');

    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
