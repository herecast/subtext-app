import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {

    if (Object.keys(payload).includes('feed_items')) {
      primaryModelClass = this.store.modelFor('feed-item');
    }

    if (Object.keys(payload).includes('comments')) {
      primaryModelClass = this.store.modelFor('comment');
    }

    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
